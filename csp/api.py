import json
import re
import sys
import types
import os
from collections import defaultdict, deque
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.llms import Ollama

# --- Fix for Windows ---
if sys.platform == "win32":
    sys.modules['pwd'] = types.ModuleType('pwd')

# --- FastAPI app ---
app = FastAPI(title="Freelancer Chatbot API with Memory + General Chat")

# --- API key for authentication ---
API_KEY = "Vishnu@2004"

# === Load Data ===
with open("data/freelancers.json", "r", encoding="utf-8") as f:
    freelancers_data = json.load(f)

with open("data/website_info.txt", "r", encoding="utf-8") as f:
    content = f.read()

sections_data = {}
current_section = None
for line in content.splitlines():
    line = line.strip()
    if line.startswith("## "):
        current_section = line[3:].strip()
        sections_data[current_section] = ""
    elif current_section:
        sections_data[current_section] += line + "\n"

# === Helper Functions ===
def filter_top_freelancers(freelancers, query, limit=None, per_category=None):
    city_match = re.search(r"in ([\w\s]+)", query, re.IGNORECASE)
    city = city_match.group(1).strip() if city_match else None

    sorted_freelancers = sorted(
        freelancers,
        key=lambda f: (
            f.get("averageRating", 0),
            len(f.get("projects", []))
        ),
        reverse=True
    )

    if city:
        sorted_freelancers = [
            f for f in sorted_freelancers if f.get("city", "").lower() == city.lower()
        ]

    if per_category:
        grouped = defaultdict(list)
        for f in sorted_freelancers:
            cat = f.get("category", "Other")
            if len(grouped[cat]) < per_category:
                grouped[cat].append(f)
        sorted_freelancers = [f for group in grouped.values() for f in group]

    if limit:
        return sorted_freelancers[:limit]
    return sorted_freelancers


def create_documents(freelancers):
    docs = []
    for f in freelancers:
        projects_info = "\n".join([
            f"Title: {p['projectTitle']}, Rating: {p.get('rating', 0)}"
            for p in f.get("projects", [])
        ])
        text = f"""
Name: {f['name']}
Category: {f['category']}
City: {f.get('city', 'N/A')}
Price: {f['price']}
Average Rating: {f.get('averageRating', 0)}
Number of Projects: {len(f.get('projects', []))}
Projects:
{projects_info}
"""
        docs.append(text)
    return docs


# === Intent Classification ===
intent_prompt_template = """
You are an AI assistant that classifies user queries into categories: 
1. FREELANCER_QUERY – The user wants suggestions about freelancers, skills, ratings, city, or projects.
2. SUPPORT_QUERY – The user wants information about the website, policies, contact info, FAQ, or customer support.
3. GENERAL_CHAT – The user is greeting, thanking, or having a normal conversation (e.g., "hi", "hello", "how are you", etc.)
If the query involves both freelancers and support, respond with "BOTH".
Respond with one word only: FREELANCER_QUERY, SUPPORT_QUERY, GENERAL_CHAT, or BOTH.
User Query: "{query}"
"""

llm_intent = Ollama(model="mistral")

def classify_intent(query: str) -> str:
    """Robust intent classification with safe defaults."""
    # Handle trivial greetings directly
    if re.match(r"^(hi|hello|hey|yo|good\s(morning|evening|afternoon))$", query.strip().lower()):
        return "GENERAL_CHAT"

    prompt = intent_prompt_template.format(query=query)
    try:
        intent_raw = llm_intent(prompt)
    except Exception:
        return "GENERAL_CHAT"

    intent = str(intent_raw).strip().upper()

    # Normalize classifier outputs
    if "FREELANCER" in intent:
        return "FREELANCER_QUERY"
    elif "SUPPORT" in intent:
        return "SUPPORT_QUERY"
    elif "BOTH" in intent:
        return "BOTH"
    elif "GENERAL" in intent or "CHAT" in intent or "CONVERSATION" in intent:
        return "GENERAL_CHAT"
    else:
        # Default to general chat if unclear
        return "GENERAL_CHAT"


# === Preload Embeddings & FAISS ===
print("🔧 Initializing Ollama Embeddings and FAISS stores...")

embeddings_model = OllamaEmbeddings(model="nomic-embed-text")

FAISS_FREELANCERS_PATH = "data/faiss_freelancers_index"
FAISS_SUPPORT_PATH = "data/faiss_support_index"

# --- Freelancer embeddings ---
if os.path.exists(FAISS_FREELANCERS_PATH):
    print("✅ Loading existing freelancer FAISS index...")
    freelancer_db = FAISS.load_local(
        FAISS_FREELANCERS_PATH,
        embeddings_model,
        allow_dangerous_deserialization=True
    )
else:
    print("⚙️ Creating new freelancer FAISS index...")
    freelancer_docs = create_documents(freelancers_data)
    freelancer_db = FAISS.from_texts(freelancer_docs, embeddings_model)
    freelancer_db.save_local(FAISS_FREELANCERS_PATH)

freelancer_retriever = freelancer_db.as_retriever(search_kwargs={"k": 8})

# --- Support embeddings ---
if os.path.exists(FAISS_SUPPORT_PATH):
    print("✅ Loading existing support FAISS index...")
    support_db = FAISS.load_local(
        FAISS_SUPPORT_PATH,
        embeddings_model,
        allow_dangerous_deserialization=True
    )
else:
    print("⚙️ Creating new support FAISS index...")
    support_docs = [f"{title}: {text}" for title, text in sections_data.items()]
    support_db = FAISS.from_texts(support_docs, embeddings_model)
    support_db.save_local(FAISS_SUPPORT_PATH)

support_retriever = support_db.as_retriever(search_kwargs={"k": 3})

# --- Initialize LLMs ---
llm_freelancer = Ollama(model="llama3")
llm_support = Ollama(model="llama3")
llm_general = Ollama(model="llama3")

# --- Prompt templates ---
freelancer_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are an AI assistant that helps clients find the best freelancer.
Use the provided context (freelancer profiles) to answer queries.
Always include freelancer names, categories, ratings, number of projects, and city in your answer.

Context:
{context}

Question: {question}

Helpful Answer:"""
)

support_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are a helpful support assistant for a freelancer marketplace.
Answer questions clearly using only the provided website information.
Be concise and friendly.

Context:
{context}

Question: {question}

Helpful Answer:"""
)

# --- Create retrieval chains ---
freelancer_qa_chain = RetrievalQA.from_chain_type(
    llm=llm_freelancer,
    chain_type="stuff",
    retriever=freelancer_retriever,
    chain_type_kwargs={"prompt": freelancer_prompt},
)

support_qa_chain = RetrievalQA.from_chain_type(
    llm=llm_support,
    chain_type="stuff",
    retriever=support_retriever,
    chain_type_kwargs={"prompt": support_prompt},
)

print("🚀 All embeddings and QA chains ready. Chatbot loaded successfully!")

# === Short-term memory ===
session_memory = defaultdict(lambda: deque(maxlen=3))

# === API Models ===
class QueryRequest(BaseModel):
    message: str


# === Chat Endpoint ===
@app.post("/chat")
async def chat_endpoint(req: QueryRequest, x_api_key: str = Header(None), x_session_id: str = Header("default")):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    query = req.message.strip()
    chat_history = "\n".join(list(session_memory[x_session_id]))

    intent = classify_intent(query)
    response = {}

    # --- GENERAL CHAT ---
    if intent == "GENERAL_CHAT":
        general_prompt = (
            f"You are a friendly AI assistant having a casual conversation with the user.\n"
            f"Here is the recent conversation:\n{chat_history}\n\n"
            f"User: {query}\nAI:"
        )
        general_reply = llm_general(general_prompt)
        response["general_answer"] = general_reply.strip()

    # --- SUPPORT ---
    elif intent in ["SUPPORT_QUERY", "BOTH"]:
        support_answer = support_qa_chain.run(query)
        response["support_answer"] = support_answer

    # --- FREELANCER ---
    if intent in ["FREELANCER_QUERY", "BOTH"]:
        freelancer_answer = freelancer_qa_chain.run(query)
        response["freelancer_answer"] = freelancer_answer

    # --- Fallback (always respond conversationally) ---
    if not response:
        fallback_prompt = (
            f"You are a friendly and intelligent chatbot. The user said: '{query}'. "
            f"Reply naturally and conversationally like ChatGPT."
        )
        fallback_reply = llm_general(fallback_prompt)
        response["general_answer"] = fallback_reply.strip()

    # Save conversation
    full_turn = f"User: {query}\nAI: {list(response.values())[0]}"
    session_memory[x_session_id].append(full_turn)

    return response

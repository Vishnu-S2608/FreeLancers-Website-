import json
import streamlit as st
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.llms import Ollama
import re
import sys
import types

# --- Fix for Windows: fake 'pwd' module ---
if sys.platform == "win32":
    sys.modules['pwd'] = types.ModuleType('pwd')

# ========== LOAD FREELANCERS ==========
def load_freelancers(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    for freelancer in data:
        freelancer["num_projects"] = len(freelancer.get("projects", []))
    return data

# ========== LOAD WEBSITE SECTIONS ==========
def load_website_sections(txt_path):
    sections = {}
    with open(txt_path, "r", encoding="utf-8") as f:
        content = f.read()
    current_section = None
    for line in content.splitlines():
        line = line.strip()
        if line.startswith("## "):
            current_section = line[3:].strip()
            sections[current_section] = ""
        elif current_section:
            sections[current_section] += line + "\n"
    return sections

# ========== SELECT TOP FREELANCERS ==========
def filter_top_freelancers(freelancers, query):
    city_match = re.search(r"in (\w+)", query, re.IGNORECASE)
    city = city_match.group(1) if city_match else None

    sorted_freelancers = sorted(
        freelancers,
        key=lambda f: (
            f.get("averageRating", 0),
            f.get("num_projects", 0)
        ),
        reverse=True
    )

    if city:
        sorted_freelancers = [
            f for f in sorted_freelancers if f.get("city", "").lower() == city.lower()
        ]

    return sorted_freelancers[:5]

# ========== CREATE DOCUMENTS FOR RAG ==========
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
Number of Projects: {f.get('num_projects', 0)}
Projects:
{projects_info}
"""
        docs.append(text)
    return docs

# ========== INTENT CLASSIFICATION ==========
intent_prompt_template = """
You are an AI assistant that classifies user queries into categories: 
1. FREELANCER_QUERY – The user wants suggestions about freelancers, skills, ratings, city, or projects.
2. SUPPORT_QUERY – The user wants information about the website, policies, contact info, FAQ, or customer support.

If the query involves both freelancers and support, respond with "BOTH".

Respond with one word: FREELANCER_QUERY, SUPPORT_QUERY, or BOTH.

User Query: "{query}"
"""

llm_intent = Ollama(model="llama3")

def classify_intent(query: str) -> str:
    prompt = intent_prompt_template.format(query=query)
    intent = llm_intent(prompt)
    return intent.strip().upper()

# ========== GET CONCISE SUPPORT ANSWER ==========
def get_relevant_support_answer(query, sections):
    prompt = f"""
You are an AI assistant. The user asked a question about our website support.

Here are the sections of our website info:

{json.dumps(sections)}

User Question: "{query}"

Instructions:
- Select the section that best answers the question.
- Provide a clear and concise answer (1–2 short paragraphs) using only information from that section.
- Do NOT include unrelated sections.
- Make the answer friendly and easy to read.
"""
    llm = Ollama(model="llama3")
    answer = llm(prompt)
    return answer

# ========== STREAMLIT UI ==========
def run_streamlit():
    st.title("💼 Freelancer Connect Chatbot")
    st.write("Ask about the best freelancers or website/customer support!")

    query = st.text_input("Enter your question:")

    if st.button("Search") and query:
        intent = classify_intent(query)
        freelancers = load_freelancers("data/freelancers.json")
        sections = load_website_sections("data/website_info.txt")

        # --- Handle support queries ---
        if intent in ["SUPPORT_QUERY", "BOTH"]:
            support_answer = get_relevant_support_answer(query, sections)
            st.write("### 🤖 AI Response (Website Info):")
            st.write(support_answer)

        # --- Handle freelancer queries ---
        if intent in ["FREELANCER_QUERY", "BOTH"]:
            top_freelancers = filter_top_freelancers(freelancers, query)
            documents = create_documents(top_freelancers)

            with st.spinner("🔍 Creating embeddings..."):
                embeddings = OllamaEmbeddings(model="nomic-embed-text")
                db = FAISS.from_texts(documents, embeddings)
                retriever = db.as_retriever(search_kwargs={"k": 5})

                llm = Ollama(model="llama3")

                template = """You are an AI assistant that helps clients find the best freelancer.
Use the provided context (freelancer profiles) to answer queries.
Always include freelancer names, categories, ratings, number of projects, and city in your answer.

Context:
{context}

Question: {question}

Helpful Answer:"""

                prompt = PromptTemplate(
                    input_variables=["context", "question"],
                    template=template,
                )

                qa_chain = RetrievalQA.from_chain_type(
                    llm=llm,
                    chain_type="stuff",
                    retriever=retriever,
                    chain_type_kwargs={"prompt": prompt}
                )

                result = qa_chain.run(query)
                st.write("### 🤖 AI Response (Freelancers):")
                st.write(result)

        # --- Handle unknown intent ---
        if intent not in ["SUPPORT_QUERY", "FREELANCER_QUERY", "BOTH"]:
            st.write("### 🤖 AI Response:")
            st.write("Sorry, I could not determine your intent. Please ask about freelancers or website info.")

# ========== MAIN ==========
if __name__ == "__main__":
    run_streamlit()

// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";

const ChatBot = ({ sendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sidebar width
  const [width, setWidth] = useState(350);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to backend
const handleSend = async () => {
  if (!input.trim()) return;
  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const botResponse = await sendMessage(input);
    const newMessages = [];

    if (botResponse.freelancer_answer) {
      newMessages.push({
        sender: "bot",
        text: `💼 Freelancer Suggestion:\n${botResponse.freelancer_answer}`,
      });
    }

    if (botResponse.support_answer) {
      newMessages.push({
        sender: "bot",
        text: `ℹ️ Website Info:\n${botResponse.support_answer}`,
      });
    }

    // ✅ FIX: Handle general chat response
    if (botResponse.general_answer) {
      newMessages.push({
        sender: "bot",
        text: botResponse.general_answer,
      });
    }

    // ✅ FIX: Handle fallback message if Python sends an "error"
    if (botResponse.error) {
      newMessages.push({
        sender: "bot",
        text: `❌ ${botResponse.error}`,
      });
    }

    // ✅ FIX: If absolutely nothing recognized, don't show "could not understand"
    if (newMessages.length === 0) {
      newMessages.push({
        sender: "bot",
        text:
          "I'm here to help! You can ask me about freelancers, website info, or just chat 😊",
      });
    }

    setMessages((prev) => [...prev, ...newMessages]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "❌ Sorry, I could not process your message." },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  // Handle mouse move for resizing sidebar
  const handleMouseMove = (e) => {
    if (isResizingSidebar) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 250 && newWidth <= 600) {
        setWidth(newWidth);
      }
    }
  };

  // Stop resizing when mouse released
  useEffect(() => {
    const handleMouseUp = () => setIsResizingSidebar(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 z-50 w-16 h-16 rounded-full bg-indigo-600 shadow-lg flex items-center justify-center text-white text-2xl hover:bg-indigo-700 transition-all duration-300"
        // Move the button dynamically so it never overlaps sidebar
        style={{
          right: isOpen ? width + 24 : 24, // dynamically adjust position
          transition: "right 0.1s ease",
        }}
      >
        💬
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-40 h-full bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width }}
      >
        {/* Sidebar resize handle */}
        <div
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize bg-gray-200 hover:bg-gray-400"
          onMouseDown={() => setIsResizingSidebar(true)}
        ></div>

        {/* Header */}
        <div className="bg-indigo-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
          {/* Auto-resizing logo */}
          <div
            style={{
              width: Math.max(80, Math.min(width * 0.35, 200)),
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            🤖 ChatBot
          </div>

          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${m.sender === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  m.sender === "user"
                    ? "bg-indigo-100 text-gray-800"
                    : "bg-gray-200 text-gray-900"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {m.text}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-left text-gray-500">🤖 Bot is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-300 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you?"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;

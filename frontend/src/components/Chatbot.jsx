import Cerebras from '@cerebras/cerebras_cloud_sdk';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { useState } from 'react';


export default function Chatbot() {
  //chat bot logic : 
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const cerebclient = new Cerebras({
    apiKey:"csk-486fnf2r8tj5dhy3ryw29h4xhpc84rp6jx5f3mj5f3y8vwnc"
  })

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const transport  = new StreamableHTTPClientTransport({url:"/mcp"});
      const cclient    = new Client(transport);
      const userPrompt = input
      const completion = await cerebclient.chat.completions.create({
        messages:[
          {role:'system',content:'You are connected to a MCP server with a resource called "phones".This resource informs you about the stock of phones available in a store. Take the list of all phones and answer the question asked.'},
          {role:"user",content:userPrompt}
        ],
        model:"llama-4-scout-17b-16e-instruct"
      })
      const botReply = completion?.choices[0]?.message.content || "Sorry, I couldn’t get that.";
      setMessages((prev) => [...prev,{ sender: "bot", text: botReply },]);
    } catch (err) {
        console.error(err);
        setMessages((prev) => [...prev,{ sender: "bot", text: "Error reaching Cerebras API." },]);
    }
  };
  return (
    <div>
      {/* Chatbot button */}
      {/* Chatbot Button + Chat Window */}
      <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        💬
      </button>

      {/* Chat Window */}
      {showChat && (
        <div className="absolute bottom-20 right-0 w-80 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
            How can i help u ?
          </div>
          <div className="p-3 h-64 overflow-y-auto text-sm space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                m.sender === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100 text-left"
                }`}
              >
              {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

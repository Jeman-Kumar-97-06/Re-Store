import { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {useProductContext} from '../hooks/useProductContext';
import ProductCard from "../components/ProductCard";

import Cerebras from '@cerebras/cerebras_cloud_sdk';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const reviews = [
  "Great quality phones! Saved a lot of money.",
  "My refurbished phone works like brand new!", 
  "Best deals on refurbished smartphones. Highly recommend!"
];

export default function HomePage() {
  const [query, setQuery]  = useState("");
  const [results,setResults] = useState([]); 
  const [currentReview, setCurrentReview] = useState(0);
  const {products,dispatch} = useProductContext();

  //Definition of the function that fetches all products : 
  const fetchAllPhones = async () => {
    const resp = await fetch('http://localhost:4000/api/products',)
    const json = await resp.json();
    if (resp.ok) {
      dispatch({type:"SET_PRODS",payload:json});
    }
  };
 
  //fetchAllPhones should run everytime HomePage loads:
  useEffect(()=>{
    fetchAllPhones();
  },[])

  //Review changes every 3 seconds:
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  //Dynamic Product Search:
  useEffect(()=>{
    //If the products aren't loaded yet:
    if (!products) {
      // fetchAllPhones();
      console.log("ran this")
      return
    }
    //If the query length is zero
    if (query.length==0){
      setResults([]);
      fetchAllPhones();
      return;
    }
    const reslt = products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()));
    if (reslt.length == 0) {
      fetchAllPhones();
    }
    dispatch({type:"SET_PRODS",payload:reslt})
    setResults(reslt)
  },[query])

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
    // const chatCompletion = await cerebclient.chat.completions.create({
    //   messages:[{role:'user',content:""}],
    //   model:"llama-4-scout-17b-16e-instruct"
    // })

    // const data = await res.json();
    const transport  = new StreamableHTTPClientTransport({url:"http://localhost:4000/mcp"});
    const cclient    = new Client(transport);
    const userPrompt = input
    const completion = await cerebclient.chat.completions.create({
      messages:[
        {role:'system',content:'You are connected to a MCP server with a resource called "phones" take the list of all phones and answer the question asked.'},
        {role:"user",content:userPrompt}
      ],
      model:"llama-4-scout-17b-16e-instruct"
    })
    const botReply =
      completion?.choices[0]?.message.content || "Sorry, I couldn’t get that.";
    console.log(botReply)
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: botReply },
    ]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Error reaching Cerebras API." },
    ]);
  }
};




  //Main Shit:
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar/>

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <div className="relative w-3/4 max-w-lg">
          <input
            type="text"
            placeholder="Search for a phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute top-2 right-3 text-gray-400" size={20} />
          <ul className="p-3 bg-white">
            {results && results.map((item) => (
              <>
                <li className='hover:bg-blue-100 cursor-pointer' key={item._id}>{item.name}</li>
                <hr></hr>
              </>
            ))}
          </ul>
        </div>
      </div>

      {/* Featured Phones with Fade-in Scroll Effect */}
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products && products.map((phone, index) => (
           <ProductCard phone={phone} index={index} key={index}/>
        ))}
      </div>

      {/* Reviews Slideshow */}
      <div className="bg-gray-200 py-12 text-center">
        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
        <motion.div
          key={currentReview}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-xl font-medium text-gray-700"
        >
          "{reviews[currentReview]}"
        </motion.div>
      </div>

      {/* Environmental Impact Section */}
      <div className="bg-green-100 py-12 text-center px-6">
        <h2 className="text-3xl font-bold text-green-700">Refurbished Phones Help the Planet</h2>
        <p className="mt-4 text-lg text-gray-800">
          Buying refurbished phones reduces **electronic waste**, saves **energy**, and minimizes the need for new raw materials. By choosing a refurbished phone, you're making a **sustainable choice** for a better future.
        </p>
      </div>

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
  );
}

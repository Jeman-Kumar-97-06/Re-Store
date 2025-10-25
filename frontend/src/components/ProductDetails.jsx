import { useParams } from "react-router-dom";
import { useProductContext } from "../hooks/useProductContext";
import { motion } from "framer-motion";
import { Battery, Smartphone, Monitor } from "lucide-react";
import Chatbot from "./Chatbot";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProductContext();

  const product = products.find((p) => p._id === id);

  if (!product) {
    return (
      <h2 className="text-center text-red-600 text-2xl mt-20">
        Product not found
      </h2>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50 text-gray-900"
    >
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>

      {/* Product Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 bg-white rounded-xl shadow-md border border-gray-200 p-8">
        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex justify-center items-center w-full md:w-1/2"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-sm rounded-lg object-contain"
          />
        </motion.div>

        {/* Product Info */}
        <div className="flex flex-col justify-between w-full md:w-1/2">
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

            <div className="space-y-6">
              {/* Battery */}
              <div className="flex items-start">
                <Battery className="w-6 h-6 text-blue-500 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Battery</h3>
                  <p className="text-gray-700">{product.battery}</p>
                </div>
              </div>

              {/* Design */}
              <div className="flex items-start">
                <Smartphone className="w-6 h-6 text-green-500 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Design</h3>
                  <p className="text-gray-700">{product.design}</p>
                </div>
              </div>

              {/* Display */}
              <div className="flex items-start">
                <Monitor className="w-6 h-6 text-purple-500 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Display</h3>
                  <p className="text-gray-700">{product.display}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price + Button */}
          <div className="mt-8 flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-600">
              ₹{product.price}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <Chatbot />
      </div>
    </motion.div>
  );
}

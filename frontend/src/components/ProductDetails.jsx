import { useParams } from "react-router-dom";
import { useProductContext } from "../hooks/useProductContext";
import { motion } from "framer-motion";
import { Battery, Smartphone, Monitor } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const {products} = useProductContext();

  const product = products.find(p=>p._id === id);

  if (!product) {
    return <h2 className="text-center text-red-600 text-2xl">Product not found</h2>;
  }

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="relative min-h-screen w-full flex flex-col bg-gray-100"
  >
    {/* Back Button */}
    <button
      onClick={() => window.history.back()}
      className="absolute top-6 left-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
    >
      ← Back
    </button>

    {/* Main Card */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row justify-center items-center flex-1 bg-white shadow-lg rounded-none md:rounded-2xl border border-gray-200 mx-auto w-full md:w-10/12 p-8"
    >
      {/* Product Image */}
      <motion.img
        src={product.image}
        alt={product.name}
        className="w-72 md:w-96 rounded-xl object-contain"
        whileHover={{ scale: 1.05 }}
      />

      {/* Product Details */}
      <div className="mt-8 md:mt-0 md:ml-10 flex-1">
        <h2 className="text-4xl font-bold text-gray-900">{product.name}</h2>

        {/* Battery */}
        <div className="mt-5 flex items-start">
          <Battery className="w-7 h-7 text-blue-500 mt-1" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold">Battery</h3>
            <p className="text-gray-600">{product.battery}</p>
          </div>
        </div>

        {/* Design */}
        <div className="mt-5 flex items-start">
          <Smartphone className="w-7 h-7 text-green-500 mt-1" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold">Design</h3>
            <p className="text-gray-600">{product.design}</p>
          </div>
        </div>

        {/* Display */}
        <div className="mt-5 flex items-start">
          <Monitor className="w-7 h-7 text-purple-500 mt-1" />
          <div className="ml-3">
            <h3 className="text-lg font-semibold">Display</h3>
            <p className="text-gray-600">{product.display}</p>
          </div>
        </div>

        {/* Price + Add to Cart */}
        <div className="mt-10 flex justify-between items-center">
          <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md text-lg hover:bg-green-600 transition"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
  //   <motion.div 
  //   initial={{ opacity: 0 }} 
  //   animate={{ opacity: 1 }} 
  //   transition={{ duration: 0.6 }} 
  //   className="h-screen w-screen flex justify-center items-center bg-gray-100"
  // >
  //   <motion.div 
  //     initial={{ y: 20, opacity: 0 }} 
  //     animate={{ y: 0, opacity: 1 }} 
  //     transition={{ duration: 0.6 }} 
  //     className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 border flex flex-col md:flex-row items-center"
  //   >
  //     {/* Product Image */}
  //     <motion.img
  //       src={product.image}
  //       alt="iPhone 12"
  //       className="w-64 md:w-80 rounded-lg"
  //       whileHover={{ scale: 1.05 }}
  //     />

  //     {/* Product Details */}
  //     <div className="mt-6 md:mt-0 md:ml-10 flex-1">
  //       <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>

  //       {/* Battery Section */}
  //       <div className="mt-5 flex items-start">
  //         <Battery className="w-7 h-7 text-blue-500 mt-1" />
  //         <div className="ml-3">
  //           <h3 className="text-lg font-semibold">Battery</h3>
  //           <p className="text-gray-600">
  //             {product.battery}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Design Section */}
  //       <div className="mt-5 flex items-start">
  //         <Smartphone className="w-7 h-7 text-green-500 mt-1" />
  //         <div className="ml-3">
  //           <h3 className="text-lg font-semibold">Design</h3>
  //           <p className="text-gray-600">
  //             {product.design}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Display Section */}
  //       <div className="mt-5 flex items-start">
  //         <Monitor className="w-7 h-7 text-purple-500 mt-1" />
  //         <div className="ml-3">
  //           <h3 className="text-lg font-semibold">Display</h3>
  //           <p className="text-gray-600">
  //             {product.display}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Price & Button */}
  //       <div className="mt-8 flex justify-between items-center">
  //         <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
  //         <motion.button
  //           whileHover={{ scale: 1.05 }}
  //           whileTap={{ scale: 0.95 }}
  //           className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md text-lg"
  //         >
  //           Add to Cart
  //         </motion.button>
  //       </div>
  //     </div>
  //   </motion.div>
  // </motion.div>
  );
}
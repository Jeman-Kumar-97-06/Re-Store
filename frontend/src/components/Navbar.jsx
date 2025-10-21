import { ShoppingCart, Sun, Moon } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeContext } from "../hooks/useThemeContext";

const api = "926e21302b1f43dda1db35f1c5f3712e";
const Navbar = () => {   
    const {user}   = useAuthContext();
    const {logout} = useLogout();

    const [pin_c,setPin_c] = useState('Pincode');

    const handleLogout = () => {
      logout();
    }

    const handleGeoLocation = () => {
      setPin_c('wait...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const {latitude,longitude} = position.coords;
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${api}`);
            const data = await response.json();
            const comp = data.results[0]?.components;
            const pinc = comp?.postcode;
            if (pinc) {
              console.log("Pincode : ",pinc);
              setPin_c(pinc)
            }
            else {
              console.log("Pincode not found!")
            }
          },
          (error) => {
            console.error("Error getting location:",error.message);
          }
        )
      } else {
        console.error('Geolocation is not supported by this browser.');
      }   
    }

    //Code related to theme : 
    const {theme:deftheme,dispatch:tdispatch} = useThemeContext();
    const [theme,setTheme] = useState(deftheme);

    const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

    return (
    <nav className="bg-blue-500 text-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl pRPhones">RefurbStore</h1>
        <div className="flex items-center space-x-4">
          <Link to='/' className="text-white font-medium">{user._doc.name}</Link>
          <Link to='/cart'><ShoppingCart className="mr-2" size={18} /></Link>
          <button onClick={handleGeoLocation} className='text-white font-medium'>📍{pin_c}</button>
          
          {/* Dark/Light Theme Button */}
          <button
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button onClick={handleLogout} className="font-bold px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700">
            Logout
          </button>
        </div>
    </nav>
    )
};

export default Navbar;
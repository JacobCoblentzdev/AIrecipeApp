import { FiSearch, FiSettings, FiPlus } from 'react-icons/fi';
import { LuChefHat } from "react-icons/lu";

function Navbar({ onNavigate }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      
      {/* 1. Logo Section */}
      <div onClick = {() => onNavigate('dashboard')}
      className="flex items-center gap-2 cursor-pointer">
        <div className="bg-emerald-500 text-white p-1.5 rounded-[10px]">
          <LuChefHat size={24} />
        </div>
        <span className="text-2xl font-bold text-emerald-500 tracking-tight">
          Cookflow
        </span>
      </div>

      {/* 2. Search Section */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 hover:bg-gray-100 transition-colors">
          <FiSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            className="bg-transparent w-full ml-3 outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 3. Actions Section */}
      <div className="flex items-center gap-5">
        
        {/* Create Recipe Button */}
        <button 
          onClick={() => onNavigate('create-recipe')}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
          <FiPlus className="text-lg" /> Create Recipe
        </button>
        
        {/* Explore Button */}
        <button onClick={() => onNavigate('explore')}
        className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
          Explore Recipes
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* Settings Icon */}
        <button className="text-gray-500 hover:text-slate-800 transition-colors">
          <FiSettings className="text-xl" />
        </button>

        {/* User Profile Avatar with Online Dot */}
        <div className="relative cursor-pointer ml-1">
          <img
            src="https://i.pravatar.cc/150?img=68" // A placeholder avatar image
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          {/* The Green Status Dot */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        
      </div>
      
    </nav>
  );
}

export default Navbar;
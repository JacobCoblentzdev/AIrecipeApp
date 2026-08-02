import { useState } from 'react';
import { FiSearch, FiClock, FiStar, FiFilter, FiMoreVertical, FiX, FiCheck } from 'react-icons/fi';
import { LuChefHat } from "react-icons/lu";
import tacoImage from '../assets/taco.png';
import risottoImage from '../assets/Risotto-Recipe.jpg';
import pancakesImage from '../assets/pancakes.jpg';
import chickenImage from '../assets/chicken.png';
import stirfryImage from '../assets/stir-fry.jpg';
import mousseImage from '../assets/chocolate-mousse-recipe-1-1.jpg';
import shrimpTacosImage from '../assets/shrimpTacos.png';
import RecipeModal from './RecipeModal';
export default function ExplorePage({ recipes, onRecipeSelect, onNavigate }) {
const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  return (
    // Master container limits width on massive screens and centers it
    <div className="max-w-[1600px] mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* 1. HERO BANNER */}
        <div className="relative w-full h-90 rounded-4xl overflow-hidden bg-slate-900 shadow-lg group cursor-pointer">
          <img 
            src={tacoImage} 
            alt="Featured Recipe" 
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-70"></div>
            <div className= "absolute bottom-10 left-10 right-10">
                <h1 className = "text-5xl font-bold text-white mb-2 max-w-2xl">Master the Art of <br/> Smoky Chipotle Tacos</h1>
            <p className="text-gray-200 mb-6 max-w-xl text-sm leading-relaxed">
              Discover the secret blend of spices and slow-cooked pork that makes these tacos a neighborhood legend. Perfect for weekend gatherings.
            </p>
            <div className="flex items-center gap-6 text-white font-bold text-sm">
              <span className="flex items-center gap-2"><FiClock className="text-orange-300" /> 25 Minutes</span>
              <span className="flex items-center gap-2"><LuChefHat className="text-orange-300" /> Intermediate</span>
            </div>
            <div className="flex items-center gap-6 text-white font-bold text-sm">
                <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-lg transition-colors shadow-sm mt-4">
                    View Recipe
                </button>
                <button className="bg-transparent border border-white hover:bg-white hover:text-slate-900 px-6 py-2.5 rounded-lg transition-colors shadow-sm mt-4">
                    Save to Favorites
                </button>
            </div>
            
            
          </div>
        </div>

        {/* 2. EXPLORE RECIPES LIST */}
        <div className=" flex flex-col gap-6">
            <div className = "flex justify-between items-center">
                <div className = "flex items-center gap-2">
                   {['All', 'Breakfast', 'Lunch', 'Dinner'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                    activeFilter === filter 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-white text-slate-600 border border-gray-200 hover:border-emerald-500'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <div className="w-px h-6 bg-gray-300"></div>
              <button className="px-5 py-2 rounded-full text-sm font-bold bg-white text-slate-600 border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                <FiFilter /> Advanced
              </button>
              
                </div>


            </div> 
            <div className = "flex items-center gap-4 text-xs font-medium text-slate-500">
                   <span>Found <strong className="text-slate-800">48</strong> recipes matching your preferences</span>
            <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Vegan Selected</span>
            <span className="ml-auto flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Syncing with global taste trends...</span>
          </div>
            
        </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <div key = {recipe.id} 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex flex-col">
                    {/* Card Image Area */}
                    <div className = "relative h-48 overflow-hidden">
                      <img
                        src={recipe.img}
                        alt={recipe.title}
                        className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                          {recipe.tag}
                      </span>
                      
                    </div>
                    {/* Card Content Area */}
                    <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${recipe.diffColor}`}>
                    {recipe.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                    <FiStar className="text-orange-400 fill-current" /> {recipe.rating} <span className="text-slate-400 font-normal">({recipe.reviews})</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{recipe.title}</h3>
                <div className = "w-full h-px bg-gray-200 my-2"></div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-sm text-slate-500">
                    <FiClock className="inline-block mr-1 text-orange-400" />
                    {recipe.time} </div>
                  <div className="text-sm text-slate-500">
                    <LuChefHat className="inline-block mr-1 text-orange-400" />
                    {recipe.chef}
                  </div>
                  
                </div>
              </div>

            </div>
          ))}
        </div>
        <RecipeModal 
        recipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
        onStartCooking={() => {
          // 1. Tell App.jsx to set this recipe as the active one
          onRecipeSelect(selectedRecipe.id);
          // 2. Tell App.jsx to switch back to the dashboard view
          onNavigate('dashboard');
        }}
      />
      </div>
    
  );
}
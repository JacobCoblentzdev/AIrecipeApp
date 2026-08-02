import { FiClock, FiStar, FiBookmark } from 'react-icons/fi';
import { LuChefHat } from "react-icons/lu";

function SideBar({ recipes, activeId, onRecipeSelect }) {
    const safeRecipes = Array.isArray(recipes) ? recipes.filter(Boolean) : [];

    return(
        
        <aside className = "w-85 h-screen bg-slate-50 border-r border-gray-200 p-6 flex flex-col gap-5 overflow-y-auto"> 
        {/* 1. Categories */}
        <div className = " flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-600">CATEGORIES</h3>
            <button className="text-emerald-500 text-sm font-semibold hover:text-emerald-600">Clear</button>
        </div>
        {/* Pills Container */}
        <div className = "flex flex-wrap gap-2">
        <button className = "px-4 py-1.5 bg-emerald-500 text-white text-sm font-semibold rounded-full hover:bg-emerald-600 transition-colors flex items-center gap-1">
            All
            </button>
            {['Breakfast', 'sdklafjl;asdkfjlasdk;fjl;', 'Vegan', '30-min'].map(item => (
            <button key={item} className="px-4 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-full text-sm font-medium hover:border-emerald-500 transition-colors">
              {item}
            </button>
            ))}
            </div>
            {/* 2. Main Actions */}
            <div className = "grid grid-cols-2 gap-4">
            
            {/* My Recipes Button */}
            <button className = "flex flex-col items-center justify-center py-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <LuChefHat className="text-emerald-500 text-2xl mb-2" />
                <span className="text-sm font-semibold text-slate-800">My Recipes</span>

            </button>
            <button className= "flex flex-col items-center justify-center py-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
          <FiBookmark className="text-orange-400 text-3xl mb-2" />
          <span className="text-sm font-semibold text-slate-800">Saved Items</span>
        </button>
            </div>
            {/* header*/}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-600">RECENT DISCOVERIES</h3>
                <span className="text-sm text-slate-400">Sort: <strong className="text-slate-800 cursor-pointer">Newest</strong></span>
            </div>
            {/* Discoveries List */}
            <div className="flex flex-col gap-4">
                {safeRecipes.length === 0 ? (
                    <div className="text-sm text-slate-500">No recipes available yet.</div>
                ) : safeRecipes.map(recipe => {
                    const tags = Array.isArray(recipe?.tags) ? recipe.tags : [];
                    const title = recipe?.title || 'Untitled recipe';
                    const time = recipe?.time || 'TBD';
                    const rating = recipe?.rating || '—';
                    const image = recipe?.img || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=200&q=80';

                    return (
                        <div key={recipe.id}
                        onClick={() => onRecipeSelect(recipe.id)}
                        className={`p-3 rounded-2xl flex gap-4 items-center cursor-pointer transition-all ${
                    activeId === recipe.id 
                      ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md' // Active Style
                      : 'bg-white border border-gray-100 hover:shadow-md' // Inactive Style
                  }`}>
                            
                            <img src={image} alt={title} className="w-16 h-16 rounded-xl object-cover" />
                            <div className = "flex-1 min-w-0">
                                <h4 className={`text-sm font-bold truncate ${recipe.id === activeId ? 'text-emerald-500' : 'text-slate-800'}`}>
                                    {title}
                                </h4>
                                {/* Time & Rating Row */}
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                 <span className="flex items-center gap-1"><FiClock /> {time}</span>
                                    <span className="flex items-center gap-1"><FiStar /> {rating}</span>
                                </div>
                                {/* Tags Row */}
                                <div className="flex gap-2 mt-2">
                                 {tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                    {tag}
                                 </span>
                                 ))}
                                </div>
                            </div>
                            
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
export default SideBar;
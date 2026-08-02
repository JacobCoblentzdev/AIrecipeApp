import { FiX, FiHeart, FiClock, FiUsers, FiAward, FiPlay, FiBookOpen, FiAlertCircle } from 'react-icons/fi';

export default function RecipeModal({ recipe, onClose, onStartCooking }) {
  if (!recipe) return null;

  // Flatten the ingredients array for this specific view
  const allIngredients = recipe.ingredients.flatMap(section => section.items);
  
  // For the sake of matching the design, we will mock the missing ingredient logic.
  // In a real app, this would be calculated against a user's digital pantry inventory.
 
  return (
    // 1. THE BACKDROP
    // This darkens the rest of the app and captures clicks to close the modal.
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      
      {/* 2. THE MODAL CONTAINER */}
      {/* onClick={(e) => e.stopPropagation()} prevents clicks inside the modal from closing it */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- HEADER ROW --- */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <img 
              src={recipe.img} 
              alt="Thumbnail" 
              className="w-14 h-14 rounded-xl object-cover shadow-sm"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                {recipe.title} {recipe.subtitle}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <img 
                  src="https://i.pravatar.cc/150?img=47" 
                  alt={recipe.creator} 
                  className="w-5 h-5 rounded-full"
                />
                by {recipe.creator}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <FiHeart size={22} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* --- BODY AREA (Two Columns) --- */}
        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
          
          {/* Left Column: Image */}
          <div className="w-full md:w-1/2 relative min-h-[300px]">
            <img 
              src={recipe.img} 
              alt={recipe.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Calories Pill */}
            <div className="absolute top-4 left-4 bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
              420 kcal
            </div>
          </div>

          {/* Right Column: Recipe Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            
            {/* Meta Stats Row */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100 border-dashed mb-6">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <FiClock className="text-slate-400 text-lg" />
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{recipe.time}</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <FiUsers className="text-slate-400 text-lg" />
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{recipe.servings}</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <FiAward className="text-slate-400 text-lg" />
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{recipe.difficulty}</span>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="flex-1 mb-8">
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800">Ingredients</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                    {allIngredients.length} items
                  </span>
                </div>
                
              </div>

              <div className="flex flex-col gap-3">
                {allIngredients.map((item) => {
                  
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <span className="font-medium  text-slate-700">
                        {item.name}
                      </span>
                      <span className="font-bold text-emerald-500">
                        {item.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto shrink-0">
              <button
              onClick={onStartCooking} 
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-sm transition-colors">
                <FiPlay className="fill-current" /> Cook — Hands-Free
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 font-bold py-3.5 rounded-xl transition-colors">
                <FiBookOpen /> View Full Recipe
              </button>
            </div>

          </div>
        </div>

       

      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { FiMic, FiBookmark, FiShare2, FiPrinter, FiVolume2, FiStar, FiClock, FiUsers, FiAward, FiCheck, FiPlay, FiCheckCircle } from 'react-icons/fi';

function RecipePage({ activeRecipe }) {

  // 1. STATE
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState(new Set());

  // Reset steps and checkboxes if the user clicks a different activeRecipe in the sidebar
  useEffect(() => {
    setStepIndex(0);
    setCheckedItems(new Set());
  }, [activeRecipe?.id]);

  if (!activeRecipe) {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <p className="text-slate-500">Select a recipe to view its details.</p>
      </div>
    );
  }

  // 2. STEPPER LOGIC
  const handleNextStep = () => {
    if (stepIndex < activeRecipe.instructions.length - 1) {
      setStepIndex(prev => prev + 1);
    }
  };

  const isFinished = stepIndex === activeRecipe.instructions.length - 1;
  const activeInstruction = activeRecipe.instructions[stepIndex]; // Grabs the current step's data
  const totalSteps = activeRecipe.instructions.length;

  const toggleCheck = (id) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
        newChecked.delete(id);
    } else {
        newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Microphone Banner */}
      <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#dcfce7] text-emerald-600 p-2.5 rounded-full">
            <FiMic size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Enable microphone for hands-free cooking</h4>
            <p className="text-xs text-slate-500 mt-0.5">Required to use voice commands like "Next" and "Repeat".</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            How voice works
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
            Allow Microphone
          </button>
        </div>
      </div>

      {/* Recipe Header */}
      <div className="flex justify-between items-start w-full mb-8">
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-100">
                  Featured Recipe
                </span>
                <div className="flex items-center text-sm font-medium text-slate-500 gap-2">
                  <div className="flex text-slate-800">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar /> 
                  </div>
                  <span>{activeRecipe.rating} ({activeRecipe.reviews} reviews)</span>
                </div>
            </div>
            
            <h1 className="text-[44px] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              {activeRecipe.title} <br />
              <span className="text-emerald-500">{activeRecipe.subtitle}</span>
            </h1>
            
            <div className="flex items-center gap-8 mt-2 text-sm text-slate-800 font-bold">
              <div className="flex items-center gap-2">
                <FiClock className="text-lg text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Time</p>
                  {activeRecipe.time} 
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-slate-400 text-lg" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Servings</p>
                  {activeRecipe.servings} 
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="text-slate-400 text-lg" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Difficulty</p>
                  {activeRecipe.difficulty}
                </div>
              </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-full border border-gray-200 text-slate-600 hover:bg-gray-50 transition-all"><FiBookmark size={20} /></button>
          <button className="p-2.5 rounded-full border border-gray-200 text-slate-600 hover:bg-gray-50 transition-all"><FiShare2 size={20} /></button>
          <button className="p-2.5 rounded-full border border-gray-200 text-slate-600 hover:bg-gray-50 transition-all"><FiPrinter size={20} /></button>
          <button className="flex items-center gap-2 bg-[#f49b42] hover:bg-[#e88d30] text-slate-900 px-5 py-2.5 rounded-full font-bold transition-colors ml-2 shadow-sm">
            <FiVolume2 size={20} /> Start Hands-Free
          </button>
        </div>
      </div>

      {/* Master Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left Column: Ingredients */}
        <div className="md:col-span-4 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md h-fit">
         <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Ingredients</h3>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {activeRecipe.ingredients.reduce((total, section) => total + section.items.length, 0)} items
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {activeRecipe.ingredients.map((section, index) => (
              <div key={index}>
                <h4 className="text-[11px] font-extrabold text-slate-400 tracking-wider mb-4 uppercase">{section.category}</h4>
                <div className="flex flex-col gap-3">
                  {section.items.map(item => (
                    <label key={item.id} className="flex items-center justify-between group cursor-pointer border-b border-gray-200 pb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => toggleCheck(item.id)} 
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            checkedItems.has(item.id) 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-gray-300 bg-white group-hover:border-emerald-400'
                          }`}
                        >
                          {checkedItems.has(item.id) && <FiCheck size={14} />}
                        </div>
                       <span className={`text-sm font-medium transition-colors ${checkedItems.has(item.id) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">{item.amount}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>
          
          {/* Right Column: Active Instruction */}
          <div className="md:col-span-8">
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-emerald-500">Cooking in Progress</h3>
                <span className="text-sm font-medium text-slate-500">
                  Step {stepIndex + 1} of {totalSteps}
                </span>
              </div>
              <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Active Instruction Card */}
            <div className="relative bg-white border border-gray-200 border-l-4 border-l-emerald-500 rounded-lg p-10 shadow-xl overflow-hidden">
              <div className="absolute top-2 left-6 text-[180px] font-black text-slate-50 leading-none select-none z-0">
                0{stepIndex + 1}
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] bg-emerald-50 text-emerald-500 font-bold tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                   Active Step
                  </span>
                  
                  {/* Only show the timer pill if this specific step has a timer */}
                  {activeInstruction.timer && (
                    <div className="flex items-center gap-1.5 bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full font-bold border border-orange-100">
                      <FiClock /> {activeInstruction.timer}
                    </div>
                  )}
                </div>
                
                
                <p className="text-[26px] font-bold text-slate-800 leading-snug mb-10 max-w-2xl pl-4">
                  {activeInstruction.text}
                   
                </p>
                
                <div className="flex justify-end">
                  {/* Clicking this button triggers handleNextStep */}
                  <button 
                    onClick={handleNextStep}
                    disabled={isFinished}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold shadow-md transition-all ${
                      isFinished 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {isFinished ? <><FiCheckCircle /> Recipe Complete</> : <><FiPlay /> Next Step</>}
                  </button>
                </div>

              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default RecipePage;
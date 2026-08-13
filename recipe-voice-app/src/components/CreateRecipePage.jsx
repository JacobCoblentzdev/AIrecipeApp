import { useState, useRef } from 'react';
import { db, auth, functions } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { FiImage, FiPlus, FiClock, FiUsers, FiCamera } from 'react-icons/fi';
import { LuChefHat } from "react-icons/lu";

export default function CreateRecipePage({ onNavigate, onRecipePublished }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    creator: auth.currentUser?.email,
    img: '',
    tags: '', // We will treat this as a comma-separated string in the form for simplicity
    difficulty: 'Easy',
    time: '',
    servings: '',
    ingredients: [
      {
        category: 'MAIN INGREDIENTS',
        items: [{ id: Date.now().toString(), name: '', amount: '' }]
      }
    ],
    instructions: [
      { text: '', timer: '' }
    ]
  });
  const handleImageScan = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);

    try {
      // Step A: Convert the image file to a Base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64String = reader.result;

          // Step B: Call your Firebase Cloud Function
          const scanRecipeFn = httpsCallable(functions, 'scanRecipe');
          const response = await scanRecipeFn({ image: base64String });
          
          const aiRecipe = response.data.recipe;

          // Step C: Format the AI data safely for React State
          // (We add random IDs to ingredients so React mapping doesn't break)
          const formattedIngredients = aiRecipe.ingredients?.map(cat => ({
            category: cat.category || 'MAIN',
            items: cat.items.map(item => ({
              id: Date.now().toString() + Math.random().toString(),
              name: item.name || '',
              amount: item.amount || ''
            }))
          })) || [];

          const formattedInstructions = aiRecipe.instructions?.map(inst => ({
            text: inst.text || '',
            
            timer: inst.timer || ''
          })) || [];

          // Step D: Inject the AI data directly into your form!
          setFormData(prev => ({
            ...prev,
            title: aiRecipe.title || prev.title,
            creator: aiRecipe.creator || prev.creator,
            subtitle: aiRecipe.subtitle || prev.subtitle,
            time: aiRecipe.time || prev.time,
            difficulty: aiRecipe.difficulty || prev.difficulty,
            servings: aiRecipe.servings || prev.servings,
            // Only overwrite arrays if the AI actually found them
            ingredients: formattedIngredients.length > 0 ? formattedIngredients : prev.ingredients,
            instructions: formattedInstructions.length > 0 ? formattedInstructions : prev.instructions
          }));

        } catch (err) {
          console.error("AI Error:", err);
          const message = err?.message || "The AI had trouble reading that image. Try a clearer photo!";
          alert(message);
        } finally {
          setIsScanning(false);
          if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
      };
      
      reader.onerror = () => {
        alert("Failed to read the file from your device.");
        setIsScanning(false);
      };

    } catch (error) {
      console.error("System error:", error);
      setIsScanning(false);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    
  };
  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { category: 'New Category', items: [{ id: Date.now().toString(), name: '', amount: '' }] }]
    }));
  };

  const addIngredient = (categoryIndex) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[categoryIndex].items.push({
        id: Date.now().toString(),
        name: '',
        amount: ''
    })
    setFormData(prev => ({...prev, ingredients: newIngredients}));
  }

  const updateIngredient = (categoryIndex, itemIndex, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[categoryIndex].items[itemIndex][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const updateInstruction = (index, field, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index][field] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setFormData(prev => ({...prev, instructions: [...prev.instructions, { text: '', timer: '' }] }));
  }

  const handlePublish = async () => {
    const missingRequiredFields =
    !formData.title ||
    !formData.subtitle ||
    !formData.img ||
    !formData.time ||
    !formData.servings;

  if (missingRequiredFields) {
    alert('Please fill in all required fields.');
    return; // exits only this handler
  }
    setIsPublishing(true);
    try {
      const formattedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      console.log('Publishing recipe:', formattedData);
      const docRef = await addDoc(collection(db, 'recipes'), formattedData);
      console.log('Published recipe ID:', docRef.id);
      alert('Recipe published successfully!');
      if (typeof onRecipePublished === 'function') {
        await onRecipePublished();
      }
      onNavigate('dashboard');
    } catch (error) {
      console.error('Error publishing recipe:', error);
      alert(`Failed to publish recipe. ${error?.message || 'Please try again.'}`);
    } finally {
      setIsPublishing(false);
    }
  }
  return(
    <div className="max-w-350 mx-auto p-6 md:p-8 h-screen overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-10 min-w-0">
        <section>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Recipe Title <span className="text-rose-500">*</span>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="e.g. Smoky Chipotle Tacos" /></label>
          </div>
          <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Subtitle</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" />
            </div>
      
        </section>
        {/* Section: Media & Configuration */}
        <section>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Media & Configuration
              <div className= "h-px bg-gray-200 w-full mt-3 shadow-2xl"></div>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Hero Image URL</label>
                <div className="flex gap-2">
                  <input type="text" name="img" value={formData.img} onChange={handleInputChange} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" placeholder="https://images.unsplash.com/..." />
                </div>
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tags (Comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" placeholder="Mexican, Seafood, Dinner" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Difficulty</label>
                <input type="text" name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" placeholder="Easy" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Time</label>
                <input type="text" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" placeholder="25 min" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Servings</label>
                <input type="text" name="servings" value={formData.servings} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" placeholder="3 People" />
              </div>
            </div>
          </section>

          {/* Section: Ingredients */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ingredients</h3>
              <button type="button" onClick={addCategory} className="flex items-center gap-1.5 text-sm font-bold hover:underline bg-gray-100 border border-gray-200 shadow-2xl rounded-lg px-3 py-1.5 transition-colors">
                <FiPlus size={16} />
                Add Category
              </button>

            </div>
            {formData.ingredients.map((category, catIndex) => (
              <div key={catIndex} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase">{category.category}</h4>
                <div className="flex flex-col gap-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <input type = "text" value = {item.amount} onChange={(e) => updateIngredient(catIndex, itemIndex, 'amount', e.target.value)} placeholder="amount" className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" />
                      
                      <input type = "text" value = {item.name} onChange = {(e) => updateIngredient(catIndex, itemIndex, 'name', e.target.value)} placeholder="name" className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" />
                      </div>
                  ))}
                  </div>
                  <button onClick={() => addIngredient(catIndex)} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 mt-3 flex items-center gap-1">
                  <FiPlus /> Add Ingredient
                </button>
                </div>
            ))}



          </section>
          {/* Section: Instructions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Instructions</h3>
              <button type="button" onClick={addInstruction} className="flex items-center gap-1.5 text-sm font-bold hover:underline bg-gray-100 border border-gray-200 shadow-2xl rounded-lg px-3 py-1.5 transition-colors">
                <FiPlus size={16} />
                add Step
              </button>
            </div>
            <div className = "flex flex-col gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
              {formData.instructions.map((step, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input type = "text" value = {step.text} onChange={(e) => updateInstruction(index, 'text', e.target.value)} placeholder="Step description" className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" />
                  <input type = "text" value = {step.timer} onChange={(e) => updateInstruction(index, 'timer', e.target.value)} placeholder="Timer (e.g., 10 min)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none" />
                </div>
              ))}
              
            </div>
            <button onClick={handlePublish} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 mt-3 flex items-center gap-1">
                <FiPlus /> Publish Recipe
              </button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef}
              onChange={handleImageScan}
              className="hidden"
            />
            
            {/* The Custom Button */}
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isScanning}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all ${
                isScanning 
                ? 'bg-indigo-200 text-indigo-500 cursor-not-allowed animate-pulse' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <FiCamera className="text-lg" />
              {isScanning ? 'Analyzing...' : 'Scan Recipe'}
            </button>
            </section>
        

        
      </div>
      <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-6">
            <span className="absolute -top-3 right-4 bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full z-10">
              Live Preview
            </span>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[800px]">
              
              {/* Preview Hero Image */}
              <div className="relative h-64 shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden">
                {formData.img ? (
                  <img src={formData.img} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <FiImage className="text-4xl text-slate-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">
                    {formData.title || 'Recipe Title'}
                  </h2>
                  <p className="text-sm font-medium text-gray-300">
                    {formData.subtitle || 'Subtitle goes here'}
                  </p>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                
                {/* Meta Row */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 border-dashed mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                      <img src={formData.img} alt="Avatar" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Recipe by</p>
                      <p className="text-xs font-bold text-slate-800">{formData.creator || 'Chef Name'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <FiClock className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-600 mt-1">{formData.time || '--'}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FiUsers className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-600 mt-1">{formData.servings || '--'}</span>
                    </div>
                  </div>
                </div>

                {/* Preview Ingredients (Only shows first category to save space) */}
                <h4 className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest mb-4">Ingredients</h4>
                <div className="flex flex-col gap-2 mb-6">
                  {formData.ingredients[0].items.map((item, idx) => (
                    item.name && (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-slate-500">{item.amount}</span>
                      </div>
                    )
                  ))}
                </div>

                {/* Preview Instructions */}
                <h4 className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest mb-4">Instructions</h4>
                <div className="flex flex-col gap-4">
                  {formData.instructions.map((step, idx) => (
                    step.text && (
                      <div key={idx} className="flex gap-3">
                        <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700">
                          {step.text}
                        </p>
                      </div>
                    )
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
  }
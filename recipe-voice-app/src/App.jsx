import { useState, useEffect } from 'react';
// Import the database connection and Firestore querying tools
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import RecipePage from './components/RecipePage';
import ExplorePage from './components/ExplorePage';
import CreateRecipePage from './components/CreateRecipePage';

const SIX_NEW_RECIPES = [
  {
    title: "Smoky Chipotle",
    subtitle: "Shrimp Tacos",
    creator: "Chef Maria",
    rating: 4.8,
    reviews: 124,
    time: "25 min",
    servings: "3 People",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
    tags: ["Mexican", "Seafood"],
    ingredients: [
      {
        category: "THE FILLING",
        items: [
          { id: "t1", name: "Medium Shrimp", amount: "1 lb peeled" },
          { id: "t2", name: "Chipotle in Adobo", amount: "2 tbsp" },
          { id: "t3", name: "Corn Tortillas", amount: "6 small" }
        ]
      }
    ],
    instructions: [
      { text: "Marinate the shrimp in chipotle sauce and lime juice.", highlight: "chipotle sauce", timer: null },
      { text: "Sear the shrimp in a hot skillet for 3 minutes until pink.", highlight: "3 minutes", timer: "03:00" },
      { text: "Warm the tortillas and assemble with fresh cilantro.", highlight: "Warm the tortillas", timer: null }
    ]
  },
  {
    title: "Spring Pea & Mint",
    subtitle: "Risotto",
    creator: "Julian Rossi",
    rating: 4.9,
    reviews: 88,
    time: "40 min",
    servings: "4 People",
    difficulty: "Intermediate",
    img: "https://images.unsplash.com/photo-1633964913295-ceb43826e7cf?auto=format&fit=crop&w=600&q=80",
    tags: ["Italian", "Vegetarian"],
    ingredients: [
      {
        category: "THE RICE",
        items: [
          { id: "r1", name: "Arborio Rice", amount: "1.5 cups" },
          { id: "r2", name: "Vegetable Broth", amount: "4 cups warm" },
          { id: "r3", name: "Fresh Peas", amount: "1 cup" }
        ]
      }
    ],
    instructions: [
      { text: "Toast the rice in olive oil until the edges are translucent.", highlight: "Toast the rice", timer: null },
      { text: "Add broth one ladle at a time, stirring constantly for 20 minutes.", highlight: "20 minutes", timer: "20:00" },
      { text: "Stir in the fresh peas, mint, and parmesan cheese off the heat.", highlight: "off the heat", timer: null }
    ]
  },
  {
    title: "Blueberry Oat",
    subtitle: "Pancakes",
    creator: "Sarah Jenkins",
    rating: 4.7,
    reviews: 342,
    time: "15 min",
    servings: "2 People",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80",
    tags: ["Breakfast", "Vegetarian"],
    ingredients: [
      {
        category: "THE BATTER",
        items: [
          { id: "p1", name: "Rolled Oats", amount: "1 cup blended" },
          { id: "p2", name: "Almond Milk", amount: "3/4 cup" },
          { id: "p3", name: "Fresh Blueberries", amount: "1/2 cup" }
        ]
      }
    ],
    instructions: [
      { text: "Blend the oats into a fine flour, then mix with milk and baking powder.", highlight: "fine flour", timer: null },
      { text: "Pour batter onto a hot griddle and top with blueberries.", highlight: "hot griddle", timer: null },
      { text: "Cook for 2 minutes per side until golden brown.", highlight: "2 minutes", timer: "02:00" }
    ]
  },
  {
    title: "30-Minute Veggie",
    subtitle: "Stir-Fry",
    creator: "Linh Chen",
    rating: 4.5,
    reviews: 210,
    time: "30 min",
    servings: "2 People",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
    tags: ["Vegan", "Quick"],
    ingredients: [
      {
        category: "VEGETABLES",
        items: [
          { id: "v1", name: "Broccoli Florets", amount: "2 cups" },
          { id: "v2", name: "Bell Peppers", amount: "2 sliced" },
          { id: "v3", name: "Soy Sauce", amount: "3 tbsp" }
        ]
      }
    ],
    instructions: [
      { text: "Heat sesame oil in a large wok over high heat.", highlight: "high heat", timer: null },
      { text: "Stir-fry the vegetables for 5 minutes until tender-crisp.", highlight: "5 minutes", timer: "05:00" },
      { text: "Toss with soy sauce and serve immediately over rice.", highlight: "serve immediately", timer: null }
    ]
  },
  {
    title: "Vegan Chocolate",
    subtitle: "Mousse",
    creator: "Elena Gray",
    rating: 4.9,
    reviews: 112,
    time: "20 min",
    servings: "4 People",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80",
    tags: ["Dessert", "Vegan"],
    ingredients: [
      {
        category: "THE MOUSSE",
        items: [
          { id: "m1", name: "Aquafaba (Chickpea liquid)", amount: "1/2 cup" },
          { id: "m2", name: "Dark Chocolate", amount: "200g melted" },
          { id: "m3", name: "Maple Syrup", amount: "2 tbsp" }
        ]
      }
    ],
    instructions: [
      { text: "Whip the aquafaba for 10 minutes until stiff peaks form.", highlight: "10 minutes", timer: "10:00" },
      { text: "Gently fold the melted chocolate and syrup into the fluff.", highlight: "Gently fold", timer: null },
      { text: "Chill in the fridge for at least 1 hour before serving.", highlight: "1 hour", timer: "60:00" }
    ]
  },
  {
    title: "Classic Beef",
    subtitle: "Bourguignon",
    creator: "Jean Pierre",
    rating: 4.9,
    reviews: 230,
    time: "3h 30m",
    servings: "6 People",
    difficulty: "Advanced",
    img: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80",
    tags: ["French", "Dinner"],
    ingredients: [
      {
        category: "THE STEW",
        items: [
          { id: "b1", name: "Beef Chuck", amount: "3 lbs cubed" },
          { id: "b2", name: "Red Burgundy Wine", amount: "1 bottle" },
          { id: "b3", name: "Pearl Onions", amount: "1 lb" }
        ]
      }
    ],
    instructions: [
      { text: "Brown the beef chunks on all sides in a heavy dutch oven.", highlight: "Brown the beef", timer: null },
      { text: "Deglaze the pot with the wine and bring to a simmer.", highlight: "Deglaze the pot", timer: null },
      { text: "Cover and braise in the oven for 3 hours until meat is tender.", highlight: "3 hours", timer: "180:00" }
    ]
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeRecipeId, setActiveRecipeId] = useState(null);
  
  // 1. NEW STATE: Hold the recipes from the database
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const uploadSixRecipes = async () => {
    try {
      console.log('Starting bulk upload...');
      const recipesCollection = collection(db, 'recipes');

      for (const recipe of SIX_NEW_RECIPES) {
        await addDoc(recipesCollection, recipe);
        console.log(`Uploaded: ${recipe.title}`);
      }

      alert('All 6 recipes uploaded successfully! Refresh the page.');
    } catch (error) {
      console.error('Upload failed: ', error);
      alert('Error uploading. Check the console.');
    }
  };

  // 2. THE FETCH LOGIC
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Point to the "recipes" collection in your Firestore database
        const recipesCollection = collection(db, 'recipes');
        const recipeSnapshot = await getDocs(recipesCollection);
        
        const recipeList = recipeSnapshot.docs.map(doc => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title || 'Untitled recipe',
            subtitle: data.subtitle || '',
            creator: data.creator || 'Anonymous Chef',
            time: data.time || 'TBD',
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            servings: data.servings || '1',
            difficulty: data.difficulty || 'Easy',
            img: data.img || '',
            tags: Array.isArray(data.tags) ? data.tags : (Array.isArray(data.Tags) ? data.Tags : []),
            instructions: Array.isArray(data.instructions) ? data.instructions : [],
            ingredients: Array.isArray(data.ingredients)
              ? data.ingredients.map(section => ({
                  category: section.category || 'Ingredients',
                  items: Array.isArray(section.items)
                    ? section.items
                    : (Array.isArray(section.Items) ? section.Items : [])
                }))
              : []
          };
        });

        console.log('Firestore docs count:', recipeSnapshot.size);
        console.log('Fetched recipes from Firestore:', JSON.stringify(recipeList, null, 2));
        setRecipes(recipeList);
        
        // Set the first recipe as active if the list isn't empty
        if (recipeList.length > 0) {
          setActiveRecipeId(recipeList[0].id);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []); // Empty array ensures we only fetch once when the app loads

  const activeRecipe = recipes.find(recipe => recipe.id === activeRecipeId);

  // 3. LOADING STATE
  if (loading) {
    return (
     <div className="h-screen w-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        <button 
          onClick={uploadSixRecipes}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
        >
          Push 6 New Recipes to F irebase
        </button>
      </div>
    );
  }
 
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden text-slate-800 font-sans">
      <Navbar onNavigate={setCurrentPage} />
      
      <div className="flex flex-1 overflow-hidden">
        {currentPage === 'dashboard' ? (
          <>
            {/* Pass the live 'recipes' state down to the Sidebar */}
            <SideBar 
              recipes={recipes} 
              activeId={activeRecipeId} 
              onRecipeSelect={setActiveRecipeId} 
            />
            <main className="flex-1 overflow-y-auto p-8 bg-white">
              {activeRecipe ? (
                <RecipePage activeRecipe={activeRecipe} />
              ) : (
                <div className="text-slate-500">Select a recipe to view its details.</div>
              )}
            </main>
          </>
        ) : currentPage === 'explore' ? (
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            {/* You will eventually pass the recipes state down here too! */}
            <ExplorePage 
              recipes={recipes}
              onRecipeSelect={setActiveRecipeId}
              onNavigate={setCurrentPage}
            />
          </main>
        ) : currentPage === 'create-recipe' ? (
          <CreateRecipePage onNavigate={setCurrentPage} />
        ) : null }
      </div>
    </div>
  )
}

export default App;
import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [minutes, setMinutes] = useState("20");
  const [dairyFree, setDairyFree] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [message, setMessage] = useState("");
  const [meals, setMeals] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("")

  async function handleCopyRecipe() {
  try {
    await navigator.clipboard.writeText(meals);
    setCopyMessage("Recipe copied!");
  } catch {
    setCopyMessage("Couldn't copy the recipe. Please select and copy it manually.");
  }
}

  async function handleSubmit(event){
    event.preventDefault();

    if (loading) return;

    if(!ingredients.trim()) {
      setMessage("Add some ingredients first.");
      return;
    }

    setLoading(true);
    setMeals("");
    setCopyMessage("");
    setMessage("Creating a simple meal for you...");

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          minutes,
          dairyFree,
          glutenFree,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Couldn't generate meals.");
      }

      if (typeof data.meals !== "string" || !data.meals.trim()) {
        throw new Error("No meals returned. Please try again.");
      }

      setMeals(data.meals);
      setMessage("Your meal is ready.");
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <header>
        <span className="eyebrow">MADE FOR YOU · MADE FOR ONE</span>
        <div className="brand">
          <img src="/public/mealMate-Logo.png" alt="" className="brand-logo" />
          <h1>Meal Mate</h1>
        </div>
        <p>Simple meals. Less deciding. Use what you already have.</p> 
      </header>


    <form onSubmit={handleSubmit} className="meal-form">
      <label htmlFor="ingredients">What ingredients do you have?</label>
      <textarea id="ingredients" value={ingredients} onChange={(event)=> setIngredients(event.target.value)}
        placeholder="e.g. chicken, rice, broccoli" rows={4} required />

      <label htmlFor="minutes">How much time do you have?</label>
      <select id="minutes" value={minutes} onChange={(event) => setMinutes(event.target.value)} >
        <option value="10">10 Minutes</option>
        <option value="20">20 Minutes</option>
        <option value="30">30 Minutes</option>
      </select>

      <label className="checkbox-label">
        <input type="checkbox" checked={dairyFree} onChange={(event) => setDairyFree(event.target.checked)} />
        Dairy Free Today
      </label>
      <label className="checkbox-label">
        <input type="checkbox" checked={glutenFree} onChange={(event) => setGlutenFree(event.target.checked)} />
        Gluten Free Today
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Creating Meal.." : "Sugguest a meal"}
      </button>

      <p className="status" role="status">{message}</p>
      
    </form>

{meals && (
  <section className="meal-results" aria-labelledby="results-heading">
    <h2 id="results-heading">Your meal</h2>

    <button type="button" onClick={handleCopyRecipe}>
      Copy Recipe
    </button>

    <p className="status" role="status">
      {copyMessage}
    </p>

    <ReactMarkdown>{meals}</ReactMarkdown>

    <p className="meal-note">
      AI-generated suggestions: check ingredients and cooking instructions.
      For dietary restrictions, check product labels too.
    </p>
  </section>
)}

    </main>

  )
}

export default App;
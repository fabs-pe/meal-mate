import express from "express";

const app = express();
const port = 3001;

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", async (req, res) => {
    res.json({message: "Meal Mate Server Is Running" });
});

app.post("/api/meals", async (req, res) => {
    const { ingredients, minutes, dairyFree, glutenFree } = req.body;

    if (
        typeof ingredients !== "string" ||
        !ingredients.trim() ||
        ingredients.length > 100 ||
        ![10, 20, 30].includes(Number(minutes)) ||
        typeof dairyFree !== "boolean" ||
        typeof glutenFree !== "boolean"
    ) {
        return res.status(400).json ({
            error: "Enter ingredients, a valid time and dietary preferences.",
        });
    }

    const prompt = `
        Create exactly one simple meal for one person.

        Available ingredients: ${ingredients.trim()}
        Maximum preparation and cooking time: ${Number(minutes)} minutes.
        Dairy-free required: ${dairyFree ? "Yes" : "No"}.
        Gluten-free required: ${glutenFree ? "Yes" : "No"}.

        Ingredient rules:
        - Build the meal around the available ingredients.
        - Dietary restrictions only restrict ingredients. They do not require
        adding gluten-free pasta, dairy-free cheese or other special products.
        - Only replace an available ingredient if it conflicts with a selected
        dietary restriction. Explain which original ingredient it replaces.
        - If all available ingredients suit the dietary restrictions, do not
        add any replacement products.
        - Add at most two extra ingredients, including replacements.
        Oil, salt, pepper and water do not count towards this limit.
        - Add extras only when needed to make the meal work.
        - Every ingredient used in the steps must appear in Ingredients and Quantities.
        - Extra Ingredients Needed must list all ingredients not supplied
        by the user, including oil, salt, pepper and water if used.
        Write "None" only when every ingredient used was supplied.
        - Do not assume ordinary pasta is gluten-free or ordinary cheese is dairy-free.

        Quantity and cooking rules:
        - Use realistic quantities for one person, in grams and millilitres.
        - Treat rice and pasta as dry and uncooked unless the user explicitly
        describes them as cooked, leftover or ready to eat.
        - Specify whether rice and pasta weights are dry or cooked.
        - For dry rice, give cooking instructions, not reheating instructions.
        Follow packet instructions for water quantity and cooking time.
        - For cooked rice, instruct reheating until steaming hot throughout.
        - For pasta, follow packet instructions for water and cooking time.
        - Use drained weight for canned chickpeas.
        - Keep quantities consistent between the ingredient list and steps.
        - Treat ingredients described as cooked as already cooked.
        - Include preparation time in the total and stay within the time limit.
        - Account for tasks that can happen at the same time.
        - Give short, complete steps covering every ingredient.
        - Do not invent calorie or nutrition figures.

        Before returning the response, silently check:
        - Ingredients and Quantities lists every ingredient used,
        including extras, oil, salt, pepper and water.
        - Extra Ingredients Needed repeats every ingredient not supplied
        by the user, with the same quantity as the main ingredient list.
        - No more than two extras are added, excluding oil, salt,
        pepper and water.
        - Cooking instructions match each ingredient's raw or cooked state.
        - The whole meal can realistically be completed within the time limit.
        Correct any inconsistencies before responding.

        Return only these five sections:
        1. Meal Name
        2. Total Time
        3. Ingredients and Quantities
        4. Extra Ingredients Needed
        5. Cooking Steps

        Formatting:
        - Use Markdown headings for the five sections.
        - Put each ingredient and extra ingredient on its own bullet line.
        - Put each cooking step on its own numbered line.

        Keep the response concise.
        `;

    try {
        const response = await fetch(
            "http://127.0.0.1:11434/api/generate",
            {
                method: "POST",
                headers: { "Content-Type" : "application/json"},
                body: JSON.stringify({
                    model: "gemma3:4b",
                    prompt,
                    stream: false,
                }),
                signal: AbortSignal.timeout(120000),
            }
        );

        if (!response.ok) {
            throw new Error (`Ollama returned status ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.response !== "string" || !data.response.trim()) {
            throw new Error("Ollama returned an empty response.");
        }

        res.json({ meals: data.response });
    } catch (error) {
        console.error("Meal generation failed:", error.message);

        res.status(502).json({
            error: "Couldn't generate meals. Check Ollama is running and try again.",
        });
    }
})

app.listen(port, "127.0.0.1", () => {
    console.log(`Meal Mate server: http://127.0.0.1:${port}`);
});
# 🥣 Meal Mate

### Simple meals. Less deciding.

Built for my daughter and the familiar question after a long day at work and uni:

**“What am I going to cook?”**

Meal Mate turns ingredients you already have into **one simple meal for one person**, using AI running locally through Ollama.

Less scrolling. Less deciding. More dinner. 🍅

## ✨ What It Does

- 🥕 Takes the ingredients you have available
- ⏱️ Lets you choose 10, 20 or 30 minutes
- 🌿 Includes dairy-free and gluten-free preferences
- 📝 Generates quantities and step-by-step instructions
- 🛒 Lists any extra ingredients needed
- 📋 Copies the recipe to your clipboard
- 📱 Includes a responsive interface

It suggests **one meal at a time**, because choosing between another twenty recipes wasn’t the goal.

## 💛 Built for a Real Person

I built Meal Mate for my daughter for the **Hacktoberfest Weekend Challenge: Build for a Friend**.

After trying it, she said it would save her time and effort after a long day at work and university.

That’s the goal: make one small part of her day easier.

## 🧰 Tech Stack

| Tool | Job |
| --- | --- |
| React | Interactive frontend |
| Vite | Frontend development and build |
| Express | Backend API |
| Ollama | Local model inference |
| Gemma 3 4B | Recipe generation |
| React Markdown | Recipe formatting |
| CSS | Styling and responsive layout |

## 🏠 Why Local AI?

Meal Mate uses the open-weight `gemma3:4b` model through Ollama.

- No hosted inference API key required
- Recipe inputs are processed locally
- Models can be swapped as the project develops
- Local generation can work offline after setup

Your laptop does the thinking. You do the cooking.

**The trade off:** generation speed depends on your hardware, and the model can use significant memory.

## 🚀 Run It Locally

### Prerequisites

Install:

- A recent Node.js version compatible with this project's Vite version
- npm
- [Ollama](https://ollama.com/)

### 1. Clone the repository

```bash
git clone https://github.com/fabs-pe/meal-mate.git
cd meal-mate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Download the model

```bash
ollama pull gemma3:4b
```

Make sure Ollama is running. If the desktop app is already running, you usually don't need to start another server.

Otherwise, start it in a separate terminal:

```bash
ollama serve
```

The backend expects Ollama at:

```text
http://127.0.0.1:11434
```

### 4. Start the backend

From the project folder:

```bash
node server.js
```

The backend runs on port `3001` by default.

### 5. Start the frontend

Open another terminal in the project folder:

```bash
npm run dev
```

Open the local URL printed by Vite.

The frontend requests `/api/meals`. During development, your Vite configuration needs to proxy `/api` to the Express server:

```js
server: {
  proxy: {
    "/api": "http://127.0.0.1:3001",
  },
},
```

Keep this inside your existing `defineConfig()` configuration alongside the React plugin.

### 6. Make dinner happen 🍽️

Try:

```text
rice, canned chickpeas, tomato, salmon
```

Choose **30 minutes**, select your preferences, and click **Suggest a meal**.

## 🔄 How It Works

1. You enter ingredients, a time limit and dietary preferences.
2. Express validates the request.
3. The backend builds a recipe prompt.
4. Ollama runs Gemma locally.
5. React displays the recipe as formatted Markdown.
6. You copy it and head to the kitchen.

## 🛠️ Available Commands

```bash
npm run dev      # Start the frontend development server
node server.js   # Start the backend
npm run build    # Build the frontend
npm run lint     # Run the linter
npm run preview  # Preview the frontend build
```

`npm run preview` previews the frontend only. It does not start Express or Ollama.

## 🧪 Things to Try

- Generate a meal with each available time limit
- Try dairy-free and gluten-free preferences
- Enter cooked rice and compare it with dry rice
- Check that extra ingredients are listed
- Copy a recipe into Notes
- Test the layout on a small screen

## ⚠️ Before You Cook

Meal Mate is a prototype, and AI can make mistakes.

Check ingredient suitability, product labels, quantities and cooking instructions. Dietary preference options are not a guarantee that a recipe is safe for someone with allergies or coeliac disease.

## 🌱 Future Ideas

- Save favourite recipes
- Remember frequently used ingredients
- Add more dietary preferences
- Improve recipe consistency
- Make setup easier for other people

## 🎉 The Challenge

Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).

A small project with a practical purpose: helping someone I love answer **“what’s for dinner?”**

Perfect. 👍 Keep the README open.

Now delete everything inside it and paste this version. This one is cleaner for a GitHub portfolio and doesn’t use fake screenshots or badges.

🧠 DevTutor AI

AI-Powered Technical Learning Assistant for Developers

DevTutor AI is a Chrome Extension that helps developers and students understand technical concepts while browsing.

Select any technical text or code → right-click → Explain with DevTutor → learn the concept using AI-powered explanations, examples, interview questions, and quizzes.

The project uses Ollama + Qwen 3 1.7B locally, so it does not require a paid AI API.

⸻

✨ Features

Feature	Description
🧠 AI Explanation	Understand technical concepts in simple language
💻 Code Examples	Get practical examples for selected concepts
❓ Why is it Used?	Understand real-world applications
🎯 Interview Questions	Generate beginner-friendly interview questions
🧪 AI Quiz	Test your understanding with MCQs
📚 Learning History	Track concepts you have learned
📊 Learning Dashboard	View learning and quiz statistics
📄 PDF Learning	Upload technical PDFs and learn from them
💬 PDF Q&A	Ask questions about PDF content
🔒 Local AI	Run AI locally using Ollama and Qwen

⸻

🏗️ How It Works

             ┌──────────────────────┐
             │    Chrome Browser    │
             │                      │
             │  Select Text / Code  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │   DevTutor Chrome    │
             │      Extension       │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │    Node.js +         │
             │      Express        │
             │    Local Backend     │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │       Ollama         │
             │    Local AI Runtime  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │     Qwen 3 1.7B      │
             │      AI Model        │
             └──────────────────────┘

⸻

🛠️ Tech Stack

Chrome Extension

* HTML
* CSS
* JavaScript
* Chrome Extension Manifest V3
* Chrome Local Storage

Backend

* Node.js
* Express.js
* CORS
* Multer
* PDF Parse

AI

* Ollama
* Qwen 3 1.7B

⸻

📂 Project Structure

devtutor-ai/
│
├── background.js
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
│
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
│
└── server/
    ├── server.js
    ├── package.json
    └── package-lock.json

⸻

🚀 Getting Started

Prerequisites

Make sure you have:

* Google Chrome
* Node.js
* Ollama
* Qwen 3 1.7B model

1. Clone the repository

git clone https://github.com/sharvilphale22/devtutor-ai.git
cd devtutor-ai

2. Install backend dependencies

cd server
npm install

3. Start Ollama

Start the local Ollama server:

ollama serve

Make sure the required model is available:

ollama run qwen3:1.7b

4. Start the DevTutor backend

Open another Terminal window:

cd ~/Desktop/devtutor-ai/server
npm start

The backend will run at:

http://localhost:3000

5. Load the Chrome Extension

Open Chrome:

chrome://extensions

Then:

1. Enable Developer mode
2. Click Load unpacked
3. Select the cloned devtutor-ai folder
4. Open the DevTutor AI extension

⸻

💡 How to Use

Learn from a webpage

1. Open a technical webpage.
2. Select a technical concept or code.
3. Right-click the selected text.
4. Select Explain with DevTutor.
5. Open the DevTutor extension.
6. Choose an action.

Available actions include:

🧠 Explain
💡 Give Example
❓ Why is it used?
🎯 Interview Question
🧪 Quiz Me

⸻

📄 PDF Learning

DevTutor AI also supports technical PDF learning.

Users can:

* Upload a PDF
* Extract readable text
* Generate an AI summary
* Ask questions about the PDF
* Generate quizzes from PDF content
* Track PDF learning activity

Current limitation

The current PDF system works with PDFs containing selectable/readable text.

Scanned PDFs containing only images may require OCR support in a future version.

⸻

📊 Learning Dashboard

The dashboard provides an overview of the learner’s activity, including:

* Concepts learned
* Quizzes completed
* Quiz accuracy
* PDF learning activity
* Recent learning history

This turns DevTutor from a simple AI explainer into a basic learning system.

⸻

🔒 Privacy & Local AI

DevTutor AI follows a local-first approach.

AI processing is performed through a locally running Ollama instance using the Qwen model.

No paid OpenAI API key is required.

This also allows the project to experiment with AI-assisted learning without depending on a paid cloud AI API.

⸻

🎯 Project Goal

Most developers learn from documentation, tutorials, Stack Overflow, GitHub, and technical articles.

DevTutor AI aims to make that learning process more interactive.

Instead of leaving the webpage to search for an explanation, users can select the concept they don’t understand and learn about it directly inside the browser.

The long-term goal is to build a developer-focused AI learning system rather than just a general-purpose webpage summarizer.

⸻

🔮 Future Improvements

Potential future improvements include:

* OCR support for scanned PDFs
* More advanced learning analytics
* Spaced-repetition learning
* Knowledge graph of learned concepts
* Cloud synchronization
* Authentication
* Online deployment
* Support for additional local AI models

⸻

👨‍💻 Author

Sharvil Phale

Electronics & Telecommunication Engineering Student

Interested in:

* Software Engineering
* Artificial Intelligence
* Developer Tools
* AI Agents
* Intelligent Learning Systems

⸻

⭐ Project

DevTutor AI

Built to explore how local AI can be integrated into everyday developer workflows and technical learning.

After pasting

Do only these two things:

1. Press Command + S to save.
2. Close TextEdit.

Do not run git add yet.

After saving, tell me “saved” and I’ll check the next step with you before we push anything to GitHub.
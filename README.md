🤖 DevTutor AI

AI-powered learning assistant for developers

DevTutor AI is a Chrome extension that helps developers understand technical concepts while browsing.

Select technical text on a webpage, right-click, and choose “Explain with DevTutor” to get a clear explanation powered by a local AI model.

It also provides examples, use cases, interview questions, quizzes, PDF learning, and learning history.

🚀 Built with Chrome Extensions, Node.js, Express, Ollama, and Qwen 1.7B.

⸻

✨ Features

* 🧠 AI Explanations
    Understand selected technical concepts in simple language.
* 💡 Code Examples
    Get practical examples related to the selected concept.
* ❓ Why Is It Used?
    Understand where and why a technology or concept is useful.
* 🎯 Interview Questions
    Practice technical interview questions based on what you are learning.
* 🧪 Quiz Mode
    Test your understanding with quick technical quizzes.
* 📚 Learning History
    Keep track of concepts you have learned.
* 📄 PDF Learning
    Upload a technical PDF, get a summary, ask questions, and generate quizzes.
* 📊 Learning Dashboard
    View your learning activity and progress.
* 🔒 Local AI
    AI processing currently runs through Ollama and Qwen locally instead of requiring a paid OpenAI API key.

⸻

🖥️ How DevTutor AI Works

You select technical text
          ↓
Right-click → Explain with DevTutor
          ↓
Chrome Extension
          ↓
Local Node.js Backend
          ↓
Ollama
          ↓
Qwen 1.7B
          ↓
Clear AI-powered explanation

⸻

📋 Requirements

Before installing DevTutor AI, make sure you have:

* Google Chrome
* Node.js 18 or newer
* Ollama
* Git (optional, only required if cloning the repository)

You can download Node.js from:

https://nodejs.org/

You can download Ollama from:

https://ollama.com/

⸻

📥 Installation

There are two ways to download the project.

Option 1: Download ZIP

1. Open the DevTutor AI GitHub repository.
2. Click the green Code button.
3. Click Download ZIP.
4. Extract the ZIP file.
5. Open the extracted project folder.

Option 2: Clone with Git

Open Terminal and run:

git clone https://github.com/sharvilphale22/devtutor-ai.git
cd devtutor-ai

⸻

🧠 Step 1: Install the Qwen AI Model

Open Terminal and run:

ollama pull qwen3:1.7b

This downloads the Qwen 1.7B model to your computer.

You only need to do this once.

⸻

⚙️ Step 2: Install Backend Dependencies

Open Terminal and go to the server folder:

cd ~/Desktop/devtutor/server

Install the required packages:

npm install

⸻

🚀 Step 3: Start the AI Backend

Start Ollama in one Terminal:

ollama serve

Keep this Terminal running.

Then open another Terminal and run:

ollama run qwen3:1.7b

Keep this running as well.

Now open another Terminal and start the DevTutor backend:

cd ~/Desktop/devtutor/server
node server.js

The backend should start on:

http://localhost:3000

You can test it by opening this address in Chrome:

http://localhost:3000/health

You should see:

{
  "status": "ok"
}

⸻

🌐 Step 4: Install DevTutor AI in Chrome

DevTutor AI is currently distributed as an unpacked Chrome extension.

No Chrome Web Store subscription is required.

1. Open Chrome

Go to:

chrome://extensions

2. Enable Developer Mode

Turn on:

Developer mode

3. Load the extension

Click:

Load unpacked

4. Select the project folder

Select the main DevTutor AI folder:

devtutor-ai

or, if you downloaded it to your Desktop:

~/Desktop/devtutor

Chrome will load DevTutor AI.

⸻

🧪 Step 5: Use DevTutor AI

Method 1: Explain selected text

1. Open any technical webpage.
2. Select a technical word, sentence, or paragraph.
3. Right-click.
4. Select:

Explain with DevTutor

5. Open the DevTutor AI extension.
6. Choose the feature you want.

For example:

Select: "What is JWT authentication?"
              ↓
Explain with DevTutor
              ↓
DevTutor AI
              ↓
Simple explanation + technical details

⸻

📄 PDF Learning

DevTutor AI can also help you learn from technical PDFs.

You can:

* Upload a PDF
* Generate a summary
* Ask questions about the PDF
* Generate quizzes
* Learn important concepts from the document

This is useful for:

* College notes
* Technical documentation
* Research papers
* Interview preparation
* Course material

⸻

📚 Learning History

DevTutor AI keeps track of concepts you have explored.

You can use Learning History to review previously studied topics instead of searching for them again.

⸻

📊 Learning Dashboard

The dashboard provides an overview of your learning activity, including concepts and learning progress.

The goal is to turn DevTutor AI from a simple AI explainer into a developer learning system.

⸻

🛠️ Tech Stack

Technology	Purpose
JavaScript	Extension logic
HTML	Extension interface
CSS	User interface
Chrome Extension Manifest V3	Browser extension
Node.js	Backend runtime
Express.js	Backend API
Ollama	Local AI runtime
Qwen 3 1.7B	Local AI model
PDF Parse	PDF text extraction
Chrome Storage	Local learning data

⸻

📁 Project Structure

devtutor/
│
├── assets/
│   └── devtutor-icon.png
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── background.js
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
│
├── package.json
├── package-lock.json
├── README.md
└── .gitignore

⸻

🔐 Privacy

DevTutor AI currently uses a local AI setup.

Your selected text and PDF processing are sent to your local backend:

Chrome Extension
       ↓
localhost:3000
       ↓
Ollama
       ↓
Qwen

The current version does not require a personal OpenAI API key.

⸻

⚠️ Important: Local AI Requirement

The current version of DevTutor AI is designed for local use.

Installing the Chrome extension alone is not enough for the AI features.

You also need:

Node.js
+
Ollama
+
Qwen 1.7B
+
DevTutor backend

If Ollama or the backend is not running, AI features will not work.

⸻

🔧 Troubleshooting

Extension does not load

Make sure you selected the main project folder containing:

manifest.json

Then reload the extension from:

chrome://extensions

⸻

AI does not respond

Make sure Ollama is running:

ollama serve

And make sure the model is available:

ollama run qwen3:1.7b

Also make sure the backend is running:

cd server
node server.js

⸻

Check the backend

Open:

http://localhost:3000/health

You should receive:

{
  "status": "ok"
}

⸻

🎯 Project Goal

DevTutor AI aims to make technical learning easier by bringing an AI learning assistant directly into the developer’s browser.

Instead of:

Read → Get confused → Search Google → Watch videos → Search again

DevTutor AI aims for:

Learn → Select → Ask → Understand → Practice

⸻

🚀 Future Improvements

Planned improvements include:

* ☁️ Cloud-hosted AI backend
* 👤 User accounts
* 📈 Advanced learning analytics
* 🧠 Personalized learning paths
* 🔗 Knowledge graph
* 📱 Improved cross-browser support
* 🌐 Easier public installation
* 🔍 RAG-based technical documentation learning

⸻

👨‍💻 Author

Sharvil Phale

Electronics & Telecommunication Engineering Student
Developer | AI Enthusiast | Builder

Project

DevTutor AI

GitHub:

https://github.com/sharvilphale22/devtutor-ai

⸻

⭐ If you find this project interesting

Star the repository and explore the project.

Learn. Understand. Build.

Made with ❤️ by Sharvil Phale

One important correction before you paste it

Because your actual project folder is currently:

~/Desktop/devtutor

the README’s commands using ~/Desktop/devtutor/server are correct for your current setup. For someone who downloads the ZIP somewhere else, they should first cd into wherever they extracted the project, then run:

cd server
npm install
node server.js

That small change would make the README even more universal.cd ~/Desktop/devtutor
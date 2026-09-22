Yes bhai. 👍 Since this is going on GitHub and recruiters may see it, let’s make the README professional but not overly long.

Copy everything below into the empty README.md in TextEdit.

🧠 DevTutor AI

An AI-powered technical learning assistant built as a Chrome Extension for developers and students.

DevTutor AI helps you learn programming concepts directly while browsing technical content.

Select a technical term or piece of code, right-click, and use Explain with DevTutor to get a short, practical explanation powered by a local AI model.

⸻

✨ Features

* 🧠 AI Explanation - Understand technical concepts in simple language
* 💻 Code Examples - Get small practical examples
* ❓ Why is it used? - Understand real-world use cases
* 🎯 Interview Questions - Practice beginner-level interview questions
* 🧪 AI Quiz - Test your understanding with MCQs
* 📚 Learning History - Track previously learned concepts
* 📊 Learning Dashboard - View learning and quiz statistics
* 📄 PDF Learning - Upload technical PDFs and learn from them
* 💬 PDF Q&A - Ask questions about uploaded PDF content
* 🔒 Local AI - Uses Ollama and Qwen locally instead of a paid AI API
* ⚡ Fast Responses - Prompts are designed for short, practical answers

⸻

🏗️ Architecture

┌──────────────────────────┐
│     Chrome Extension     │
│                          │
│  Selection / Popup / UI  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│     Node.js + Express    │
│       Local Backend      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│          Ollama          │
│       Local AI Runtime   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       Qwen 3 1.7B        │
│       Local AI Model     │
└──────────────────────────┘

Chrome local storage is used for learning history, quiz statistics, selected text, and related local learning data.

⸻

🛠️ Tech Stack

Frontend

* HTML
* CSS
* JavaScript
* Chrome Extension Manifest V3

Backend

* Node.js
* Express.js
* CORS
* Multer
* PDF Parse

AI

* Ollama
* Qwen 3 1.7B

Storage

* Chrome Local Storage

⸻

📁 Project Structure

devtutor/
│
├── manifest.json
├── background.js
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

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd devtutor

2. Install backend dependencies

cd server
npm install

3. Start Ollama

Make sure Ollama is installed and the Qwen model is available.

ollama serve

The project uses:

qwen3:1.7b

4. Start the DevTutor backend

Open another Terminal window:

cd ~/Desktop/devtutor/server
npm start

The backend runs at:

http://localhost:3000

5. Load the Chrome Extension

Open Chrome and go to:

chrome://extensions

Then:

1. Enable Developer mode
2. Click Load unpacked
3. Select the devtutor folder
4. Open the DevTutor AI extension

⸻

💡 How It Works

1. Select a technical concept or code on a webpage.
2. Right-click the selection.
3. Select Explain with DevTutor.
4. Open the DevTutor extension.
5. Choose an action such as:
    * Explain
    * Give Example
    * Why is it used?
    * Interview Question
    * Quiz Me
6. DevTutor sends the request to the local backend.
7. Ollama processes the request using Qwen.
8. The result is displayed inside the extension.

⸻

📄 PDF Learning

DevTutor can also process technical PDFs.

The PDF workflow allows users to:

* Upload a PDF
* Extract readable text
* Generate a short AI summary
* Ask questions about the PDF
* Generate quizzes from the PDF content
* Track PDF learning activity

Current limitation

The current PDF system works with PDFs containing selectable/readable text.

Scanned PDFs that contain only images may require OCR in a future version.

⸻

🔒 Privacy

DevTutor is designed around a local-first approach.

The AI requests are processed through a locally running Ollama instance instead of requiring a paid cloud AI API.

No OpenAI API key is required.

⸻

🎯 Project Goal

The goal of DevTutor AI is to make technical learning more interactive while developers browse documentation, tutorials, code examples, and technical resources.

Instead of leaving the webpage to search for an explanation, learners can interact with the selected concept directly inside their browser.

⸻

🔮 Future Improvements

Possible future improvements include:

* OCR support for scanned PDFs
* Better code formatting
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

Interested in software engineering, AI, developer tools, and intelligent learning systems.

⸻

⭐ If You Find This Project Interesting

Feel free to explore the code, suggest improvements, or build your own version of the idea.

Important

There is one placeholder in the README:

<YOUR_GITHUB_REPOSITORY_URL>

Don’t change it yet. We don’t have your GitHub repository URL because we haven’t created the repository.

For now:

1. Paste the README above.
2. Save it with Command + S.
3. Close TextEdit.

Then tell me “saved”.

After that we’ll create the GitHub repository and replace that placeholder with the real URL.
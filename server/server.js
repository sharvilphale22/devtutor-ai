const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();

const PORT = 3000;
const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "qwen3:1.7b";

const MAX_TEXT_LENGTH = 12000;
const MAX_PDF_SIZE = 10 * 1024 * 1024;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* =========================================================
   PDF UPLOAD CONFIGURATION
========================================================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_PDF_SIZE
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Only PDF files are supported.")
      );
    }

    cb(null, true);
  }
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "DevTutor backend is running!",
    model: MODEL
  });
});

app.get("/health", async (req, res) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:11434/api/tags"
    );

    if (!response.ok) {
      return res.status(503).json({
        status: "error",
        backend: "running",
        ollama: "unavailable"
      });
    }

    res.json({
      status: "success",
      backend: "running",
      ollama: "running",
      model: MODEL
    });

  } catch (error) {
    res.status(503).json({
      status: "error",
      backend: "running",
      ollama: "unavailable",
      details: error.message
    });
  }
});

/* =========================================================
   PROMPTS
========================================================= */

const prompts = {

  explain: `
You are DevTutor, a fast programming tutor.

Analyze the selected technical text.

Use exactly:

🧠 SIMPLE
Explain in 1-2 short sentences.

💻 EXAMPLE
Give one tiny practical example.

⚠️ COMMON MISTAKE
Give one important mistake.

🎯 INTERVIEW TIP
Give one useful interview point.

Rules:
- Maximum 80 words.
- Simple English.
- Be direct.
- Do not repeat the user's input.
- Keep code very short.

Selected text:
`,

  example: `
You are DevTutor, a fast programming tutor.

Explain the selected concept using one practical example.

Use exactly:

💡 WHAT IT DOES
Explain in 1-2 short sentences.

💻 EXAMPLE
Give one small working code example.

📌 HOW IT WORKS
Give 2 short points.

Rules:
- Maximum 70 words.
- Simple English.
- Keep code short.
- No long introduction.

Selected text:
`,

  why: `
You are DevTutor, a fast programming tutor.

Explain why the selected concept is useful.

Use exactly:

❓ WHY
Give the direct reason.

🛠️ PROBLEM IT SOLVES
Give one practical problem.

🌍 REAL USE
Give one real-world use.

Rules:
- Maximum 60 words.
- Simple English.
- Be direct.

Selected text:
`,

  interview: `
You are DevTutor, a software interview tutor.

Create ONE useful beginner-level interview question about the selected concept.

Use exactly:

🎯 QUESTION
Question:

✅ ANSWER
Short direct answer.

💡 TIP
One interview tip.

Rules:
- Maximum 60 words.
- Practical question.
- Keep the answer short.

Selected text:
`,

  quiz: `
You are DevTutor, a programming quiz generator.

Create ONE beginner-friendly multiple-choice question about the selected technical text.

Return ONLY valid JSON.

The JSON MUST have exactly this structure:

{
  "question": "question text",
  "options": {
    "A": "option A",
    "B": "option B",
    "C": "option C",
    "D": "option D"
  },
  "correctAnswer": "A",
  "why": "short explanation"
}

Rules:
- Exactly ONE question.
- Exactly FOUR options.
- Exactly ONE correct answer.
- correctAnswer must be A, B, C, or D.
- Do not use markdown.
- Do not write anything outside JSON.
- Keep everything short.

Selected text:
`,

  pdfSummary: `
You are DevTutor, a fast programming tutor.

Analyze this technical PDF text.

Give a short learning summary.

Use exactly:

📚 TOPIC
Identify the main topic.

🧠 KEY IDEAS
Give 3 short important points.

💻 PRACTICAL USE
Give one practical use.

🎯 INTERVIEW TIP
Give one interview point.

Rules:
- Maximum 120 words.
- Simple English.
- Be direct.
- Do not repeat the PDF text.

PDF text:
`,

  pdfQuestion: `
You are DevTutor, a technical tutor.

Answer the user's question using ONLY the provided PDF content.

Use exactly:

🧠 ANSWER
Give the direct answer.

📌 FROM THE PDF
Give the relevant idea from the document.

💡 REMEMBER
Give one short memory tip.

Rules:
- Maximum 100 words.
- Simple English.
- If the PDF does not contain enough information, say:
"The PDF does not contain enough information to answer this."

PDF content:
`
};

/* =========================================================
   HELPERS
========================================================= */

function extractAIResponse(data) {

  if (
    typeof data?.message?.content === "string" &&
    data.message.content.trim()
  ) {
    return data.message.content.trim();
  }

  if (
    typeof data?.response === "string" &&
    data.response.trim()
  ) {
    return data.response.trim();
  }

  return "";
}

function cleanText(text) {
  return String(text || "")
    .replace(/\0/g, "")
    .trim();
}

function limitText(text) {
  return cleanText(text).slice(
    0,
    MAX_TEXT_LENGTH
  );
}

function parseQuizResponse(aiResponse) {

  let cleaned = String(
    aiResponse || ""
  ).trim();

  if (!cleaned) {
    throw new Error(
      "AI returned an empty quiz response."
    );
  }

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.substring(
      firstBrace,
      lastBrace + 1
    );
  }

  return JSON.parse(cleaned);
}

function validateQuiz(quiz) {

  if (!quiz || typeof quiz !== "object") {
    throw new Error(
      "Quiz is not an object."
    );
  }

  if (
    typeof quiz.question !== "string" ||
    !quiz.question.trim()
  ) {
    throw new Error(
      "Missing quiz question."
    );
  }

  const letters = [
    "A",
    "B",
    "C",
    "D"
  ];

  if (
    !quiz.options ||
    typeof quiz.options !== "object"
  ) {
    throw new Error(
      "Missing quiz options."
    );
  }

  for (const letter of letters) {

    if (
      typeof quiz.options[letter] !== "string" ||
      !quiz.options[letter].trim()
    ) {
      throw new Error(
        `Missing option ${letter}.`
      );
    }
  }

  if (
    !letters.includes(
      quiz.correctAnswer
    )
  ) {
    throw new Error(
      "Invalid correct answer."
    );
  }

  if (
    typeof quiz.why !== "string" ||
    !quiz.why.trim()
  ) {
    throw new Error(
      "Missing quiz explanation."
    );
  }

  return true;
}

/* =========================================================
   AI CALL
========================================================= */

async function askOllama(
  prompt,
  type = "normal"
) {

  const response = await fetch(
    OLLAMA_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({

        model: MODEL,

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        stream: false,

        // Faster Qwen response
        think: false,

        ...(type === "quiz"
          ? {
              format: "json"
            }
          : {}),

        options: {

          num_predict:
            type === "quiz"
              ? 180
              : 220,

          temperature:
            type === "quiz"
              ? 0.1
              : 0.2
        }
      })
    }
  );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Ollama HTTP ${response.status}: ${errorText}`
    );
  }

  const data =
    await response.json();

  const result =
    extractAIResponse(data);

  if (!result) {
    throw new Error(
      "Ollama returned an empty response."
    );
  }

  return result;
}

/* =========================================================
   NORMAL EXPLANATION
========================================================= */

app.post(
  "/explain",
  async (req, res) => {

    const {
      text,
      type = "explain"
    } = req.body;

    const cleanInput =
      cleanText(text);

    console.log(
      `Request: ${type}`
    );

    if (!cleanInput) {

      return res.status(400).json({
        error:
          "No text was provided."
      });
    }

    if (
      cleanInput.length > MAX_TEXT_LENGTH
    ) {

      return res.status(400).json({
        error:
          `Text is too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`
      });
    }

    const selectedPrompt =
      (
        prompts[type] ||
        prompts.explain
      ) +
      "\n" +
      cleanInput;

    try {

      const aiResponse =
        await askOllama(
          selectedPrompt,
          type
        );

      /* QUIZ */

      if (type === "quiz") {

        try {

          const quiz =
            parseQuizResponse(
              aiResponse
            );

          validateQuiz(quiz);

          const cleanQuiz = {

            question:
              quiz.question.trim(),

            options: {

              A:
                quiz.options.A.trim(),

              B:
                quiz.options.B.trim(),

              C:
                quiz.options.C.trim(),

              D:
                quiz.options.D.trim()
            },

            correctAnswer:
              quiz.correctAnswer.trim(),

            why:
              quiz.why.trim()
          };

          return res.json({
            quiz: cleanQuiz
          });

        } catch (quizError) {

          console.error(
            "Quiz error:",
            quizError.message
          );

          return res.status(500).json({
            error:
              "DevTutor generated an invalid quiz.",
            details:
              quizError.message
          });
        }
      }

      return res.json({
        explanation:
          aiResponse
      });

    } catch (error) {

      console.error(
        "AI error:",
        error.message
      );

      return res.status(503).json({

        error:
          "DevTutor could not reach the local AI.",

        details:
          "Make sure Ollama is running."
      });
    }
  }
);

/* =========================================================
   PDF UPLOAD
========================================================= */

app.post(
  "/pdf/upload",
  upload.single("pdf"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error:
            "No PDF file was uploaded."
        });
      }

      console.log(
        `PDF received: ${req.file.originalname}`
      );

      const pdfData =
        await pdfParse(
          req.file.buffer
        );

      const extractedText =
        cleanText(
          pdfData.text
        );

      if (!extractedText) {

        return res.status(422).json({
          error:
            "Could not extract readable text from this PDF.",
          details:
            "The PDF may contain scanned images instead of selectable text."
        });
      }

      const limitedText =
        limitText(
          extractedText
        );

      return res.json({

        success: true,

        filename:
          req.file.originalname,

        pages:
          pdfData.numpages,

        characters:
          extractedText.length,

        text:
          limitedText,

        truncated:
          extractedText.length >
          MAX_TEXT_LENGTH
      });

    } catch (error) {

      console.error(
        "PDF error:",
        error
      );

      return res.status(500).json({

        error:
          "Could not process the PDF.",

        details:
          error.message
      });
    }
  }
);

/* =========================================================
   PDF SUMMARY
========================================================= */

app.post(
  "/pdf/summary",
  async (req, res) => {

    const pdfText =
      limitText(
        req.body?.text
      );

    if (!pdfText) {

      return res.status(400).json({
        error:
          "No PDF text was provided."
      });
    }

    try {

      const result =
        await askOllama(
          prompts.pdfSummary +
          "\n" +
          pdfText
        );

      return res.json({
        explanation:
          result
      });

    } catch (error) {

      console.error(
        "PDF summary error:",
        error
      );

      return res.status(503).json({

        error:
          "Could not generate PDF summary.",

        details:
          "Make sure Ollama is running."
      });
    }
  }
);

/* =========================================================
   PDF QUESTION
========================================================= */

app.post(
  "/pdf/question",
  async (req, res) => {

    const pdfText =
      limitText(
        req.body?.text
      );

    const question =
      cleanText(
        req.body?.question
      );

    if (!pdfText) {
      return res.status(400).json({
        error:
          "No PDF text was provided."
      });
    }

    if (!question) {
      return res.status(400).json({
        error:
          "Please enter a question."
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        error:
          "Question is too long."
      });
    }

    try {

      const prompt =
        prompts.pdfQuestion +
        "\n\nUSER QUESTION:\n" +
        question +
        "\n\nPDF CONTENT:\n" +
        pdfText;

      const result =
        await askOllama(
          prompt
        );

      return res.json({
        explanation:
          result
      });

    } catch (error) {

      console.error(
        "PDF question error:",
        error
      );

      return res.status(503).json({

        error:
          "Could not answer the PDF question.",

        details:
          "Make sure Ollama is running."
      });
    }
  }
);

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

app.use(
  (error, req, res, next) => {

    if (
      error instanceof multer.MulterError
    ) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(413).json({
          error:
            "PDF is too large. Maximum size is 10 MB."
        });
      }

      return res.status(400).json({
        error:
          error.message
      });
    }

    if (error) {

      return res.status(400).json({
        error:
          error.message
      });
    }

    next();
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "===================================="
    );
    console.log(
      "       DevTutor Backend Started"
    );
    console.log(
      "===================================="
    );
    console.log(
      `Server: http://localhost:${PORT}`
    );
    console.log(
      `Health: http://localhost:${PORT}/health`
    );
    console.log(
      `Ollama: ${OLLAMA_URL}`
    );
    console.log(
      `Model:  ${MODEL}`
    );
    console.log(
      "===================================="
    );
    console.log("");
  }
);
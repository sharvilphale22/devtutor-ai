const API_URL =
  "http://localhost:3000";


/* =========================================================
   ELEMENTS
========================================================= */

const result =
  document.getElementById("result");

const mainView =
  document.getElementById("mainView");

const pdfView =
  document.getElementById("pdfView");

const dashboardView =
  document.getElementById(
    "dashboardView"
  );

const historyView =
  document.getElementById(
    "historyView"
  );


/* =========================================================
   STORAGE HELPERS
========================================================= */

function getStorage(keys) {
  return new Promise((resolve) => {

    chrome.storage.local.get(
      keys,
      resolve
    );

  });
}


function setStorage(data) {
  return new Promise((resolve) => {

    chrome.storage.local.set(
      data,
      resolve
    );

  });
}


/* =========================================================
   GET SELECTED TEXT
========================================================= */

async function getSelectedText() {

  const data =
    await getStorage([
      "selectedText"
    ]);

  return (
    data.selectedText || ""
  ).trim();
}


/* =========================================================
   VIEW MANAGEMENT
========================================================= */

function hideAllViews() {

  mainView.classList.add(
    "hidden"
  );

  pdfView.classList.add(
    "hidden"
  );

  dashboardView.classList.add(
    "hidden"
  );

  historyView.classList.add(
    "hidden"
  );
}


function showMain() {

  hideAllViews();

  mainView.classList.remove(
    "hidden"
  );

}


function showPDF() {

  hideAllViews();

  pdfView.classList.remove(
    "hidden"
  );

}


function showDashboard() {

  hideAllViews();

  dashboardView.classList.remove(
    "hidden"
  );

  loadDashboard();

}


function showHistory() {

  hideAllViews();

  historyView.classList.remove(
    "hidden"
  );

  loadHistory();

}


/* =========================================================
   INITIAL LOAD
========================================================= */

async function loadSelectedText() {

  const text =
    await getSelectedText();

  if (!text) {

    result.textContent =
      "Select technical text from a webpage and choose an action.";

    return;
  }

  result.textContent = text;
}


/* =========================================================
   LOADING
========================================================= */

function showLoading(message) {

  result.innerHTML = `
    <div class="thinking">
      ⏳ ${message}
    </div>
  `;
}


function showError(
  element,
  message
) {

  element.innerHTML = `
    <div class="error-message">
      ⚠️ ${escapeHTML(message)}
    </div>
  `;
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


/* =========================================================
   AI REQUEST
========================================================= */

async function requestAI(
  type
) {

  const text =
    await getSelectedText();

  if (!text) {

    showError(
      result,
      "No text selected. Select a technical concept first."
    );

    return;
  }

  showLoading(
    "DevTutor is thinking..."
  );

  try {

    const response =
      await fetch(
        `${API_URL}/explain`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            text,
            type
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.error ||
        "Something went wrong."
      );
    }

    if (type === "quiz") {

      if (!data.quiz) {
        throw new Error(
          "Invalid quiz received."
        );
      }

      showQuiz(
        data.quiz,
        text
      );

      return;
    }

    const explanation =
      data.explanation;

    if (!explanation) {

      throw new Error(
        "AI returned an empty response."
      );
    }

    renderAIResponse(
      explanation
    );

    await saveLearningHistory(
      text
    );

  } catch (error) {

    showError(
      result,
      getFriendlyError(
        error
      )
    );
  }
}


/* =========================================================
   FRIENDLY ERRORS
========================================================= */

function getFriendlyError(
  error
) {

  const message =
    String(
      error?.message || ""
    );

  if (
    message.includes(
      "Failed to fetch"
    )
  ) {

    return (
      "Cannot connect to DevTutor backend. " +
      "Start Ollama and the Node server."
    );
  }

  return (
    message ||
    "Something went wrong."
  );
}


/* =========================================================
   RENDER AI RESPONSE
========================================================= */

function renderAIResponse(
  text
) {

  const escaped =
    escapeHTML(text);

  const formatted =
    escaped
      .replace(
        /\n/g,
        "<br>"
      );

  result.innerHTML = `
    <div class="ai-response">
      ${formatted}
    </div>
  `;

  addCopyButtons();
}


/* =========================================================
   COPY CODE SUPPORT
========================================================= */

function addCopyButtons() {

  const codeBlocks =
    result.querySelectorAll(
      "code"
    );

  codeBlocks.forEach(
    (code) => {

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "copy-button";

      button.textContent =
        "Copy";

      button.onclick = async () => {

        await navigator.clipboard.writeText(
          code.innerText
        );

        button.textContent =
          "Copied";

        setTimeout(() => {

          button.textContent =
            "Copy";

        }, 1200);

      };

      code.parentElement?.prepend(
        button
      );

    }
  );
}


/* =========================================================
   QUIZ
========================================================= */

function showQuiz(
  quiz,
  selectedText
) {

  result.innerHTML = "";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.innerHTML = `
    <div class="quiz-question">
      ${escapeHTML(
        quiz.question
      )}
    </div>

    <div class="quiz-options">

      <button
        class="quiz-option"
        data-answer="A"
      >
        A. ${escapeHTML(
          quiz.options.A
        )}
      </button>

      <button
        class="quiz-option"
        data-answer="B"
      >
        B. ${escapeHTML(
          quiz.options.B
        )}
      </button>

      <button
        class="quiz-option"
        data-answer="C"
      >
        C. ${escapeHTML(
          quiz.options.C
        )}
      </button>

      <button
        class="quiz-option"
        data-answer="D"
      >
        D. ${escapeHTML(
          quiz.options.D
        )}
      </button>

    </div>
  `;

  result.appendChild(
    wrapper
  );

  const options =
    result.querySelectorAll(
      ".quiz-option"
    );

  options.forEach(
    (button) => {

      button.addEventListener(
        "click",
        async () => {

          const selected =
            button.dataset.answer;

          const correct =
            selected ===
            quiz.correctAnswer;

          options.forEach(
            (item) => {

              item.disabled =
                true;

            }
          );

          result.innerHTML += `
            <div class="quiz-result-message">
              ${
                correct
                  ? "✅ Correct!"
                  : "❌ Incorrect."
              }
            </div>

            <div class="quiz-why">
              ${escapeHTML(
                quiz.why
              )}
            </div>
          `;

          await saveQuizResult(
            correct,
            selectedText
          );

        }
      );

    }
  );
}


/* =========================================================
   LEARNING HISTORY
========================================================= */

async function saveLearningHistory(
  text
) {

  const data =
    await getStorage([
      "learningHistory"
    ]);

  const history =
    data.learningHistory || [];

  const concept =
    text
      .replace(
        /\s+/g,
        " "
      )
      .trim()
      .slice(
        0,
        100
      );

  const exists =
    history.some(
      item =>
        item.concept ===
        concept
    );

  if (exists) {
    return;
  }

  history.unshift({

    id:
      Date.now(),

    concept,

    date:
      new Date().toISOString()

  });

  await setStorage({

    learningHistory:
      history.slice(
        0,
        100
      )

  });
}


/* =========================================================
   QUIZ STORAGE
========================================================= */

async function saveQuizResult(
  correct,
  concept
) {

  const data =
    await getStorage([
      "quizStats"
    ]);

  const stats =
    data.quizStats || {

      total: 0,
      correct: 0

    };

  stats.total += 1;

  if (correct) {
    stats.correct += 1;
  }

  await setStorage({
    quizStats: stats
  });

  await saveLearningHistory(
    concept
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

  const data =
    await getStorage([
      "learningHistory",
      "quizStats",
      "pdfHistory"
    ]);

  const history =
    data.learningHistory || [];

  const quizStats =
    data.quizStats || {
      total: 0,
      correct: 0
    };

  const pdfHistory =
    data.pdfHistory || [];

  document.getElementById(
    "conceptCount"
  ).textContent =
    history.length;

  document.getElementById(
    "quizCount"
  ).textContent =
    quizStats.total;

  const accuracy =
    quizStats.total
      ? Math.round(
          (
            quizStats.correct /
            quizStats.total
          ) * 100
        )
      : 0;

  document.getElementById(
    "accuracyCount"
  ).textContent =
    `${accuracy}%`;

  document.getElementById(
    "pdfCount"
  ).textContent =
    pdfHistory.length;

  const recent =
    history.slice(
      0,
      5
    );

  const container =
    document.getElementById(
      "dashboardRecent"
    );

  if (!recent.length) {

    container.textContent =
      "No learning activity yet.";

    return;
  }

  container.innerHTML =
    recent
      .map(
        (item, index) => `
          <div class="recent-item">

            <span>
              ${index + 1}
            </span>

            <div>
              ${escapeHTML(
                item.concept
              )}

              <small>
                ${formatDate(
                  item.date
                )}
              </small>
            </div>

          </div>
        `
      )
      .join("");
}


/* =========================================================
   HISTORY
========================================================= */

async function loadHistory() {

  const data =
    await getStorage([
      "learningHistory"
    ]);

  const history =
    data.learningHistory || [];

  document.getElementById(
    "historyCount"
  ).textContent =
    `${history.length} concepts`;

  const list =
    document.getElementById(
      "historyList"
    );

  if (!history.length) {

    list.innerHTML = `
      <div class="history-empty">

        <div class="history-empty-icon">
          📚
        </div>

        <div class="history-empty-title">
          No learning history
        </div>

        <div class="history-empty-text">
          Start learning technical concepts
          to see them here.
        </div>

      </div>
    `;

    return;
  }

  list.innerHTML =
    history
      .map(
        (item, index) => `

          <div class="history-card">

            <div class="history-card-content">

              <div class="history-number">
                ${index + 1}
              </div>

              <div class="history-info">

                <div class="history-concept">
                  ${escapeHTML(
                    item.concept
                  )}
                </div>

                <div class="history-date">
                  ${formatDate(
                    item.date
                  )}
                </div>

              </div>

            </div>

            <div class="history-actions">

              <button
                class="delete-history-button"
                data-id="${item.id}"
              >
                Delete
              </button>

            </div>

          </div>

        `
      )
      .join("");

  list
    .querySelectorAll(
      ".delete-history-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          async () => {

            await deleteHistoryItem(
              Number(
                button.dataset.id
              )
            );

            loadHistory();

          }
        );

      }
    );
}


/* =========================================================
   DELETE HISTORY
========================================================= */

async function deleteHistoryItem(
  id
) {

  const data =
    await getStorage([
      "learningHistory"
    ]);

  const history =
    data.learningHistory || [];

  await setStorage({

    learningHistory:
      history.filter(
        item =>
          item.id !== id
      )

  });
}


/* =========================================================
   CLEAR HISTORY
========================================================= */

async function clearHistory() {

  const confirmed =
    confirm(
      "Clear all learning history?"
    );

  if (!confirmed) {
    return;
  }

  await setStorage({

    learningHistory: []

  });

  loadHistory();
}


/* =========================================================
   DATE
========================================================= */

function formatDate(
  date
) {

  try {

    return new Date(
      date
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  } catch {

    return "";

  }
}


/* =========================================================
   PDF
========================================================= */

let currentPDFText = "";


/* OPEN PDF */

document
  .getElementById(
    "choosePdfButton"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "pdfInput"
        )
        .click();

    }
  );


/* PDF SELECTED */

document
  .getElementById(
    "pdfInput"
  )
  .addEventListener(
    "change",
    handlePDFUpload
  );


async function handlePDFUpload(
  event
) {

  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  if (
    file.type !==
    "application/pdf"
  ) {

    showError(
      document.getElementById(
        "pdfStatus"
      ),
      "Please choose a PDF file."
    );

    return;
  }

  if (
    file.size >
    10 * 1024 * 1024
  ) {

    showError(
      document.getElementById(
        "pdfStatus"
      ),
      "PDF must be smaller than 10 MB."
    );

    return;
  }

  const status =
    document.getElementById(
      "pdfStatus"
    );

  status.innerHTML =
    "⏳ Reading PDF...";

  try {

    const formData =
      new FormData();

    formData.append(
      "pdf",
      file
    );

    const response =
      await fetch(
        `${API_URL}/pdf/upload`,
        {
          method: "POST",
          body: formData
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.error ||
        "Could not read PDF."
      );
    }

    currentPDFText =
      data.text;

    document.getElementById(
      "pdfFileName"
    ).textContent =
      data.filename;

    status.innerHTML = `
      ✅ PDF loaded

      <br>

      ${data.pages} pages

      <br>

      ${data.characters.toLocaleString()}
      characters extracted

      ${
        data.truncated
          ? "<br>⚠️ Large PDF: only the first section is analyzed."
          : ""
      }
    `;

    document
      .getElementById(
        "pdfActions"
      )
      .classList.remove(
        "hidden"
      );

    document.getElementById(
      "pdfResult"
    ).innerHTML = "";

    await savePDFHistory(
      data.filename
    );

  } catch (error) {

    showError(
      status,
      getFriendlyError(
        error
      )
    );
  }
}


/* PDF SUMMARY */

document
  .getElementById(
    "pdfSummaryButton"
  )
  .addEventListener(
    "click",
    async () => {

      if (!currentPDFText) {
        return;
      }

      const pdfResult =
        document.getElementById(
          "pdfResult"
        );

      pdfResult.innerHTML =
        `<div class="thinking">
          ⏳ Summarizing PDF...
        </div>`;

      try {

        const response =
          await fetch(
            `${API_URL}/pdf/summary`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                text:
                  currentPDFText
              })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.error
          );
        }

        pdfResult.innerHTML = `
          <div class="pdf-result-card">

            <div class="section-title">
              📚 PDF Summary
            </div>

            <div>
              ${escapeHTML(
                data.explanation
              ).replace(
                /\n/g,
                "<br>"
              )}
            </div>

          </div>
        `;

      } catch (error) {

        showError(
          pdfResult,
          getFriendlyError(
            error
          )
        );
      }
    }
  );


/* PDF QUESTION */

document
  .getElementById(
    "pdfAskButton"
  )
  .addEventListener(
    "click",
    askPDFQuestion
  );


async function askPDFQuestion() {

  const question =
    document
      .getElementById(
        "pdfQuestionInput"
      )
      .value
      .trim();

  if (!currentPDFText) {

    return;
  }

  if (!question) {

    showError(
      document.getElementById(
        "pdfResult"
      ),
      "Enter a question first."
    );

    return;
  }

  const pdfResult =
    document.getElementById(
      "pdfResult"
    );

  pdfResult.innerHTML =
    `<div class="thinking">
      ⏳ Finding the answer...
    </div>`;

  try {

    const response =
      await fetch(
        `${API_URL}/pdf/question`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            text:
              currentPDFText,

            question

          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.error
      );
    }

    pdfResult.innerHTML = `
      <div class="pdf-result-card">

        <div class="section-title">
          💬 DevTutor Answer
        </div>

        <div>
          ${escapeHTML(
            data.explanation
          ).replace(
            /\n/g,
            "<br>"
          )}
        </div>

      </div>
    `;

  } catch (error) {

    showError(
      pdfResult,
      getFriendlyError(
        error
      )
    );
  }
}


/* =========================================================
   PDF QUIZ
========================================================= */

document
  .getElementById(
    "pdfQuizButton"
  )
  .addEventListener(
    "click",
    async () => {

      if (!currentPDFText) {
        return;
      }

      const pdfResult =
        document.getElementById(
          "pdfResult"
        );

      pdfResult.innerHTML =
        `<div class="thinking">
          ⏳ Creating PDF quiz...
        </div>`;

      try {

        const response =
          await fetch(
            `${API_URL}/explain`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                text:
                  currentPDFText,

                type:
                  "quiz"

              })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.error
          );
        }

        showPDFQuiz(
          data.quiz
        );

      } catch (error) {

        showError(
          pdfResult,
          getFriendlyError(
            error
          )
        );
      }
    }
  );


function showPDFQuiz(
  quiz
) {

  const pdfResult =
    document.getElementById(
      "pdfResult"
    );

  pdfResult.innerHTML = `
    <div class="pdf-result-card">

      <div class="section-title">
        🧪 PDF Quiz
      </div>

      <div class="quiz-question">
        ${escapeHTML(
          quiz.question
        )}
      </div>

      <div class="quiz-options">

        ${[
          "A",
          "B",
          "C",
          "D"
        ]
          .map(
            letter => `
              <button
                class="quiz-option pdf-quiz-option"
                data-answer="${letter}"
              >
                ${letter}.
                ${escapeHTML(
                  quiz.options[
                    letter
                  ]
                )}
              </button>
            `
          )
          .join("")}

      </div>

    </div>
  `;

  pdfResult
    .querySelectorAll(
      ".pdf-quiz-option"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const correct =
              button.dataset.answer ===
              quiz.correctAnswer;

            pdfResult.innerHTML += `
              <div class="quiz-result-message">
                ${
                  correct
                    ? "✅ Correct!"
                    : "❌ Incorrect."
                }
              </div>

              <div class="quiz-why">
                ${escapeHTML(
                  quiz.why
                )}
              </div>
            `;

          }
        );

      }
    );
}


/* =========================================================
   PDF HISTORY
========================================================= */

async function savePDFHistory(
  filename
) {

  const data =
    await getStorage([
      "pdfHistory"
    ]);

  const history =
    data.pdfHistory || [];

  history.unshift({

    id:
      Date.now(),

    filename,

    date:
      new Date().toISOString()

  });

  await setStorage({

    pdfHistory:
      history.slice(
        0,
        50
      )

  });
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

document
  .getElementById(
    "explainButton"
  )
  .addEventListener(
    "click",
    () =>
      requestAI("explain")
  );


document
  .getElementById(
    "exampleButton"
  )
  .addEventListener(
    "click",
    () =>
      requestAI("example")
  );


document
  .getElementById(
    "whyButton"
  )
  .addEventListener(
    "click",
    () =>
      requestAI("why")
  );


document
  .getElementById(
    "interviewButton"
  )
  .addEventListener(
    "click",
    () =>
      requestAI("interview")
  );


document
  .getElementById(
    "quizButton"
  )
  .addEventListener(
    "click",
    () =>
      requestAI("quiz")
  );


/* PDF */

document
  .getElementById(
    "pdfButton"
  )
  .addEventListener(
    "click",
    showPDF
  );


document
  .getElementById(
    "pdfBackButton"
  )
  .addEventListener(
    "click",
    showMain
  );


/* DASHBOARD */

document
  .getElementById(
    "dashboardButton"
  )
  .addEventListener(
    "click",
    showDashboard
  );


document
  .getElementById(
    "dashboardBackButton"
  )
  .addEventListener(
    "click",
    showMain
  );


/* HISTORY */

document
  .getElementById(
    "historyButton"
  )
  .addEventListener(
    "click",
    showHistory
  );


document
  .getElementById(
    "historyBackButton"
  )
  .addEventListener(
    "click",
    showDashboard
  );


document
  .getElementById(
    "clearHistoryButton"
  )
  .addEventListener(
    "click",
    clearHistory
  );


/* =========================================================
   START
========================================================= */

loadSelectedText();
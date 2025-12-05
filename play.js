// 1. Get encoded quiz from URL
const urlParams = new URLSearchParams(window.location.search);
const encodedQuiz = urlParams.get("quiz");

// 2. Decode Base64 → JSON
const quizData = JSON.parse(atob(encodedQuiz));

const owner = quizData.owner;
const questions = quizData.questions;

// Set quiz title
document.getElementById("quizTitle").textContent = `${owner}'s Quiz`;

let current = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

loadQuestion();

function loadQuestion() {
    const q = questions[current];

    questionEl.textContent = q.question;

    // Render the REAL options coming from index.html
    optionsEl.innerHTML = `
      <button class="optBtn" data-id="0">${q.options[0]}</button>
      <button class="optBtn" data-id="1">${q.options[1]}</button>
      <button class="optBtn" data-id="2">${q.options[2]}</button>
      <button class="optBtn" data-id="3">${q.options[3]}</button>
    `;

    document.querySelectorAll(".optBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selected = parseInt(btn.dataset.id);

            if (selected === q.correct) {
                btn.classList.add("correctBtn");
                score++;
            } else {
                btn.classList.add("wrongBtn");
            }

            // Disable all buttons
            document.querySelectorAll(".optBtn").forEach(b => b.disabled = true);

            nextBtn.style.display = "block";
        });
    });
}

nextBtn.addEventListener("click", () => {

    current++;

    if (current >= questions.length) {
        showResult();
    } else {
        nextBtn.style.display = "none";
        loadQuestion();
    }
});

function showResult() {
    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("result").style.display = "block";

    document.getElementById("scoreText").textContent =
        `${score} out of ${questions.length}`;
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get encoded quiz from URL
    const urlParams = new URLSearchParams(window.location.search);
    let encodedQuiz = urlParams.get("quiz");

    // Check if quiz parameter exists
    if (!encodedQuiz) {
        document.body.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e0e0e0;">
        <h1 style="color: #ff6b6b;">Error: No Quiz Found</h1>
        <p>Please use a valid quiz link.</p>
        <a href="index.html" style="color: #4a9eff; text-decoration: none;">← Back to Create Quiz</a>
      </div>
    `;
        return;
    }

    // Handle URL encoding issues - decode if needed
    try {
        // Try to decode URL-encoded characters first
        encodedQuiz = decodeURIComponent(encodedQuiz);
    } catch (e) {
        // If already decoded, continue
    }

    // 2. Decode Base64 → JSON with error handling
    let quizData;
    try {
        const decoded = atob(encodedQuiz);
        quizData = JSON.parse(decoded);
    } catch (error) {
        console.error('Error parsing quiz data:', error);
        document.body.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e0e0e0;">
        <h1 style="color: #ff6b6b;">Error: Invalid Quiz Data</h1>
        <p>The quiz link appears to be corrupted or invalid.</p>
        <p style="font-size: 12px; color: #888;">${error.message}</p>
        <a href="index.html" style="color: #4a9eff; text-decoration: none;">← Back to Create Quiz</a>
      </div>
    `;
        return;
    }

    // Validate quiz data structure
    if (!quizData.owner || !quizData.questions || !Array.isArray(quizData.questions)) {
        document.body.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e0e0e0;">
        <h1 style="color: #ff6b6b;">Error: Invalid Quiz Format</h1>
        <p>The quiz data is missing required information.</p>
        <a href="index.html" style="color: #4a9eff; text-decoration: none;">← Back to Create Quiz</a>
      </div>
    `;
        return;
    }

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
});

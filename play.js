// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get encoded quiz from URL
    // Try multiple methods to get the quiz parameter
    const urlParams = new URLSearchParams(window.location.search);
    let encodedQuiz = urlParams.get("quiz");

    // Fallback: if URLSearchParams doesn't work, try parsing the URL directly
    if (!encodedQuiz) {
        const urlMatch = window.location.search.match(/[?&]quiz=([^&]*)/);
        if (urlMatch) {
            encodedQuiz = urlMatch[1];
        }
    }

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

    // URLSearchParams.get() automatically decodes URL-encoded parameters
    // But we need to handle URL-safe Base64 encoding

    // 2. Decode Base64 → JSON with error handling
    let quizData;
    try {
        // Validate Base64 string before decoding
        if (!encodedQuiz || encodedQuiz.trim() === '') {
            throw new Error('Empty quiz data');
        }

        // Convert URL-safe Base64 back to standard Base64
        // Replace - with +, _ with /, and add padding if needed
        let base64String = encodedQuiz.replace(/-/g, '+').replace(/_/g, '/');

        // Validate Base64 string format (should only contain A-Z, a-z, 0-9, +, /, =)
        if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
            throw new Error('Invalid Base64 format detected. The quiz link may be corrupted.');
        }

        // Add padding if needed (Base64 strings should be multiples of 4)
        while (base64String.length % 4) {
            base64String += '=';
        }

        // Decode Base64
        let decoded;
        try {
            decoded = atob(base64String);
        } catch (base64Error) {
            throw new Error(`Base64 decoding failed: ${base64Error.message}. The quiz link may be corrupted.`);
        }

        // Validate that we got a valid string
        if (!decoded || decoded.trim() === '') {
            throw new Error('Decoded data is empty');
        }

        // Parse JSON
        try {
            quizData = JSON.parse(decoded);
        } catch (jsonError) {
            // Log debugging information
            console.error('JSON parse error:', jsonError);
            console.error('Encoded quiz length:', encodedQuiz.length);
            console.error('Decoded string length:', decoded.length);
            console.error('Decoded string preview (first 200 chars):', decoded.substring(0, 200));
            console.error('Decoded string ending (last 50 chars):', decoded.substring(Math.max(0, decoded.length - 50)));

            // Check if the string appears truncated
            if (!decoded.endsWith('}')) {
                throw new Error(`JSON parsing failed: ${jsonError.message}. The quiz data appears to be truncated or corrupted. Please generate a new quiz link.`);
            }
            throw new Error(`JSON parsing failed: ${jsonError.message}. The quiz data may be corrupted.`);
        }
    } catch (error) {
        console.error('Error parsing quiz data:', error);
        document.body.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e0e0e0;">
        <h1 style="color: #ff6b6b;">Error: Invalid Quiz Data</h1>
        <p>The quiz link appears to be corrupted or invalid.</p>
        <p style="font-size: 12px; color: #888; margin-top: 10px;">${error.message}</p>
        <p style="font-size: 11px; color: #666; margin-top: 5px;">Please generate a new quiz link.</p>
        <a href="index.html" style="color: #4a9eff; text-decoration: none; margin-top: 20px; display: inline-block;">← Back to Create Quiz</a>
      </div>
    `;
        return;
    }

    // Support both shortened and full property names for backward compatibility
    const owner = quizData.o || quizData.owner;
    const questions = quizData.qs || quizData.questions;

    // Validate quiz data structure
    if (!owner || !questions || !Array.isArray(questions)) {
        document.body.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e0e0e0;">
        <h1 style="color: #ff6b6b;">Error: Invalid Quiz Format</h1>
        <p>The quiz data is missing required information.</p>
        <a href="index.html" style="color: #4a9eff; text-decoration: none;">← Back to Create Quiz</a>
      </div>
    `;
        return;
    }

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

        // Support both shortened and full property names
        const questionText = q.q || q.question;
        const options = q.o || q.options;
        const correct = q.c !== undefined ? q.c : q.correct;

        questionEl.textContent = questionText;

        // Render the REAL options coming from index.html with logos
        const getLogoForOption = (optionName) => {
            return getLogoPath(optionName);
        };

        optionsEl.innerHTML = `
        <button class="optBtn" data-id="0">
          <img src="${getLogoForOption(options[0])}" alt="${options[0]}" class="option-logo">
          <span>${options[0]}</span>
        </button>
        <button class="optBtn" data-id="1">
          <img src="${getLogoForOption(options[1])}" alt="${options[1]}" class="option-logo">
          <span>${options[1]}</span>
        </button>
        <button class="optBtn" data-id="2">
          <img src="${getLogoForOption(options[2])}" alt="${options[2]}" class="option-logo">
          <span>${options[2]}</span>
        </button>
        <button class="optBtn" data-id="3">
          <img src="${getLogoForOption(options[3])}" alt="${options[3]}" class="option-logo">
          <span>${options[3]}</span>
        </button>
      `;

        document.querySelectorAll(".optBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                const selected = parseInt(btn.dataset.id);

                if (selected === correct) {
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

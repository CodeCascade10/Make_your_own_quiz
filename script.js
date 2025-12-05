document.addEventListener('DOMContentLoaded', () => {

  const questionBlocks = document.querySelectorAll(".question-block");
  const submitQuizBtn = document.getElementById("submitQuiz");
  const output = document.getElementById("output");

  function generateQuiz() {

    let quizData = [];

    // Get quiz owner name
    const quizOwner = document.getElementById("quizName").value.trim();
    if (!quizOwner) {
      alert("Please enter your name before generating the quiz.");
      return;
    }

    questionBlocks.forEach(block => {

      // Get question text
      const questionText = block.querySelector("h3").textContent.trim();

      // Get all 4 option texts
      const optionSpans = block.querySelectorAll(".option span");
      const options = Array.from(optionSpans).map(s => s.textContent.trim());

      // Which option is correct?
      const correctOption = block.querySelector("input[type='radio']:checked");
      const correctIndex = correctOption ? parseInt(correctOption.value) : null;

      if (correctIndex === null) {
        alert("Please select answers for all questions.");
        return;
      }

      // Use shorter property names to reduce JSON size
      quizData.push({
        q: questionText,      // question
        o: options,          // options
        c: correctIndex      // correct
      });
    });

    // Build final quiz object with shorter property names
    const finalQuiz = {
      o: quizOwner,         // owner
      qs: quizData          // questions
    };

    // Minify JSON (no whitespace) to reduce size
    const jsonString = JSON.stringify(finalQuiz);

    // Validate JSON before encoding
    try {
      JSON.parse(jsonString);
    } catch (e) {
      alert("Error: Failed to create valid quiz data. Please try again.");
      console.error("JSON validation error:", e);
      return;
    }

    // Encode into Base64 and make it URL-safe
    // Standard btoa can produce characters that need URL encoding
    let encoded = btoa(jsonString);

    // Make Base64 URL-safe by replacing characters that can cause issues
    // Replace + with -, / with _, and remove = padding (we'll add it back when decoding)
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Create shareable URL (no need for encodeURIComponent since we made it URL-safe)
    const url = `${window.location.origin}/play.html?quiz=${encoded}`;

    // Show only the link
    output.innerHTML = `
      <div style="margin-top: 20px; padding: 20px; background: #1a1a1a; border-radius: 10px; border: 1px solid #3a3a3a;">
        <h3 style="color: #e0e0e0; margin-bottom: 15px;">Your Quiz Link:</h3>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <input type="text" id="quizLink" value="${url}" readonly 
                 style="flex: 1; min-width: 200px; padding: 12px; background: #111; color: #e0e0e0; border: 1px solid #3a3a3a; border-radius: 8px; font-size: 14px;">
          <button onclick="copyQuizLink()" 
                  style="padding: 12px 20px; background: #4a9eff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.2s;">
            Copy Link
          </button>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 10px;">Share this link with your friends to let them take your quiz!</p>
      </div>
    `;

    // Add copy function to window for the button
    window.copyQuizLink = async function () {
      const linkInput = document.getElementById('quizLink');
      const url = linkInput.value;
      const btn = event.target;

      try {
        // Use modern Clipboard API
        await navigator.clipboard.writeText(url);

        // Update button text temporarily
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#2ecc71';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#4a9eff';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        document.execCommand('copy');

        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#2ecc71';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#4a9eff';
        }, 2000);
      }
    };
  }

  submitQuizBtn.addEventListener("click", generateQuiz);
});


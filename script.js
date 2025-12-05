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

    // Show output
    output.textContent =
      JSON.stringify(finalQuiz, null, 2) +
      "\n\nShare this link with your friends:\n" +
      url;
  }

  submitQuizBtn.addEventListener("click", generateQuiz);
});


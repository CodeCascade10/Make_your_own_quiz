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

      quizData.push({
        question: questionText,
        options: options,
        correct: correctIndex
      });
    });

    // Build final quiz object
    const finalQuiz = {
      owner: quizOwner,
      questions: quizData
    };

    // Encode into Base64
    const encoded = btoa(JSON.stringify(finalQuiz));

    // URL encode the Base64 string to handle special characters
    const urlEncoded = encodeURIComponent(encoded);

    // Create shareable URL
    const url = `${window.location.origin}/play.html?quiz=${urlEncoded}`;

    // Show output
    output.textContent =
      JSON.stringify(finalQuiz, null, 2) +
      "\n\nShare this link with your friends:\n" +
      url;
  }

  submitQuizBtn.addEventListener("click", generateQuiz);
});


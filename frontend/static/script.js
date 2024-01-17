const questions = [
  {
    text: 'What is the capital of France?',
    options: ['Paris', 'Berlin', 'London'],
    correctAnswer: 'Paris'
  },
  {
    text: 'How many continents are there?',
    options: ['5', '6', '7'],
    correctAnswer: '7'
  },
  {
    text: 'What is the capital of Japan?',
    options: ['Tokyo', 'Seoul', 'Beijing'],
    correctAnswer: 'Tokyo'
  }
];

let currentQuestionIndex = 0;
let userAnswers = [];

function startQuiz() {
  console.log('startQuiz function is called.');
  showQuestion();
}

function showQuestion() {
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const nextButton = document.getElementById('next-btn');

  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.text;

  optionsContainer.innerHTML = '';
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.className = 'option-btn';
    button.onclick = () => selectOption(index);
    optionsContainer.appendChild(button);
  });

  nextButton.style.display = 'none';

  if (currentQuestionIndex === questions.length - 1) {
    // Last question, show completion message and results
    nextButton.textContent = 'Finish';
    nextButton.onclick = finishQuiz;
  } else {
    nextButton.textContent = 'Next';
    nextButton.onclick = nextQuestion;
  }
}

function selectOption(index) {
  const optionsContainer = document.getElementById('options-container');
  const buttons = optionsContainer.querySelectorAll('.option-btn');

  buttons.forEach((button, i) => {
    if (i === index) {
      button.style.backgroundColor = '#2ecc71';
    } else {
      button.style.backgroundColor = '#3498db';
    }
    // Disable other buttons once one is selected
    button.disabled = true;
  });

  const currentQuestion = questions[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = currentQuestion.options[index];

  const nextButton = document.getElementById('next-btn');
  nextButton.style.display = 'block';
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
}

function displayResults() {
  console.log('display function called');

  // Calculate score
  const score = questions.reduce((acc, question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  userScore = score; // Store the score

  // Display results
  console.log('Setting display to block for resultContainer');
  const resultContainer = document.getElementById('result-container');
  const quizQuestionsContainer = document.getElementById('quiz-questions-container');
  const quizResults = document.getElementById('quiz-results');

  resultContainer.style.display = 'block';
  quizQuestionsContainer.style.display = 'none';

  quizResults.textContent = `Your score: ${score}/${questions.length}`;
  displayGrade(score);
}

function displayGrade(score) {
  const totalQuestions = questions.length;
  const percentage = (score / totalQuestions) * 100;

  let grade;

  if (percentage >= 90) {
    grade = 'A';
  } else if (percentage >= 80) {
    grade = 'B';
  } else if (percentage >= 70) {
    grade = 'C';
  } else if (percentage >= 60) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  const gradeContainer = document.getElementById('grade-container');
  gradeContainer.textContent = `Your grade: ${grade}`;
}

function sendGradeToServer(grade) {
  fetch('http://backend:8080/saveGrade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grade }),
  })
    .then(response => response.json())
    .then(result => {
      console.log('Grade sent successfully:', result);
    })
    .catch(error => {
      console.error('Error sending grade:', error);
    });
}

function finishQuiz() {
  console.log('Finish Button Clicked');
  displayResults();
}

function resetQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  showQuestion();

  const resultContainer = document.getElementById('result-container');
  const quizQuestionsContainer = document.getElementById('quiz-questions-container');
  const nextButton = document.getElementById('next-btn');

  // Update the style of the containers
  resultContainer.style.display = 'none';
  quizQuestionsContainer.style.display = 'block'; // Show quiz questions container

  // Reset button text and click event
  nextButton.textContent = 'Next';
  nextButton.onclick = nextQuestion;

  // Enable all option buttons
  const optionsContainer = document.getElementById('options-container');
  const buttons = optionsContainer.querySelectorAll('.option-btn');
  buttons.forEach(button => {
    button.disabled = false;
  });
}

// Start the quiz when the page loads
startQuiz();

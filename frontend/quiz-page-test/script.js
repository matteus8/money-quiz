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

  // Display results
  console.log('Setting display to block for resultContainer');
  const resultContainer = document.getElementById('result-container');
  const quizQuestionsContainer = document.getElementById('quiz-questions-container');
  const quizResults = document.getElementById('quiz-results');

  resultContainer.style.display = 'block';
  quizQuestionsContainer.style.display = 'none';

  quizResults.textContent = `Your score: ${score}/${questions.length}`;
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

function handlePod1Message(message) {
  const messageContainer = document.getElementById('message-container');
  const pod1Message = document.getElementById('pod1-message');

  messageContainer.style.display = 'block';
  pod1Message.textContent = message;
}

// Function to send a message to Pod 1
function sendPod2Message() {
  console.log('Sending message to Pod 1');
  // You can use the appropriate endpoint in Pod 1 to handle the message
  // For simplicity, we assume an endpoint '/message-from-pod1'
  const pod1Endpoint = 'http://password-form.default.svc.cluster.local:8080/message-from-pod1';
  fetch(pod1Endpoint, { method: 'POST' })
    .then(response => {
      if (response.ok) {
        console.log('Message sent successfully');
      } else {
        console.error('Failed to send message');
      }
    })
    .catch(error => console.error('Error:', error));
}

// Start the quiz when the page loads
startQuiz();

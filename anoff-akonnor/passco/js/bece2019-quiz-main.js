document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const quizScreen = document.getElementById('quizScreen');
    const resultScreen = document.getElementById('resultScreen');
    const startBtn = document.getElementById('startBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const restartBtn = document.getElementById('restartBtn');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const currentLevelDisplay = document.getElementById('currentLevel');
    const currentQuestionDisplay = document.getElementById('currentQuestion');
    const questionProgress = document.getElementById('questionProgress');
    const scoreText = document.getElementById('scoreText');
    const completedLevelDisplay = document.getElementById('completedLevel');
    const finalScoreDisplay = document.getElementById('finalScore');
    const resultMessage = document.getElementById('resultMessage');
    const levelComplete = document.getElementById('levelComplete');
    const quizComplete = document.getElementById('quizComplete');
    const nextLevelNum = document.getElementById('nextLevelNum');
    const overallProgress = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressText');

   // Quiz state
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = []; // Store user answers for each question
let answeredQuestions = []; // Track which questions have been answered

// Initialize the quiz
function initQuiz() {
    welcomeScreen.style.display = 'flex';
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    updateOverallProgress();
}

// Start the quiz
startBtn.addEventListener('click', function() {
    welcomeScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    loadLevel(currentLevel);
});

// Load a specific level
function loadLevel(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    answeredQuestions = [];
    
    // Filter questions for the current level
    questions = questionBank.filter(q => q.level === level);
    
    // Shuffle questions and pick 20
    shuffleArray(questions);
    questions = questions.slice(0, 20);
    
    // Initialize user answers array
    userAnswers = new Array(questions.length).fill(null);
    answeredQuestions = new Array(questions.length).fill(false);
    
    updateDisplay();
    showQuestion();
}

// Display the current question
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option.text;
        optionElement.dataset.index = index;
        
        // Highlight if this option was previously selected
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
            if (option.correct) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        }
        
        // Highlight correct answer if question was answered incorrectly
        if (answeredQuestions[currentQuestionIndex] && option.correct && userAnswers[currentQuestionIndex] !== index) {
            optionElement.classList.add('correct');
        }
        
        // Only allow selection if question hasn't been answered yet
        if (!answeredQuestions[currentQuestionIndex]) {
            optionElement.addEventListener('click', function() {
                selectOption(optionElement, index);
            });
        } else {
            optionElement.style.cursor = 'default';
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update button states
    updateButtonStates();
}

// Handle option selection
function selectOption(optionElement, index) {
    // Deselect all options
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select the clicked option
    optionElement.classList.add('selected');
    userAnswers[currentQuestionIndex] = index;
    
    // Check if answer is correct
    const question = questions[currentQuestionIndex];
    if (question.options[index].correct) {
        optionElement.classList.add('correct');
    } else {
        optionElement.classList.add('incorrect');
        // Find and highlight the correct answer
        question.options.forEach((opt, i) => {
            if (opt.correct) {
                document.querySelector(`.option[data-index="${i}"]`).classList.add('correct');
            }
        });
    }
    
    // Mark question as answered
    answeredQuestions[currentQuestionIndex] = true;
    
    // Disable all options after selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    // Update score if correct
    if (question.options[index].correct) {
        score++;
        scoreText.textContent = `Score: ${score}/20`;
    }
    
    updateButtonStates();
}

// Update navigation button states
function updateButtonStates() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === questions.length - 1;
}

// Move to the next question
nextBtn.addEventListener('click', function() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateDisplay();
        showQuestion();
    }
});

// Move to the previous question
prevBtn.addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateDisplay();
        showQuestion();
    }
});

// Show results after level completion
function showResults() {
    // Calculate final score based on all correct answers
    const finalScore = questions.reduce((total, question, index) => {
        if (userAnswers[index] !== null && question.options[userAnswers[index]].correct) {
            return total + 1;
        }
        return total;
    }, 0);
    
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    completedLevelDisplay.textContent = currentLevel;
    finalScoreDisplay.textContent = finalScore;
    
    if (finalScore >= 17) {
        resultMessage.textContent = `Congratulations! You passed Level ${currentLevel} and can advance to the next level.`;
        resultMessage.className = 'result-message success-message';
        
        if (currentLevel < 7) {
            levelComplete.style.display = 'block';
            quizComplete.style.display = 'none';
            nextLevelNum.textContent = currentLevel + 1;
        } else {
            levelComplete.style.display = 'none';
            quizComplete.style.display = 'block';
        }
    } else {
        resultMessage.textContent = `You scored ${finalScore}/20. You need at least 17 correct answers to pass this level. Try again!`;
        resultMessage.className = 'result-message error-message';
        nextLevelBtn.textContent = 'Try Again';
    }
    
    updateOverallProgress();
}

// Move to next level
nextLevelBtn.addEventListener('click', function() {
    // Calculate final score to determine if we can proceed
    const finalScore = questions.reduce((total, question, index) => {
        if (userAnswers[index] !== null && question.options[userAnswers[index]].correct) {
            return total + 1;
        }
        return total;
    }, 0);
    
    if (finalScore >= 17 && currentLevel < 7) {
        currentLevel++;
        loadLevel(currentLevel);
        quizScreen.style.display = 'block';
        resultScreen.style.display = 'none';
    } else {
        // Retry current level
        loadLevel(currentLevel);
        quizScreen.style.display = 'block';
        resultScreen.style.display = 'none';
    }
});

// Restart the quiz
restartBtn.addEventListener('click', function() {
    currentLevel = 1;
    initQuiz();
    loadLevel(currentLevel);
});

// Update display information
function updateDisplay() {
    currentLevelDisplay.textContent = currentLevel;
    currentQuestionDisplay.textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    questionProgress.style.width = `${progressPercent}%`;
    
    // Check if we've reached the end of the quiz
    if (currentQuestionIndex === questions.length - 1 && allQuestionsAnswered()) {
        // Small delay to allow user to see their last answer
        setTimeout(showResults, 500);
    }
}

// Check if all questions have been answered
function allQuestionsAnswered() {
    return answeredQuestions.every(answered => answered);
}

// Update overall progress
function updateOverallProgress() {
    const progressPercent = ((currentLevel - 1) / 7) * 100;
    overallProgress.style.width = `${progressPercent}%`;
    progressText.textContent = `${Math.round(progressPercent)}% Complete`;
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the quiz
initQuiz();
});
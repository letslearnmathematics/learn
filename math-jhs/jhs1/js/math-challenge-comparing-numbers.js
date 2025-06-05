// Game configuration
const config = {
    levels: 7,
    questionsPerLevel: 20,
    passingScore: 85, // 17 * 5 points per question
    timePerQuestion: 60, // seconds
    pointsPerQuestion: 5
};

// Sound effects
const audioFiles = {
    correct: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
    wrong: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
    levelComplete: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
    gameComplete: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'
};

// Game state
let gameState = {
    currentLevel: 1,
    currentQuestion: 0,
    score: 0,
    timer: null,
    timeLeft: 0,
    questions: [],
    selectedAnswer: null,
    correctAnswer: null,
    videoSolutionUrl: null,
    audioElements: {},
    mathJaxReady: false
};

// Create game HTML structure
function createGameStructure() {
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.innerHTML = `
        <div id="start-screen" class="game-screen">
            <div class="game-card">
                <h1>Math Challenge</h1>
                <p>Test your skills across 7 levels of increasing difficulty!</p>
                <p>Each level has 20 questions. You need 17 correct answers to advance.</p>
                <div class="loading-spinner hidden" id="loading-spinner"></div>
                <button id="start-btn" class="pulse-animation">
                    <i class="fas fa-play"></i> Begin Challenge
                </button>
            </div>
        </div>
        
        <div id="game-screen" class="game-screen hidden">
            <div class="game-card">
                <div class="game-header">
                    <span id="level-display"><i class="fas fa-layer-group"></i> Level: 1</span>
                    <span id="score-display"><i class="fas fa-star"></i> Score: 0/100</span>
                    <span id="timer-display"><i class="fas fa-clock"></i> Time: 1:00</span>
                </div>
                
                <div id="question-container">
                    <p id="question-text">Loading question...</p>
                    <div id="options-container" class="options-grid"></div>
                </div>
                
                <div id="progress-container">
                    <div id="progress-bar">
                        <div id="progress-fill"></div>
                    </div>
                    <span id="progress-text">Question 1 of 20</span>
                </div>
            </div>
        </div>
        
        <div id="result-screen" class="game-screen hidden">
            <div class="game-card">
                <h2 id="result-title">Level Complete!</h2>
                <p id="result-message">You scored 85/100 and advanced to level 2!</p>
                <div id="stars-container" class="stars-container"></div>
                <div id="solution-video" class="hidden video-container"></div>
                <div class="button-group">
                    <button id="next-level-btn" class="hidden pulse-animation">
                        <i class="fas fa-arrow-right"></i> Continue to Level 2
                    </button>
                    <button id="retry-btn">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            </div>
        </div>
        
        <div id="final-screen" class="game-screen hidden">
            <div class="game-card">
                <h1><i class="fas fa-trophy"></i> Congratulations! 🎉</h1>
                <p>You've completed all 7 levels of this math challenge!</p>
                <p>Your final score: <span id="final-score">350</span>/700</p>
                <div id="final-stars" class="stars-container"></div>
                <p>We hope you enjoyed this learning experience.</p>
                <button id="other-lessons-btn" class="pulse-animation">
                    <i class="fas fa-book-open"></i> Explore Other Lessons
                </button>
            </div>
        </div>
    `;
    
    // Create audio elements
    Object.keys(audioFiles).forEach(key => {
        gameState.audioElements[key] = new Audio(audioFiles[key]);
    });
}

// Initialize MathJax processing
function processMathJax() {
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        MathJax.typesetPromise().then(() => {
            console.log('MathJax processed successfully');
        }).catch(err => {
            console.log('MathJax typeset error:', err);
        });
    } else {
        console.log('MathJax not loaded yet');
    }
}

// Show screens
function showStartScreen() {
    hideAllScreens();
    document.getElementById('start-screen').classList.remove('hidden');
}

function showGameScreen() {
    hideAllScreens();
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Load questions for current level
    if (!allQuestions[gameState.currentLevel]) {
        console.error(`No questions found for level ${gameState.currentLevel}`);
        return;
    }
    
    // Shuffle questions for this level
    gameState.questions = shuffleArray([...allQuestions[gameState.currentLevel]]).slice(0, config.questionsPerLevel);
    gameState.currentQuestion = 0;
    gameState.score = 0;
    
    updateGameDisplay();
    loadQuestion();
}

function showResultScreen(passed) {
    hideAllScreens();
    const resultScreen = document.getElementById('result-screen');
    resultScreen.classList.remove('hidden');
    
    // Calculate star rating (1-5 stars based on percentage)
    const percentage = (gameState.score / (config.questionsPerLevel * config.pointsPerQuestion)) * 100;
    const stars = Math.ceil(percentage / 20);
    
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = `star fas fa-star ${i < stars ? 'filled' : ''}`;
        starsContainer.appendChild(star);
    }
    
    if (passed) {
        playSound('levelComplete');
        document.getElementById('result-title').textContent = `Level ${gameState.currentLevel} Complete!`;
        document.getElementById('result-message').textContent = `You scored ${gameState.score}/${config.questionsPerLevel * config.pointsPerQuestion}`;
        
        if (gameState.currentLevel < config.levels) {
            document.getElementById('result-message').textContent += ` and advanced to level ${gameState.currentLevel + 1}!`;
            document.getElementById('next-level-btn').textContent = `Continue to Level ${gameState.currentLevel + 1}`;
            document.getElementById('next-level-btn').classList.remove('hidden');
        } else {
            document.getElementById('result-message').textContent += ` and completed all levels!`;
            document.getElementById('next-level-btn').classList.add('hidden');
        }
    } else {
        document.getElementById('result-title').textContent = `Level ${gameState.currentLevel} Failed`;
        document.getElementById('result-message').textContent = `You scored ${gameState.score}/${config.questionsPerLevel * config.pointsPerQuestion}. You need at least ${config.passingScore} points to pass.`;
        document.getElementById('next-level-btn').classList.add('hidden');
    }
    
    // Show video solution if available
    if (gameState.videoSolutionUrl) {
        const videoContainer = document.getElementById('solution-video');
        videoContainer.classList.remove('hidden');
        videoContainer.innerHTML = `
            <p style="margin-bottom: 1rem; font-weight: 500;">Here's a solution to the last question:</p>
            <iframe src="${gameState.videoSolutionUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
        processMathJax();
    }
}

function showFinalScreen() {
    hideAllScreens();
    playSound('gameComplete');
    triggerConfetti();
    
    const finalScreen = document.getElementById('final-screen');
    finalScreen.classList.remove('hidden');
    document.getElementById('final-score').textContent = gameState.score;
    
    // Calculate star rating for final screen
    const percentage = (gameState.score / (config.levels * config.questionsPerLevel * config.pointsPerQuestion)) * 100;
    const stars = Math.ceil(percentage / 20);
    
    const starsContainer = document.getElementById('final-stars');
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = `star fas fa-star ${i < stars ? 'filled' : ''}`;
        starsContainer.appendChild(star);
    }
}

function hideAllScreens() {
    const screens = document.querySelectorAll('#game-container .game-screen');
    screens.forEach(screen => screen.classList.add('hidden'));
}

// Game functions
function loadQuestion() {
    if (gameState.currentQuestion >= config.questionsPerLevel) {
        endLevel();
        return;
    }
    
    const question = gameState.questions[gameState.currentQuestion];
    if (!question) {
        console.error(`No question found at index ${gameState.currentQuestion}`);
        return;
    }
    
    const questionTextElement = document.getElementById('question-text');
    questionTextElement.innerHTML = question.text;
    
    // Clear previous options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Add new options
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = answer;
        button.dataset.index = index;
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });
    
    // Update progress
    updateProgress();
    
    // Start timer
    startTimer();
    
    // Process MathJax content
    setTimeout(processMathJax, 100);
}

function startTimer() {
    clearInterval(gameState.timer);
    
    // Decrease time per question as levels increase
    const timeForLevel = Math.max(30, config.timePerQuestion - (gameState.currentLevel * 5));
    gameState.timeLeft = timeForLevel;
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('timer-display').innerHTML = `<i class="fas fa-clock"></i> Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Change color when time is running low
    if (gameState.timeLeft <= 10) {
        document.getElementById('timer-display').style.color = '#ff5252';
    } else {
        document.getElementById('timer-display').style.color = '#555';
    }
}

function timeUp() {
    // Mark as wrong answer
    const question = gameState.questions[gameState.currentQuestion];
    gameState.videoSolutionUrl = question.videoSolution;
    
    // Highlight correct answer
    const options = document.querySelectorAll('.option-btn');
    options[question.correctIndex].classList.add('correct');
    
    // Play wrong answer sound
    playSound('wrong');
    
    // Move to next question after delay
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 1500);
}

function selectAnswer(e) {
    clearInterval(gameState.timer);
    
    const selectedIndex = parseInt(e.target.dataset.index);
    const question = gameState.questions[gameState.currentQuestion];
    
    // Store for result screen
    gameState.selectedAnswer = selectedIndex;
    gameState.correctAnswer = question.correctIndex;
    gameState.videoSolutionUrl = question.videoSolution;
    
    // Highlight selected answer
    const options = document.querySelectorAll('.option-btn');
    options.forEach(opt => opt.disabled = true);
    
    // Calculate points - bonus for quick answers
    const timeBonus = Math.floor(gameState.timeLeft / 10);
    const pointsEarned = config.pointsPerQuestion + timeBonus;
    
    if (selectedIndex === question.correctIndex) {
        e.target.classList.add('correct');
        gameState.score += pointsEarned;
        updateScoreDisplay();
        playSound('correct');
    } else {
        e.target.classList.add('wrong');
        options[question.correctIndex].classList.add('correct');
        playSound('wrong');
    }
    
    // Process MathJax for highlighted answers
    setTimeout(processMathJax, 100);
    
    // Move to next question after delay
    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 1500);
}

function updateGameDisplay() {
    document.getElementById('level-display').innerHTML = `<i class="fas fa-layer-group"></i> Level: ${gameState.currentLevel}`;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById('score-display').innerHTML = `<i class="fas fa-star"></i> Score: ${gameState.score}/${config.questionsPerLevel * config.pointsPerQuestion}`;
}

function updateProgress() {
    const progress = (gameState.currentQuestion / config.questionsPerLevel) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Question ${gameState.currentQuestion + 1} of ${config.questionsPerLevel}`;
}

function endLevel() {
    const passed = gameState.score >= config.passingScore;
    
    if (passed && gameState.currentLevel === config.levels) {
        showFinalScreen();
    } else {
        showResultScreen(passed);
    }
}

// Utility functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function playSound(type) {
    if (gameState.audioElements[type]) {
        gameState.audioElements[type].currentTime = 0;
        gameState.audioElements[type].play().catch(e => console.log("Audio play failed:", e));
    }
}

function triggerConfetti() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
    script.onload = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6c5ce7', '#a29bfe', '#4CAF50', '#FF5252']
        });
    };
    document.head.appendChild(script);
}

function resetGameState() {
    gameState = {
        currentLevel: 1,
        currentQuestion: 0,
        score: 0,
        timer: null,
        timeLeft: 0,
        questions: [],
        selectedAnswer: null,
        correctAnswer: null,
        videoSolutionUrl: null,
        audioElements: gameState.audioElements,
        mathJaxReady: window.mathJaxReady || false
    };
}

// Initialize the game
function initGame() {
    window.gameInitialized = true;
    gameState.mathJaxReady = window.mathJaxReady || false;
    
    createGameStructure();
    resetGameState();
    showStartScreen();
    
    // Set up event listeners
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('start-btn').classList.add('hidden');
        document.getElementById('loading-spinner').classList.remove('hidden');
        
        // Simulate loading
        setTimeout(() => {
            showGameScreen();
        }, 1000);
    });
    
    document.getElementById('next-level-btn').addEventListener('click', () => {
        if (gameState.currentLevel < config.levels) {
            gameState.currentLevel++;
            showGameScreen();
        } else {
            showFinalScreen();
        }
    });
    
    document.getElementById('retry-btn').addEventListener('click', () => {
        showGameScreen();
    });
    
    document.getElementById('other-lessons-btn').addEventListener('click', () => {
        alert('Redirecting to other lessons...');
    });
}

// Make sure allQuestions is defined before the game starts
const allQuestions = {
    1: [
    {
        text: "Which number is greater: 4,800,000,000 or 4,080,000,000?",
        answers: ["4,800,000,000", "4,080,000,000", "They are equal", "Cannot tell"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 7,230,000,000 ___ 7,230,000,100",
        answers: ["<", ">", "=", "≥"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is the smallest?",
        answers: ["9,000,000,000", "900,000,000", "90,000,000", "9,000,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which of the following is true?",
        answers: ["3,005,000,000 < 3,050,000,000", "3,005,000,000 > 3,050,000,000", "They are equal", "Cannot compare"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which symbol correctly completes this statement: 1,200,000,000 ___ 1,020,000,000?",
        answers: [">", "<", "=", "≤"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange the numbers from smallest to largest: 5,000,000,000; 500,000,000; 50,000,000",
        answers: ["50,000,000 < 500,000,000 < 5,000,000,000", "5,000,000,000 < 500,000,000 < 50,000,000", "50,000,000 > 500,000,000 > 5,000,000,000", "500,000,000 < 50,000,000 < 5,000,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number has 10 digits?",
        answers: ["1,000,000,000", "100,000,000", "10,000,000", "1,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 3,333,333,333 ___ 3,333,333,331",
        answers: [">", "<", "=", "≤"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is just less than 2,000,000,000?",
        answers: ["1,999,999,999", "2,000,000,001", "2,000,000,000", "2,100,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these is the correct ordering from greatest to least?",
        answers: ["8,000,000,000; 7,000,000,000; 6,000,000,000", "6,000,000,000; 7,000,000,000; 8,000,000,000", "7,000,000,000; 6,000,000,000; 8,000,000,000", "They are equal"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "How many digits are in the number 25,000,000,000?",
        answers: ["11", "10", "9", "8"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare using the correct symbol: 15,000,000,000 ___ 15,000,000,000",
        answers: ["=", ">", "<", "≥"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the hundred million place in 7,864,321,000?",
        answers: ["6", "8", "4", "3"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is greater than 2,000,000,000?",
        answers: ["2,000,000,001", "1,999,999,999", "2,000,000,000", "1,000,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these comparisons is incorrect?",
        answers: ["6,000,000,000 > 5,999,999,999", "9,999,999,999 < 10,000,000,000", "8,888,888,888 = 8,888,888,889", "1,000,000,000 < 1,100,000,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 12,345,678,000; 21,345,678,000; 2,345,678,000",
        answers: ["21B; 12B; 2B", "2B; 12B; 21B", "12B; 2B; 21B", "They are all equal"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is equal to 1 billion?",
        answers: ["1,000,000,000", "100,000,000", "10,000,000", "1,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If A = 8,800,000,000 and B = 8,880,000,000, then:",
        answers: ["A < B", "A > B", "A = B", "A ≤ B"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the missing number: 1,000,000,000 < ___ < 3,000,000,000",
        answers: ["2,000,000,000", "4,000,000,000", "3,000,000,000", "500,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which place value is directly after the billion place?",
        answers: ["Ten billion", "Hundred million", "Ten million", "Trillion"],
        correctIndex: 0,
        videoSolution: ""
    }
],
    2: [
    {
        text: "Which number is greater: $9{,}876{,}543{,}210$ or $9{,}876{,}543{,}120$?",
        answers: ["$9{,}876{,}543{,}210$", "$9{,}876{,}543{,}120$", "They are equal", "Cannot determine"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: $2{,}145{,}600{,}000 \\;\\_\\_\\; 2{,}145{,}060{,}000$",
        answers: ["$>$", "$<$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: $4{,}000{,}000{,}000$, $3{,}900{,}000{,}000$, $4{,}100{,}000{,}000$",
        answers: [
            "$3{,}900{,}000{,}000 < 4{,}000{,}000{,}000 < 4{,}100{,}000{,}000$",
            "$4{,}000{,}000{,}000 < 4{,}100{,}000{,}000 < 3{,}900{,}000{,}000$",
            "$4{,}100{,}000{,}000 < 4{,}000{,}000{,}000 < 3{,}900{,}000{,}000$",
            "$4{,}000{,}000{,}000 < 3{,}900{,}000{,}000 < 4{,}100{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following is the correct comparison: $7{,}777{,}777{,}777$ ___ $7{,}777{,}777{,}778$?",
        answers: ["$<$", "$>$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number has more digits?",
        answers: ["$98{,}000{,}000{,}000$", "$8{,}000{,}000{,}000$", "$800{,}000$", "$80{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Select the smallest number:",
        answers: ["$12{,}345{,}678{,}901$", "$1{,}234{,}567{,}890$", "$123{,}456{,}789$", "$12{,}345{,}678$"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Fill in the blank: $10{,}500{,}000{,}000 \\;\\_\\_\\; 10{,}499{,}999{,}999$",
        answers: ["$>$", "$<$", "$=$", "$\\leq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "How many digits are in the number $7{,}000{,}000{,}000$?",
        answers: ["10", "9", "8", "7"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following numbers is not equal to $1{,}000{,}000{,}000$?",
        answers: ["$10^9$", "$1000 \\times 1000 \\times 1000$", "$1{,}000 \\times 1{,}000{,}000$", "$100 \\times 100{,}000{,}000$"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which of the following is true?",
        answers: [
            "$1{,}000{,}000{,}000 = 10^9$",
            "$1{,}000{,}000{,}000 = 10^6$",
            "$1{,}000{,}000 = 10^9$",
            "$1{,}000 = 10^6$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these numbers is greatest?",
        answers: ["$9{,}999{,}999{,}999$", "$1{,}000{,}000{,}000$", "$999{,}999{,}999$", "$999{,}000{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is exactly between $4{,}000{,}000{,}000$ and $6{,}000{,}000{,}000$?",
        answers: ["$5{,}000{,}000{,}000$", "$4{,}500{,}000{,}000$", "$6{,}500{,}000{,}000$", "$5{,}500{,}000{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $X = 2{,}345{,}600{,}000$ and $Y = 2{,}346{,}000{,}000$, then:",
        answers: ["$X < Y$", "$X > Y$", "$X = Y$", "$X \\geq Y$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Choose the correct symbol: $11{,}111{,}111{,}111 \\;\\_\\_\\; 11{,}111{,}111{,}110$",
        answers: ["$>$", "$<$", "$=$", "$\\leq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange from greatest to least: $3{,}000{,}000{,}000$, $30{,}000{,}000{,}000$, $300{,}000{,}000$",
        answers: [
            "$30{,}000{,}000{,}000 > 3{,}000{,}000{,}000 > 300{,}000{,}000$",
            "$3{,}000{,}000{,}000 > 300{,}000{,}000 > 30{,}000{,}000{,}000$",
            "$300{,}000{,}000 > 3{,}000{,}000{,}000 > 30{,}000{,}000{,}000$",
            "They are equal"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these comparisons is false?",
        answers: [
            "$6{,}000{,}000{,}000 < 7{,}000{,}000{,}000$",
            "$10{,}000{,}000{,}000 > 1{,}000{,}000{,}000$",
            "$5{,}000{,}000{,}000 = 5{,}000{,}000{,}000$",
            "$4{,}000{,}000{,}001 > 4{,}000{,}000{,}010$"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which place value is directly before the billion place?",
        answers: ["Hundred million", "Trillion", "Ten billion", "Million"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of the digit 7 in $7{,}000{,}000{,}000$?",
        answers: ["$7{,}000{,}000{,}000$", "$700{,}000{,}000$", "$70{,}000{,}000$", "$7{,}000{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What number has ten digits and begins with 9?",
        answers: ["$9{,}000{,}000{,}000$", "$900{,}000{,}000$", "$90{,}000{,}000$", "$9{,}000{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is closest to $1{,}000{,}000{,}000$?",
        answers: ["$999{,}999{,}999$", "$1{,}100{,}000{,}000$", "$1{,}500{,}000{,}000$", "$2{,}000{,}000{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    }
],
    3: [
    {
        text: "What is the correct order from smallest to largest: $12{,}000{,}000{,}000$, $1{,}200{,}000{,}000$, $120{,}000{,}000$?",
        answers: [
            "$120{,}000{,}000 < 1{,}200{,}000{,}000 < 12{,}000{,}000{,}000$",
            "$12{,}000{,}000{,}000 < 1{,}200{,}000{,}000 < 120{,}000{,}000$",
            "$1{,}200{,}000{,}000 < 120{,}000{,}000 < 12{,}000{,}000{,}000$",
            "They are equal"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which two numbers have the same number of digits?",
        answers: [
            "$8{,}000{,}000{,}000$ and $9{,}999{,}999{,}999$",
            "$900{,}000{,}000$ and $1{,}000{,}000{,}000$",
            "$10{,}000{,}000$ and $1{,}000{,}000$",
            "$100{,}000{,}000{,}000$ and $1{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following correctly completes this statement: $6{,}543{,}210{,}999 \\;\\_\\_\\; 6{,}543{,}210{,}998$",
        answers: ["$>$", "$<$", "$=$", "$\\neq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Choose the incorrect comparison.",
        answers: [
            "$3{,}000{,}000{,}000 > 2{,}999{,}999{,}999$",
            "$1{,}000{,}000{,}001 > 1{,}000{,}000{,}000$",
            "$4{,}000{,}000{,}000 < 3{,}999{,}999{,}999$",
            "$7{,}000{,}000{,}000 = 7{,}000{,}000{,}000$"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which digit has the greatest place value in $5{,}438{,}210{,}000$?",
        answers: ["5", "4", "8", "2"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of the 3rd digit from the left in $2{,}718{,}000{,}000$?",
        answers: ["7", "1", "8", "2"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these statements is true?",
        answers: [
            "$9{,}000{,}000{,}000 = 90 \\times 100{,}000{,}000$",
            "$1{,}000{,}000{,}000 = 10^8$",
            "$5{,}000{,}000{,}000 < 4{,}999{,}999{,}999$",
            "$3{,}000{,}000{,}000 = 3{,}000 \\times 1{,}000{,}000$"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which number comes next in the pattern: $2{,}000{,}000{,}000$, $2{,}500{,}000{,}000$, $3{,}000{,}000{,}000$, ...?",
        answers: [
            "$3{,}500{,}000{,}000$",
            "$3{,}100{,}000{,}000$",
            "$3{,}050{,}000{,}000$",
            "$2{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which pair of numbers has a difference of $1{,}000{,}000{,}000$?",
        answers: [
            "$2{,}000{,}000{,}000$ and $1{,}000{,}000{,}000$",
            "$3{,}000{,}000{,}000$ and $3{,}000{,}000{,}000$",
            "$5{,}000{,}000{,}000$ and $4{,}500{,}000{,}000$",
            "$4{,}000{,}000{,}000$ and $3{,}500{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is represented by: $900 \\times 1{,}000{,}000$?",
        answers: [
            "$900{,}000{,}000$",
            "$9{,}000{,}000{,}000$",
            "$90{,}000{,}000{,}000$",
            "$900{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of the underlined digit in $1{,}8\\underline{5}{,}000{,}000$?",
        answers: ["$80{,}000{,}000$", "$5{,}000{,}000$", "$800{,}000{,}000$", "$50{,}000{,}000$"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which statement is true?",
        answers: [
            "$10{,}000{,}000{,}000 > 9{,}999{,}999{,}999$",
            "$2{,}000{,}000{,}000 = 2{,}000{,}000{,}100$",
            "$7{,}000{,}000{,}000 < 6{,}999{,}999{,}999$",
            "$3{,}000{,}000{,}000 > 4{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number with 10 digits, starts with 4 and ends in 0s.",
        answers: [
            "$4{,}000{,}000{,}000$",
            "$400{,}000{,}000$",
            "$40{,}000{,}000$",
            "$400{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the hundred million place of $9{,}385{,}000{,}000$?",
        answers: ["3", "8", "9", "3"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which number is less than $10{,}000{,}000{,}000$ but more than $9{,}999{,}999{,}998$?",
        answers: [
            "$9{,}999{,}999{,}999$",
            "$10{,}000{,}000{,}000$",
            "$9{,}999{,}999{,}998$",
            "$10{,}000{,}000{,}001$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the tenth digit in the number $8{,}756{,}430{,}001$?",
        answers: ["8", "7", "6", "0"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these represents one billion?",
        answers: [
            "$1{,}000{,}000{,}000$",
            "$10^9$",
            "Both A and B",
            "None of the above"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which number is the odd one out?",
        answers: [
            "$2{,}000{,}000{,}000$",
            "$2{,}500{,}000{,}000$",
            "$3{,}000{,}000{,}000$",
            "$2{,}900{,}000{,}100$"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "What is the next number after $999{,}999{,}999$?",
        answers: [
            "$1{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}001$",
            "$999{,}999{,}998$",
            "$100{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Complete the sentence: $5{,}000{,}000{,}000 \\;\\_\\_\\; 5{,}000{,}000{,}000$",
        answers: ["$=$", "$>$", "$<$", "$\\neq$"],
        correctIndex: 0,
        videoSolution: ""
    }
], 
    4: [
    {
        text: "Which number is greater: $15{,}000{,}000{,}000$ or $14{,}999{,}999{,}999$?",
        answers: ["$15{,}000{,}000{,}000$", "$14{,}999{,}999{,}999$", "They are equal", "Cannot compare"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What comes after $3{,}499{,}999{,}999$?",
        answers: ["$3{,}500{,}000{,}000$", "$3{,}499{,}999{,}998$", "$3{,}499{,}999{,}997$", "$3{,}599{,}999{,}999$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: $22{,}000{,}000{,}000$, $12{,}000{,}000{,}000$, $2{,}000{,}000{,}000$",
        answers: [
            "$22B > 12B > 2B$",
            "$2B > 12B > 22B$",
            "$12B > 22B > 2B$",
            "$2B > 22B > 12B$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following is closest to $4{,}500{,}000{,}000$?",
        answers: [
            "$4{,}499{,}999{,}999$",
            "$4{,}400{,}000{,}000$",
            "$4{,}000{,}000{,}000$",
            "$5{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Select the correct comparison: $6{,}789{,}123{,}456 \\;\\_\\_\\; 6{,}789{,}123{,}654$",
        answers: ["$<$", "$>$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the missing number: $9{,}999{,}999{,}998 < \\_\\_\\_ < 10{,}000{,}000{,}000$",
        answers: [
            "$9{,}999{,}999{,}999$",
            "$10{,}000{,}000{,}001$",
            "$10{,}000{,}000{,}000$",
            "$9{,}999{,}999{,}997$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following is the same as $2 \\times 1{,}000{,}000{,}000$?",
        answers: [
            "$2{,}000{,}000{,}000$",
            "$200{,}000{,}000$",
            "$20{,}000{,}000{,}000$",
            "$200{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which has more digits?",
        answers: [
            "$10{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}000$",
            "$100{,}000{,}000$",
            "$1{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following represents the number nine billion, nine hundred ninety-nine million, nine hundred ninety-nine thousand, nine hundred ninety-nine?",
        answers: [
            "$9{,}999{,}999{,}999$",
            "$999{,}999{,}999$",
            "$99{,}999{,}999$",
            "$9{,}999{,}999{,}900$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the result of $10{,}000{,}000{,}000 - 1$?",
        answers: [
            "$9{,}999{,}999{,}999$",
            "$10{,}000{,}000{,}001$",
            "$9{,}999{,}999{,}998$",
            "$1{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the billion place in $3{,}248{,}000{,}000$?",
        answers: ["3", "2", "4", "8"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which is the smallest number?",
        answers: [
            "$1{,}000{,}000{,}001$",
            "$1{,}000{,}000{,}010$",
            "$1{,}000{,}000{,}100$",
            "$1{,}000{,}001{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the value of $500 \\times 1{,}000{,}000$",
        answers: [
            "$500{,}000{,}000$",
            "$5{,}000{,}000{,}000$",
            "$50{,}000{,}000{,}000$",
            "$5{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these is not equal to $1{,}000{,}000{,}000$?",
        answers: [
            "$10^9$",
            "$100 \\times 10{,}000{,}000$",
            "$1{,}000 \\times 1{,}000{,}000$",
            "$10 \\times 100{,}000{,}000$"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the correct comparison: $3{,}000{,}000{,}000 \\;\\_\\_\\; 3{,}000{,}000{,}000$?",
        answers: ["$=$", "$>$", "$<$", "$\\neq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which value comes before $2{,}000{,}000{,}000$?",
        answers: [
            "$1{,}999{,}999{,}999$",
            "$2{,}000{,}000{,}001$",
            "$2{,}100{,}000{,}000$",
            "$2{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Choose the incorrect statement.",
        answers: [
            "$4{,}000{,}000{,}000 > 3{,}000{,}000{,}000$",
            "$10{,}000{,}000{,}000 < 9{,}000{,}000{,}000$",
            "$2{,}000{,}000{,}000 = 2 \\times 1{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}000 = 10^9$"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which number is greater than all the others?",
        answers: [
            "$99{,}999{,}999{,}999$",
            "$9{,}999{,}999{,}999$",
            "$999{,}999{,}999$",
            "$1{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $A = 6{,}000{,}000{,}000$ and $B = 5{,}999{,}999{,}999$, then:",
        answers: ["$A > B$", "$A < B$", "$A = B$", "$A \\leq B$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 4th digit from the left in $9{,}482{,}700{,}000$?",
        answers: ["2", "8", "4", "7"],
        correctIndex: 1,
        videoSolution: ""
    }
],
    5: [
    {
        text: "Compare: $13{,}000{,}000{,}000 \\;\\_\\_\\; 12{,}999{,}999{,}999$",
        answers: ["$>$", "$<$", "$=$", "$\\leq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following has the greatest value?",
        answers: [
            "$1{,}234{,}567{,}890$",
            "$9{,}876{,}543{,}210$",
            "$8{,}765{,}432{,}100$",
            "$2{,}345{,}678{,}901$"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Arrange from least to greatest: $1{,}500{,}000{,}000$, $1{,}050{,}000{,}000$, $1{,}005{,}000{,}000$",
        answers: [
            "$1{,}005{,}000{,}000 < 1{,}050{,}000{,}000 < 1{,}500{,}000{,}000$",
            "$1{,}500{,}000{,}000 < 1{,}005{,}000{,}000 < 1{,}050{,}000{,}000$",
            "$1{,}050{,}000{,}000 < 1{,}005{,}000{,}000 < 1{,}500{,}000{,}000$",
            "$They\\;are\\;equal$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which is closest to $6{,}000{,}000{,}000$?",
        answers: [
            "$6{,}000{,}000{,}001$",
            "$6{,}100{,}000{,}000$",
            "$5{,}999{,}999{,}999$",
            "$5{,}900{,}000{,}000$"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "How many digits are in $78{,}000{,}000{,}000$?",
        answers: ["11", "10", "12", "9"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these numbers is between $3{,}000{,}000{,}000$ and $4{,}000{,}000{,}000$?",
        answers: [
            "$3{,}500{,}000{,}000$",
            "$2{,}999{,}999{,}999$",
            "$4{,}100{,}000{,}000$",
            "$2{,}500{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the ten billion place in $13{,}842{,}000{,}000$?",
        answers: ["1", "3", "8", "4"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which expression gives $9{,}000{,}000{,}000$?",
        answers: [
            "$9 \\times 1{,}000{,}000{,}000$",
            "$90 \\times 1{,}000{,}000$",
            "$900 \\times 1{,}000{,}000$",
            "$900{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $A = 7{,}000{,}000{,}001$ and $B = 7{,}000{,}000{,}000$, then:",
        answers: ["$A > B$", "$A < B$", "$A = B$", "$A \\leq B$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Choose the odd one out:",
        answers: [
            "$10{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}000$",
            "$100{,}000{,}000$",
            "$1{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which place value is 3 digits to the left of the million place?",
        answers: [
            "Billion",
            "Hundred million",
            "Ten billion",
            "Thousand"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare the following: $2{,}345{,}678{,}900 \\;\\_\\_\\; 2{,}345{,}678{,}899$",
        answers: ["$>$", "$<$", "$=$", "$\\neq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit has the highest place value in $9{,}000{,}000{,}000$?",
        answers: ["9", "0", "1", "Can't determine"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following is a true statement?",
        answers: [
            "$11{,}000{,}000{,}000 < 10{,}000{,}000{,}000$",
            "$10^9 = 1{,}000{,}000{,}000$",
            "$1{,}000{,}000 = 10^9$",
            "$2{,}000{,}000{,}000 = 2 \\times 10^8$"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Fill in the blank: $5{,}000{,}000{,}000 \\;\\_\\_\\; 4{,}999{,}999{,}999$",
        answers: ["$>$", "$<$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of the digit 6 in $6{,}000{,}000{,}000$?",
        answers: ["$6{,}000{,}000{,}000$", "$600{,}000{,}000$", "$60{,}000{,}000$", "$6{,}000{,}000$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these comparisons is false?",
        answers: [
            "$10{,}000{,}000{,}000 > 9{,}999{,}999{,}999$",
            "$2{,}000{,}000{,}000 = 2 \\times 1{,}000{,}000{,}000$",
            "$5{,}000{,}000{,}000 < 4{,}999{,}999{,}999$",
            "$3{,}000{,}000{,}000 > 2{,}500{,}000{,}000$"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which number has 11 digits?",
        answers: [
            "$12{,}000{,}000{,}000$",
            "$1{,}200{,}000{,}000$",
            "$120{,}000{,}000$",
            "$12{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which is the correct expression for ten billion?",
        answers: [
            "$10{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}000$",
            "$100{,}000{,}000$",
            "$10^8$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What number is 1 less than $8{,}000{,}000{,}000$?",
        answers: [
            "$7{,}999{,}999{,}999$",
            "$8{,}000{,}000{,}001$",
            "$7{,}999{,}000{,}000$",
            "$8{,}100{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    }
], 
    6: [
    {
        text: "Compare: $15{,}600{,}000{,}000 \\;\\_\\_\\; 15{,}060{,}000{,}000$",
        answers: ["$>$", "$<$", "$=$", "$\\leq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is smaller?",
        answers: [
            "$3{,}000{,}000{,}000$",
            "$2{,}999{,}999{,}999$",
            "$3{,}100{,}000{,}000$",
            "$3{,}001{,}000{,}000$"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: $5{,}500{,}000{,}000$, $5{,}050{,}000{,}000$, $5{,}005{,}000{,}000$",
        answers: [
            "$5{,}005{,}000{,}000 < 5{,}050{,}000{,}000 < 5{,}500{,}000{,}000$",
            "$5{,}500{,}000{,}000 < 5{,}050{,}000{,}000 < 5{,}005{,}000{,}000$",
            "$5{,}050{,}000{,}000 < 5{,}005{,}000{,}000 < 5{,}500{,}000{,}000$",
            "$5{,}500{,}000{,}000 < 5{,}005{,}000{,}000 < 5{,}050{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of the underlined digit in $7{,}3\\underline{0}0{,}000{,}000$?",
        answers: ["$300{,}000{,}000$", "$30{,}000{,}000$", "$3{,}000{,}000$", "$3{,}000{,}000{,}000$"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the number closest to $8{,}000{,}000{,}000$ without going over.",
        answers: [
            "$7{,}999{,}999{,}999$",
            "$8{,}000{,}000{,}001$",
            "$8{,}100{,}000{,}000$",
            "$7{,}800{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which has a value of $1{,}000{,}000{,}000$?",
        answers: [
            "$10^9$",
            "$1000 \\times 1{,}000{,}000$",
            "$1{,}000{,}000 \\times 1{,}000$",
            "All of the above"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which digit is in the hundred million place of $5{,}986{,}000{,}000$?",
        answers: ["9", "8", "6", "5"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which of these comparisons is incorrect?",
        answers: [
            "$10{,}000{,}000{,}000 > 9{,}999{,}999{,}999$",
            "$4{,}000{,}000{,}000 = 4 \\times 10^9$",
            "$3{,}000{,}000{,}000 < 2{,}999{,}999{,}999$",
            "$2{,}000{,}000{,}000 = 2{,}000{,}000{,}000$"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Complete the sequence: $1{,}000{,}000{,}000$, $1{,}100{,}000{,}000$, $1{,}200{,}000{,}000$, \\_\\_\\_",
        answers: [
            "$1{,}300{,}000{,}000$",
            "$1{,}250{,}000{,}000$",
            "$1{,}150{,}000{,}000$",
            "$1{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following is not equal to $10{,}000{,}000{,}000$?",
        answers: [
            "$10^10$",
            "$100 \\times 100{,}000{,}000$",
            "$10 \\times 1{,}000{,}000{,}000$",
            "$10{,}000 \\times 1{,}000{,}000$"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which place value is immediately after billion?",
        answers: ["Ten billion", "Hundred million", "Million", "Trillion"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "How many zeros are in $100{,}000{,}000{,}000$?",
        answers: ["11", "10", "9", "12"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is larger?",
        answers: [
            "$18{,}000{,}000{,}000$",
            "$1{,}800{,}000{,}000$",
            "$180{,}000{,}000$",
            "$18{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What number has 10 digits and begins with 2?",
        answers: [
            "$2{,}000{,}000{,}000$",
            "$200{,}000{,}000$",
            "$20{,}000{,}000$",
            "$2{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1 more than $6{,}999{,}999{,}999$",
        answers: [
            "$7{,}000{,}000{,}000$",
            "$6{,}999{,}999{,}998$",
            "$6{,}000{,}000{,}000$",
            "$7{,}000{,}000{,}001$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $X = 10{,}000{,}000{,}000$ and $Y = 9{,}999{,}999{,}999$, then:",
        answers: ["$X > Y$", "$X = Y$", "$X < Y$", "$X \\leq Y$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which expression equals $8{,}000{,}000{,}000$?",
        answers: [
            "$8 \\times 1{,}000{,}000{,}000$",
            "$800 \\times 1{,}000{,}000$",
            "$80 \\times 10{,}000{,}000$",
            "All of the above"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the number with 11 digits and starting with 6",
        answers: [
            "$6{,}000{,}000{,}000$",
            "$60{,}000{,}000$",
            "$6{,}000{,}000$",
            "$600{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Complete the inequality: $4{,}999{,}999{,}999 \\;\\_\\_\\; 5{,}000{,}000{,}000$",
        answers: ["$<$", "$>$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number has 12 digits?",
        answers: [
            "$100{,}000{,}000{,}000$",
            "$10{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}000$",
            "$1{,}000{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    }
], 
    7: [
    {
        text: "Compare: $19{,}999{,}999{,}999 \\;\\_\\_\\; 20{,}000{,}000{,}000$",
        answers: ["$<$", "$>$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is greater than $14{,}000{,}000{,}000$ but less than $15{,}000{,}000{,}000$?",
        answers: [
            "$14{,}500{,}000{,}000$",
            "$13{,}900{,}000{,}000$",
            "$15{,}100{,}000{,}000$",
            "$14{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange from greatest to least: $9{,}000{,}000{,}000$, $11{,}000{,}000{,}000$, $10{,}000{,}000{,}000$",
        answers: [
            "$11B > 10B > 9B$",
            "$9B > 10B > 11B$",
            "$10B > 9B > 11B$",
            "$They\\;are\\;equal$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "How many digits are in $67{,}000{,}000{,}000$?",
        answers: ["11", "10", "12", "13"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of the underlined digit in $3{,}0\\underline{0}0{,}000{,}000$?",
        answers: [
            "$0$", "$100{,}000{,}000$", "$1{,}000{,}000{,}000$", "$10{,}000{,}000$"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which of the following correctly compares $8{,}888{,}888{,}888$ and $8{,}888{,}888{,}889$?",
        answers: ["$<$", "$>$", "$=$", "$\\geq$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number completes the sequence: $5{,}000{,}000{,}000$, $6{,}000{,}000{,}000$, $\\_\\_\\_$?",
        answers: [
            "$7{,}000{,}000{,}000$",
            "$5{,}500{,}000{,}000$",
            "$6{,}500{,}000{,}000$",
            "$6{,}000{,}000{,}001$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is NOT greater than $2{,}000{,}000{,}000$?",
        answers: [
            "$1{,}999{,}999{,}999$",
            "$2{,}100{,}000{,}000$",
            "$2{,}500{,}000{,}000$",
            "$3{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the missing number: $\\_\\_\\_ < 10{,}000{,}000{,}000$ and ends in 000",
        answers: [
            "$9{,}999{,}999{,}000$",
            "$10{,}000{,}000{,}000$",
            "$10{,}000{,}000{,}001$",
            "$10{,}100{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number has the digit 4 in the billion place?",
        answers: [
            "$4{,}000{,}000{,}000$",
            "$40{,}000{,}000$", 
            "$400{,}000{,}000$", 
            "$14{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the ten billion place in $52{,}000{,}000{,}000$?",
        answers: ["5", "2", "0", "1"],
        correctIndex: 5 - 5, // Index 0, representing digit 5
        videoSolution: ""
    },
    {
        text: "Which of the following is the same as $10^9$?",
        answers: [
            "$1{,}000{,}000{,}000$",
            "$10 \\times 1{,}000{,}000$", 
            "$100{,}000$", 
            "$1{,}000 \\times 1{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $X = 5{,}000{,}000{,}000$ and $Y = 4{,}999{,}999{,}999$, which is true?",
        answers: ["$X > Y$", "$X < Y$", "$X = Y$", "$X \\leq Y$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is exactly $1$ more than $9{,}999{,}999{,}999$?",
        answers: [
            "$10{,}000{,}000{,}000$",
            "$9{,}999{,}999{,}998$",
            "$10{,}000{,}000{,}001$",
            "$1{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is **not equal** to $1{,}000{,}000{,}000$?",
        answers: [
            "$1000 \\times 1{,}000{,}000$", 
            "$10^9$", 
            "$100{,}000{,}000 \\times 10$", 
            "$10^8$"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which of these numbers has 12 digits?",
        answers: [
            "$100{,}000{,}000{,}000$", 
            "$10{,}000{,}000{,}000$", 
            "$1{,}000{,}000{,}000$", 
            "$1{,}000{,}000{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is between $7{,}999{,}999{,}999$ and $8{,}000{,}000{,}001$?",
        answers: [
            "$8{,}000{,}000{,}000$",
            "$7{,}000{,}000{,}000$",
            "$8{,}000{,}000{,}001$",
            "$7{,}999{,}999{,}998$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these is **false**?",
        answers: [
            "$2{,}000{,}000{,}000 = 2 \\times 10^9$",
            "$1{,}000{,}000{,}000 = 10^9$",
            "$3{,}000{,}000{,}000 > 2{,}999{,}999{,}999$",
            "$10{,}000{,}000{,}000 > 9{,}000{,}000{,}000$"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the **value** of the digit 9 in $9{,}000{,}000{,}000$?",
        answers: [
            "$9{,}000{,}000{,}000$",
            "$900{,}000{,}000$", 
            "$90{,}000{,}000$", 
            "$9{,}000{,}000$"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Choose the correct statement:",
        answers: [
            "$6{,}000{,}000{,}000 = 6 \\times 10^9$",
            "$6{,}000{,}000{,}000 = 60 \\times 10^8$",
            "$6{,}000{,}000{,}000 = 600 \\times 10^7$",
            "All of the above"
        ],
        correctIndex: 3,
        videoSolution: ""
    }
]

};

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
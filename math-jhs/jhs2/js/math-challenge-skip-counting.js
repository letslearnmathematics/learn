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
        MathJax.typesetPromise().catch(err => {
            console.log('MathJax typeset error:', err);
        });
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
    processMathJax();
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
    processMathJax();
    
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
            text: "Skip count forward in 10,000s from 200,000 to the 5th term",
            answers: ["200,000, 210,000, 220,000, 230,000, 240,000", 
                     "200,000, 300,000, 400,000, 500,000, 600,000", 
                     "200,000, 210,000, 220,000, 240,000, 260,000", 
                     "200,000, 210,000, 211,000, 212,000, 213,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count backward in 100,000s from 1,500,000 to the 5th term",
            answers: [
                "1,500,000, 1,400,000, 1,300,000, 1,200,000, 1,100,000",
                "1,500,000, 1,400,000, 1,300,000, 1,100,000, 900,000",
                "1,500,000, 1,450,000, 1,400,000, 1,350,000, 1,300,000",
                "1,500,000, 1,490,000, 1,480,000, 1,470,000, 1,460,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting forward in 500,000s from 300,000?",
            answers: ["2,300,000", "2,500,000", "2,800,000", "3,000,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count forward in 150,000s from 500,500 to the 5th term",
            answers: [
                "500,500, 650,500, 800,500, 950,500, 1,100,500",
                "500,500, 600,500, 700,500, 800,500, 900,500",
                "500,500, 650,500, 750,500, 850,500, 950,500",
                "500,500, 650,500, 800,500, 850,500, 900,500"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 4th term when skip counting backward in 10,500s from 231,500?",
            answers: ["200,000", "210,500", "189,500", "179,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count forward in 100,500s from 200,000 to the 5th term",
            answers: [
                "200,000, 300,500, 401,000, 501,500, 602,000",
                "200,000, 300,500, 400,500, 500,500, 600,500",
                "200,000, 300,500, 401,000, 501,000, 601,500",
                "200,000, 300,500, 401,500, 502,000, 602,500"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting backward in 500,000s from 2,200,000?",
            answers: ["200,000", "700,000", "1,200,000", "1,700,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count backward in 150,500s from 3,600,500 to the 5th term",
            answers: [
                "3,600,500, 3,450,000, 3,299,500, 3,149,000, 2,998,500",
                "3,600,500, 3,450,500, 3,300,500, 3,150,500, 3,000,500",
                "3,600,500, 3,450,000, 3,300,000, 3,150,000, 3,000,000",
                "3,600,500, 3,450,500, 3,300,000, 3,149,500, 2,999,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting forward in 100,000s from 300,000?",
            answers: ["700,000", "800,000", "900,000", "1,000,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count backward in 10,000s from 300,000 to the 5th term",
            answers: [
                "300,000, 290,000, 280,000, 270,000, 260,000",
                "300,000, 290,000, 280,000, 260,000, 240,000",
                "300,000, 200,000, 100,000, 0, -100,000",
                "300,000, 299,000, 298,000, 297,000, 296,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting forward in 150,000s from 500,500?",
            answers: ["1,100,500", "1,250,500", "1,400,500", "1,550,500"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count forward in 500,000s from 300,000 to the 5th term",
            answers: [
                "300,000, 800,000, 1,300,000, 1,800,000, 2,300,000",
                "300,000, 800,000, 1,300,000, 1,800,000, 2,800,000",
                "300,000, 500,000, 1,000,000, 1,500,000, 2,000,000",
                "300,000, 850,000, 1,400,000, 1,950,000, 2,500,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting backward in 100,000s from 1,300,000?",
            answers: ["900,000", "800,000", "700,000", "600,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count forward in 150,500s from 600,500 to the 5th term",
            answers: [
                "600,500, 751,000, 901,500, 1,052,000, 1,202,500",
                "600,500, 750,500, 900,500, 1,050,500, 1,200,500",
                "600,500, 751,000, 901,000, 1,051,500, 1,202,000",
                "600,500, 751,500, 902,000, 1,052,500, 1,203,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting backward in 500,000s from 100,000,000?",
            answers: ["98,000,000", "97,500,000", "98,500,000", "97,000,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count backward in 100,000s from 700,000 to the 5th term",
            answers: [
                "700,000, 600,000, 500,000, 400,000, 300,000",
                "700,000, 600,000, 500,000, 300,000, 100,000",
                "700,000, 650,000, 600,000, 550,000, 500,000",
                "700,000, 690,000, 680,000, 670,000, 660,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting forward in 10,500s from 200,000?",
            answers: ["242,000", "241,500", "242,500", "243,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count backward in 150,000s from 1,500,500 to the 5th term",
            answers: [
                "1,500,500, 1,350,500, 1,200,500, 1,050,500, 900,500",
                "1,500,500, 1,350,000, 1,200,000, 1,050,000, 900,000",
                "1,500,500, 1,350,500, 1,200,000, 1,050,500, 900,000",
                "1,500,500, 1,350,000, 1,200,500, 1,050,000, 900,500"
            ],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is the 5th term when skip counting forward in 100,500s from 200,000?",
            answers: ["602,000", "601,500", "602,500", "603,000"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "Skip count forward in 10,000s from 300,000 to the 5th term",
            answers: [
                "300,000, 310,000, 320,000, 330,000, 340,000",
                "300,000, 310,000, 320,000, 340,000, 360,000",
                "300,000, 400,000, 500,000, 600,000, 700,000",
                "300,000, 301,000, 302,000, 303,000, 304,000"
            ],
            correctIndex: 0,
            videoSolution: ""
        }
    ],

    2: [
    {
        text: "Skip count forward in 250,000s from 1,000,000 to the 6th term",
        answers: [
            "1,000,000, 1,250,000, 1,500,000, 1,750,000, 2,000,000, 2,250,000",
            "1,000,000, 1,200,000, 1,400,000, 1,600,000, 1,800,000, 2,000,000",
            "1,000,000, 1,250,000, 1,550,000, 1,850,000, 2,150,000, 2,450,000",
            "1,000,000, 1,500,000, 2,000,000, 2,500,000, 3,000,000, 3,500,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 7th term when skip counting backward in 75,000s from 1,000,000?",
        answers: ["550,000", "575,000", "625,000", "475,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Skip count forward in mixed intervals (100,000 then 200,000 alternating) from 500,000 to the 5th term",
        answers: [
            "500,000, 600,000, 800,000, 900,000, 1,100,000",
            "500,000, 700,000, 900,000, 1,100,000, 1,300,000",
            "500,000, 600,000, 700,000, 800,000, 900,000",
            "500,000, 600,000, 700,000, 900,000, 1,000,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the missing terms: 3,000,000, ____, 2,600,000, ____, 2,200,000, ____",
        answers: [
            "2,800,000, 2,400,000, 2,000,000",
            "2,700,000, 2,300,000, 1,900,000",
            "2,900,000, 2,500,000, 2,100,000",
            "2,750,000, 2,350,000, 1,950,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count forward in 125,000s from 750,000 to the 5th term, then backward in 100,000s for 3 terms",
        answers: [
            "750,000, 875,000, 1,000,000, 1,125,000, 1,250,000 then 1,150,000, 1,050,000, 950,000",
            "750,000, 875,000, 1,000,000, 1,125,000, 1,250,000 then 1,100,000, 950,000, 800,000",
            "750,000, 850,000, 950,000, 1,050,000, 1,150,000 then 1,050,000, 950,000, 850,000",
            "750,000, 875,000, 1,000,000, 1,125,000, 1,250,000 then 1,200,000, 1,150,000, 1,100,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What interval is used in this sequence: 5,000,000, 4,750,000, 4,500,000, 4,250,000?",
        answers: ["25,000", "50,000", "250,000", "500,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count forward in decreasing intervals (start with 300,000, decrease by 50,000 each step) from 2,000,000 to the 5th term",
        answers: [
            "2,000,000, 2,300,000, 2,550,000, 2,750,000, 2,900,000",
            "2,000,000, 2,300,000, 2,500,000, 2,650,000, 2,750,000",
            "2,000,000, 2,300,000, 2,550,000, 2,850,000, 3,200,000",
            "2,000,000, 2,300,000, 2,600,000, 2,900,000, 3,200,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the starting number if the 5th term is 1,800,000 when counting forward in 150,000s",
        answers: ["1,200,000", "1,100,000", "1,050,000", "1,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count backward with alternating intervals (200,000 then 100,000) from 3,000,000 to the 6th term",
        answers: [
            "3,000,000, 2,800,000, 2,700,000, 2,500,000, 2,400,000, 2,200,000",
            "3,000,000, 2,900,000, 2,700,000, 2,600,000, 2,400,000, 2,300,000",
            "3,000,000, 2,800,000, 2,600,000, 2,400,000, 2,200,000, 2,000,000",
            "3,000,000, 2,700,000, 2,400,000, 2,100,000, 1,800,000, 1,500,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the position of 3,750,000 in this sequence: 2,500,000, 2,750,000, 3,000,000, ...?",
        answers: ["5th term", "6th term", "7th term", "8th term"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count forward in 175,000s from 1,000,000, but subtract 25,000 every 3 terms to the 6th term",
        answers: [
            "1,000,000, 1,175,000, 1,350,000, 1,500,000, 1,675,000, 1,850,000",
            "1,000,000, 1,175,000, 1,350,000, 1,525,000, 1,700,000, 1,875,000",
            "1,000,000, 1,175,000, 1,350,000, 1,525,000, 1,675,000, 1,825,000",
            "1,000,000, 1,175,000, 1,350,000, 1,500,000, 1,650,000, 1,800,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find two missing terms: ____, 4,200,000, ____, 3,600,000, 3,300,000",
        answers: [
            "4,500,000 and 3,900,000",
            "4,800,000 and 4,000,000",
            "4,600,000 and 3,800,000",
            "4,400,000 and 3,700,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count backward from 10,000,000 in intervals that halve each time (start with 1,000,000) to the 5th term",
        answers: [
            "10,000,000, 9,000,000, 8,500,000, 8,250,000, 8,125,000",
            "10,000,000, 9,000,000, 8,000,000, 7,000,000, 6,000,000",
            "10,000,000, 9,000,000, 8,250,000, 7,750,000, 7,500,000",
            "10,000,000, 9,000,000, 8,500,000, 8,000,000, 7,500,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the interval if the 3rd term is 6,000,000 when counting forward from 5,000,000?",
        answers: ["250,000", "500,000", "750,000", "1,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count forward with increasing intervals (start with 100,000, increase by 50,000 each step) from 2,000,000 to the 5th term",
        answers: [
            "2,000,000, 2,100,000, 2,250,000, 2,450,000, 2,700,000",
            "2,000,000, 2,100,000, 2,200,000, 2,350,000, 2,550,000",
            "2,000,000, 2,100,000, 2,300,000, 2,600,000, 3,000,000",
            "2,000,000, 2,100,000, 2,250,000, 2,400,000, 2,550,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the starting number if counting backward in 125,000s and the 4th term is 1,000,000",
        answers: ["1,375,000", "1,500,000", "1,625,000", "1,750,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count forward in 225,000s from 1,000,000, but add 25,000 every 2 terms to the 6th term",
        answers: [
            "1,000,000, 1,225,000, 1,450,000, 1,700,000, 1,950,000, 2,225,000",
            "1,000,000, 1,225,000, 1,450,000, 1,675,000, 1,900,000, 2,125,000",
            "1,000,000, 1,225,000, 1,500,000, 1,775,000, 2,050,000, 2,325,000",
            "1,000,000, 1,225,000, 1,475,000, 1,750,000, 2,050,000, 2,375,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the position of 2,600,000 in this sequence: 3,500,000, 3,200,000, 2,900,000, ...?",
        answers: ["4th term", "5th term", "6th term", "7th term"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count with pattern: forward 150,000, backward 50,000, starting at 2,000,000 to the 6th term",
        answers: [
            "2,000,000, 2,150,000, 2,100,000, 2,250,000, 2,200,000, 2,350,000",
            "2,000,000, 2,150,000, 2,100,000, 2,250,000, 2,150,000, 2,300,000",
            "2,000,000, 2,150,000, 2,050,000, 2,200,000, 2,100,000, 2,250,000",
            "2,000,000, 2,150,000, 2,050,000, 2,200,000, 2,150,000, 2,300,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find three missing terms: 8,000,000, ____, ____, 6,500,000, ____, 5,500,000",
        answers: [
            "7,500,000, 7,000,000, 6,000,000",
            "7,750,000, 7,500,000, 6,250,000",
            "7,800,000, 7,600,000, 6,200,000",
            "7,600,000, 7,200,000, 6,000,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    }
    ],

    3: [
    {
        text: "What is the 6th term when skip counting forward in 100,000s from 300,000?",
        answers: [
            "800,000", "900,000", "850,000", "950,000"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward in 100,000s from 1,300,000 to the 5th term",
        answers: [
            "1,300,000, 1,200,000, 1,100,000, 1,000,000, 900,000",
            "1,300,000, 1,100,000, 900,000, 700,000, 500,000",
            "1,300,000, 1,250,000, 1,200,000, 1,150,000, 1,100,000",
            "1,300,000, 1,150,000, 1,000,000, 850,000, 700,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the interval: 200,000, 300,500, 401,000, 501,500",
        answers: ["50,000", "100,500", "100,000", "101,500"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the 5th term when skip counting backward in 150,000s from 1,500,500?",
        answers: ["1,050,500", "900,500", "1,200,500", "1,100,500"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What comes after 200,000 when skip counting forward in 10,500s to the 4th term?",
        answers: [
            "210,500, 221,000, 231,500",
            "210,000, 220,000, 230,000",
            "210,500, 220,500, 230,500",
            "210,500, 221,000, 230,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 5th term from 300,000 counting forward in 500,000s?",
        answers: ["2,300,000", "2,000,000", "1,800,000", "1,500,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Complete this backward skip count: 600,000, 500,000, ____, ____, 200,000",
        answers: ["400,000, 300,000", "450,000, 300,000", "400,000, 250,000", "350,000, 300,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the missing term: 500,500, ____, 800,500, 950,500",
        answers: ["650,500", "700,500", "750,500", "850,500"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the interval in this backward count: 2,200,000, 1,700,000, 1,200,000, 700,000?",
        answers: ["100,000", "250,000", "500,000", "600,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which term is 700,000 in this sequence: 200,000, 300,000, 400,000, ...?",
        answers: ["3rd", "4th", "5th", "6th"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "What is the value of the 5th term when skip counting forward in 100,000s from 300,000?",
        answers: ["800,000", "700,000", "600,000", "500,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward in 10,000s from 300,000 to the 5th term",
        answers: [
            "300,000, 290,000, 280,000, 270,000, 260,000",
            "300,000, 295,000, 290,000, 285,000, 280,000",
            "300,000, 285,000, 270,000, 255,000, 240,000",
            "300,000, 280,000, 260,000, 240,000, 220,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the 4th term from 231,500 when counting backward in 10,500s",
        answers: ["189,000", "199,500", "200,000", "200,500"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What interval creates this pattern: 200,000, 700,000, 1,200,000, 1,700,000?",
        answers: ["500,000", "600,000", "300,000", "450,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What comes after 700,000 in this backward skip count: 1,200,000, 1,000,000, 800,000, ____?",
        answers: ["600,000", "500,000", "650,000", "550,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count forward from 200,000 in 100,500s to the 5th term",
        answers: [
            "200,000, 300,500, 401,000, 501,500, 602,000",
            "200,000, 300,500, 400,000, 500,500, 601,000",
            "200,000, 310,000, 420,000, 530,000, 640,000",
            "200,000, 290,500, 381,000, 471,500, 562,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If the 3rd term is 401,000 and the interval is 100,500, what is the first term?",
        answers: ["200,000", "300,500", "400,000", "250,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 4th term when skip counting backward in 100,000s from 700,000?",
        answers: ["400,000", "500,000", "450,000", "600,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the next term: 200,000, 310,000, 420,000, ____",
        answers: ["530,000", "500,000", "430,000", "450,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which term is 500,000 in this skip counting backward: 800,000, 700,000, 600,000, ...?",
        answers: ["3rd", "4th", "5th", "6th"],
        correctIndex: 1,
        videoSolution: ""
    }
    ], 

    4: [
    {
        text: "What is the 6th term when skip counting forward in 150,000s from 450,000?",
        answers: ["1,050,000", "1,100,000", "1,200,000", "1,250,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward in 100,500s from 3,600,500 to the 5th term",
        answers: [
            "3,600,500, 3,500,000, 3,399,500, 3,299,000, 3,198,500",
            "3,600,500, 3,500,000, 3,399,500, 3,299,500, 3,199,500",
            "3,600,500, 3,500,000, 3,399,500, 3,299,000, 3,198,500",
            "3,600,500, 3,500,000, 3,399,500, 3,299,000, 3,198,500"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the 4th term from 500,500 when skip counting forward in 150,000s",
        answers: ["800,500", "850,500", "950,500", "1,000,500"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What interval gives this pattern: 300,000, 450,000, 600,000, 750,000?",
        answers: ["125,000", "100,000", "150,000", "200,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find the 6th term in this forward skip count: 200,000, 300,500, 401,000, ...",
        answers: ["702,000", "703,000", "702,500", "701,500"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the missing terms: ____, 600,000, ____, 200,000",
        answers: ["800,000 and 400,000", "700,000 and 300,000", "750,000 and 350,000", "900,000 and 500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count forward from 100,000 in intervals that increase by 50,000 each step to the 5th term",
        answers: [
            "100,000, 150,000, 250,000, 400,000, 600,000",
            "100,000, 150,000, 250,000, 350,000, 450,000",
            "100,000, 150,000, 200,000, 250,000, 300,000",
            "100,000, 150,000, 250,000, 350,000, 500,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the starting number if the 5th term is 700,000 in a forward skip count of 125,000s",
        answers: ["200,000", "250,000", "300,000", "400,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward from 2,000,000 in alternating intervals of 200,000 and 100,000 to the 6th term",
        answers: [
            "2,000,000, 1,800,000, 1,700,000, 1,500,000, 1,400,000, 1,200,000",
            "2,000,000, 1,800,000, 1,600,000, 1,400,000, 1,200,000, 1,000,000",
            "2,000,000, 1,900,000, 1,700,000, 1,600,000, 1,400,000, 1,300,000",
            "2,000,000, 1,850,000, 1,700,000, 1,550,000, 1,400,000, 1,250,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 5th term if skip counting backward in 125,000s from 1,000,000?",
        answers: ["500,000", "550,000", "475,000", "625,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which term is 850,000 in this sequence: 500,000, 600,000, 700,000, ...?",
        answers: ["3rd", "4th", "5th", "6th"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the next term: 100,000, 200,500, 301,000, ____?",
        answers: ["401,500", "402,000", "401,000", "400,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 3rd term when skip counting backward in 500,000s from 2,000,000?",
        answers: ["1,000,000", "1,500,000", "1,400,000", "1,300,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the interval used: 3,000,000, 2,850,000, 2,700,000, 2,550,000",
        answers: ["125,000", "150,000", "100,000", "200,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What comes next? 1,000,000, 1,225,000, 1,450,000, ____",
        answers: ["1,675,000", "1,600,000", "1,700,000", "1,750,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 6th term when skip counting forward in 125,000s from 750,000?",
        answers: ["1,250,000", "1,275,000", "1,375,000", "1,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 5th term when counting backward in decreasing intervals (start at 300,000, subtract 25,000 each time)?",
        answers: ["150,000", "160,000", "140,000", "125,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find two missing terms: ____, 2,100,000, ____, 1,500,000",
        answers: [
            "2,300,000 and 1,800,000",
            "2,200,000 and 1,700,000",
            "2,400,000 and 1,900,000",
            "2,250,000 and 1,850,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these sequences skip counts forward in alternating 100,000 then 50,000 intervals?",
        answers: [
            "500,000, 600,000, 650,000, 750,000, 800,000",
            "500,000, 600,000, 700,000, 750,000, 850,000",
            "500,000, 600,000, 700,000, 800,000, 900,000",
            "500,000, 550,000, 600,000, 650,000, 700,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the position of 1,100,000 in this skip count: 500,000, 600,000, 700,000, ...?",
        answers: ["5th", "6th", "7th", "8th"],
        correctIndex: 5 - 1,
        videoSolution: ""
    }
    ],
 
    5: [
    {
        text: "What is the 6th term when skip counting forward in 200,000s from 1,400,000?",
        answers: ["2,200,000", "2,300,000", "2,400,000", "2,500,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find two missing terms: 3,000,000, ____, ____, 2,400,000",
        answers: ["2,800,000 and 2,600,000", "2,850,000 and 2,500,000", "2,700,000 and 2,600,000", "2,900,000 and 2,700,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What comes next in this forward skip count: 400,000, 500,000, 700,000, 1,000,000, ____?",
        answers: ["1,400,000", "1,300,000", "1,200,000", "1,100,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count backward in increasing intervals starting at 100,000 and increasing by 50,000 each step from 1,000,000 to the 5th term",
        answers: [
            "1,000,000, 900,000, 750,000, 550,000, 300,000",
            "1,000,000, 900,000, 800,000, 700,000, 600,000",
            "1,000,000, 900,000, 775,000, 625,000, 450,000",
            "1,000,000, 900,000, 800,000, 675,000, 525,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the interval in this pattern: 2,000,000, 1,850,000, 1,700,000, 1,550,000?",
        answers: ["100,000", "125,000", "150,000", "200,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the 6th term when skip counting forward in alternating intervals of 250,000 then 100,000 from 1,000,000",
        answers: [
            "1,000,000, 1,250,000, 1,350,000, 1,600,000, 1,700,000, 1,950,000",
            "1,000,000, 1,250,000, 1,500,000, 1,600,000, 1,850,000, 1,950,000",
            "1,000,000, 1,250,000, 1,350,000, 1,600,000, 1,800,000, 2,050,000",
            "1,000,000, 1,200,000, 1,300,000, 1,500,000, 1,600,000, 1,800,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the 4th term when skip counting backward in 200,000s from 1,400,000",
        answers: ["800,000", "900,000", "1,000,000", "1,200,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count forward with intervals increasing by 25,000 starting from 300,000 to the 5th term",
        answers: [
            "300,000, 325,000, 375,000, 450,000, 550,000",
            "300,000, 325,000, 350,000, 375,000, 400,000",
            "300,000, 325,000, 375,000, 450,000, 525,000",
            "300,000, 325,000, 375,000, 425,000, 475,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which term is 1,800,000 in this skip counting backward: 3,000,000, 2,700,000, 2,400,000, ...?",
        answers: ["5th", "6th", "7th", "8th"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the missing number: 1,000,000, 1,125,000, ____, 1,375,000, 1,500,000",
        answers: ["1,200,000", "1,250,000", "1,275,000", "1,300,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count forward in decreasing intervals (start at 300,000, reduce by 50,000) from 2,000,000 to the 5th term",
        answers: [
            "2,000,000, 2,300,000, 2,550,000, 2,700,000, 2,800,000",
            "2,000,000, 2,300,000, 2,550,000, 2,750,000, 2,900,000",
            "2,000,000, 2,300,000, 2,500,000, 2,650,000, 2,750,000",
            "2,000,000, 2,300,000, 2,600,000, 2,900,000, 3,200,000"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the 5th term when skip counting forward in 150,500s from 600,500?",
        answers: ["1,202,500", "1,200,500", "1,203,000", "1,201,500"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward from 3,000,000 alternating 200,000 and 100,000 to the 6th term",
        answers: [
            "3,000,000, 2,800,000, 2,700,000, 2,500,000, 2,400,000, 2,200,000",
            "3,000,000, 2,900,000, 2,800,000, 2,700,000, 2,600,000, 2,500,000",
            "3,000,000, 2,750,000, 2,650,000, 2,450,000, 2,300,000, 2,100,000",
            "3,000,000, 2,850,000, 2,700,000, 2,600,000, 2,400,000, 2,300,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the 4th term when skip counting forward in 125,000s from 1,250,000",
        answers: ["1,625,000", "1,500,000", "1,625,500", "1,550,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the two missing terms: ____, 5,250,000, ____, 4,750,000",
        answers: ["5,500,000 and 5,000,000", "5,400,000 and 5,000,000", "5,450,000 and 5,000,000", "5,400,000 and 4,950,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the interval in this forward skip count: 750,000, 875,000, 1,000,000, 1,125,000?",
        answers: ["100,000", "125,000", "150,000", "200,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the starting number if the 4th term is 1,000,000 in backward skip counting of 125,000s",
        answers: ["1,375,000", "1,250,000", "1,225,000", "1,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which sequence is correct if skip counting forward by alternating 150,000 and subtracting 50,000 after every third term?",
        answers: [
            "1,000,000, 1,150,000, 1,300,000, 1,450,000, 1,600,000, 1,750,000",
            "1,000,000, 1,150,000, 1,300,000, 1,400,000, 1,550,000, 1,700,000",
            "1,000,000, 1,150,000, 1,300,000, 1,475,000, 1,625,000, 1,775,000",
            "1,000,000, 1,150,000, 1,300,000, 1,450,000, 1,600,000, 1,800,000"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find three missing terms: 2,000,000, ____, ____, 1,250,000, ____, 750,000",
        answers: [
            "1,750,000, 1,500,000, 1,000,000",
            "1,800,000, 1,600,000, 1,100,000",
            "1,900,000, 1,600,000, 1,100,000",
            "1,850,000, 1,650,000, 1,100,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    }
    ], 

    6: [
    {
        text: "Skip count forward in 175,000s from 2,000,000 to the 6th term",
        answers: [
            "2,000,000, 2,175,000, 2,350,000, 2,525,000, 2,700,000, 2,875,000",
            "2,000,000, 2,175,000, 2,350,000, 2,500,000, 2,675,000, 2,825,000",
            "2,000,000, 2,175,000, 2,325,000, 2,500,000, 2,675,000, 2,850,000",
            "2,000,000, 2,175,000, 2,350,000, 2,550,000, 2,725,000, 2,900,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 7th term when counting backward in 100,000s from 1,000,000?",
        answers: ["400,000", "300,000", "450,000", "350,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the two missing terms: ____, 4,500,000, ____, 4,100,000, 3,900,000",
        answers: [
            "4,700,000 and 4,300,000",
            "4,800,000 and 4,200,000",
            "4,750,000 and 4,250,000",
            "4,600,000 and 4,200,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the interval in this pattern: 7,000,000, 6,850,000, 6,700,000, 6,550,000?",
        answers: ["150,000", "200,000", "125,000", "100,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count forward from 1,000,000 in alternating intervals (250,000 then 125,000) to the 6th term",
        answers: [
            "1,000,000, 1,250,000, 1,375,000, 1,625,000, 1,750,000, 2,000,000",
            "1,000,000, 1,250,000, 1,375,000, 1,600,000, 1,750,000, 2,000,000",
            "1,000,000, 1,250,000, 1,375,000, 1,625,000, 1,800,000, 2,025,000",
            "1,000,000, 1,250,000, 1,400,000, 1,650,000, 1,800,000, 2,050,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which term is 3,750,000 in this sequence: 2,500,000, 2,750,000, 3,000,000, ...?",
        answers: ["5th term", "6th term", "7th term", "8th term"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the missing term: 2,000,000, 2,200,000, ____, 2,600,000, 2,800,000",
        answers: ["2,300,000", "2,350,000", "2,400,000", "2,500,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the interval if the 3rd term is 6,000,000 when skip counting forward from 5,000,000?",
        answers: ["250,000", "500,000", "750,000", "1,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward in 150,000s from 2,000,000 to the 5th term",
        answers: [
            "2,000,000, 1,850,000, 1,700,000, 1,550,000, 1,400,000",
            "2,000,000, 1,875,000, 1,750,000, 1,625,000, 1,500,000",
            "2,000,000, 1,850,000, 1,700,000, 1,550,000, 1,450,000",
            "2,000,000, 1,850,000, 1,700,000, 1,600,000, 1,450,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count forward from 500,000 with intervals that halve each time (start with 400,000) to the 5th term",
        answers: [
            "500,000, 900,000, 1,100,000, 1,200,000, 1,250,000",
            "500,000, 900,000, 1,100,000, 1,200,000, 1,300,000",
            "500,000, 900,000, 1,100,000, 1,250,000, 1,325,000",
            "500,000, 900,000, 1,100,000, 1,200,000, 1,225,000"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "What is the 5th term when skip counting forward in 200,000s from 1,300,000?",
        answers: ["2,000,000", "2,100,000", "2,200,000", "2,300,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the two missing numbers: ____, 4,200,000, ____, 3,600,000, 3,300,000",
        answers: [
            "4,500,000 and 3,900,000",
            "4,600,000 and 4,000,000",
            "4,400,000 and 3,800,000",
            "4,300,000 and 3,900,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count backward from 10,000,000 with intervals halving each time (start with 1,000,000) to the 5th term",
        answers: [
            "10,000,000, 9,000,000, 8,500,000, 8,250,000, 8,125,000",
            "10,000,000, 9,000,000, 8,250,000, 7,750,000, 7,500,000",
            "10,000,000, 9,000,000, 8,500,000, 8,000,000, 7,500,000",
            "10,000,000, 9,000,000, 8,750,000, 8,500,000, 8,250,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the 6th term when counting forward in increasing intervals (start at 200,000 and increase by 50,000)",
        answers: ["1,750,000", "1,800,000", "1,850,000", "1,900,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count backward from 2,000,000 alternating 150,000 then 50,000 to the 6th term",
        answers: [
            "2,000,000, 1,850,000, 1,800,000, 1,650,000, 1,600,000, 1,450,000",
            "2,000,000, 1,850,000, 1,800,000, 1,700,000, 1,600,000, 1,500,000",
            "2,000,000, 1,850,000, 1,750,000, 1,600,000, 1,500,000, 1,350,000",
            "2,000,000, 1,800,000, 1,700,000, 1,550,000, 1,450,000, 1,300,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 4th term when skip counting backward in 250,000s from 3,000,000?",
        answers: ["2,250,000", "2,300,000", "2,500,000", "2,400,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which of these sequences shows forward skip count with increasing intervals: +100,000, +200,000, +300,000, ...?",
        answers: [
            "500,000, 600,000, 800,000, 1,100,000, 1,500,000",
            "500,000, 600,000, 700,000, 800,000, 900,000",
            "500,000, 650,000, 800,000, 950,000, 1,100,000",
            "500,000, 700,000, 900,000, 1,200,000, 1,600,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find three missing terms: 8,000,000, ____, ____, 6,500,000, ____, 5,500,000",
        answers: [
            "7,500,000, 7,000,000, 6,000,000",
            "7,750,000, 7,500,000, 6,250,000",
            "7,800,000, 7,600,000, 6,200,000",
            "7,600,000, 7,200,000, 6,000,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count forward in 225,000s from 1,000,000, but add 25,000 every 2 terms to the 6th term",
        answers: [
            "1,000,000, 1,225,000, 1,450,000, 1,700,000, 1,950,000, 2,225,000",
            "1,000,000, 1,225,000, 1,450,000, 1,675,000, 1,900,000, 2,125,000",
            "1,000,000, 1,225,000, 1,500,000, 1,775,000, 2,050,000, 2,325,000",
            "1,000,000, 1,225,000, 1,475,000, 1,750,000, 2,050,000, 2,375,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    }
    ], 
    
    7: [
    {
        text: "What is the 7th term when skip counting forward in 250,000s from 1,500,000?",
        answers: ["3,000,000", "2,750,000", "2,250,000", "2,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find three missing terms: ____, 2,400,000, ____, 1,900,000, ____, 1,400,000",
        answers: [
            "2,700,000, 2,100,000, 1,600,000",
            "2,800,000, 2,200,000, 1,600,000",
            "2,900,000, 2,300,000, 1,800,000",
            "2,600,000, 2,000,000, 1,500,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which sequence skip counts backward in halving intervals starting at 400,000?",
        answers: [
            "3,000,000, 2,600,000, 2,400,000, 2,300,000",
            "3,000,000, 2,600,000, 2,400,000, 2,200,000",
            "3,000,000, 2,600,000, 2,400,000, 2,300,000",
            "3,000,000, 2,600,000, 2,400,000, 2,300,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the position of 1,425,000 in this pattern: 1,000,000, 1,125,000, 1,250,000, ...?",
        answers: ["5th", "6th", "4th", "7th"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the 6th term in this backward pattern: 6,000,000, 5,500,000, 5,000,000, ...",
        answers: ["3,500,000", "4,000,000", "4,500,000", "3,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which of these shows a forward skip count with increasing intervals of 125,000 each time?",
        answers: [
            "1,000,000, 1,125,000, 1,275,000, 1,450,000, 1,650,000",
            "1,000,000, 1,125,000, 1,250,000, 1,375,000, 1,500,000",
            "1,000,000, 1,125,000, 1,275,000, 1,425,000, 1,575,000",
            "1,000,000, 1,100,000, 1,200,000, 1,300,000, 1,400,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 6th term when skip counting backward in alternating 150,000 then 100,000 from 2,000,000?",
        answers: ["1,050,000", "1,100,000", "1,200,000", "1,150,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What interval produces this: 4,000,000, 3,500,000, 3,000,000, 2,500,000?",
        answers: ["250,000", "400,000", "500,000", "600,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count forward from 2,000,000 with intervals increasing by 200,000 each time (start at 100,000) to the 5th term",
        answers: [
            "2,000,000, 2,100,000, 2,300,000, 2,600,000, 3,000,000",
            "2,000,000, 2,150,000, 2,400,000, 2,800,000, 3,300,000",
            "2,000,000, 2,100,000, 2,250,000, 2,500,000, 2,850,000",
            "2,000,000, 2,200,000, 2,400,000, 2,600,000, 2,800,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the 5th term in this pattern: 750,000, 850,000, 950,000, 1,050,000, ____",
        answers: ["1,250,000", "1,150,000", "1,200,000", "1,100,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Skip count backward from 3,000,000 in decreasing intervals starting at 500,000, reducing by 100,000 each time",
        answers: [
            "3,000,000, 2,500,000, 2,100,000, 1,800,000, 1,600,000",
            "3,000,000, 2,600,000, 2,300,000, 2,100,000, 1,900,000",
            "3,000,000, 2,500,000, 2,000,000, 1,600,000, 1,300,000",
            "3,000,000, 2,600,000, 2,300,000, 2,050,000, 1,850,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the 4th term when skip counting forward in 125,000s from 250,000?",
        answers: ["625,000", "500,000", "750,000", "700,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the two missing numbers: ____, 3,700,000, ____, 3,300,000",
        answers: [
            "3,900,000 and 3,500,000",
            "3,850,000 and 3,550,000",
            "4,000,000 and 3,600,000",
            "3,800,000 and 3,400,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the interval in this sequence: 5,000,000, 4,750,000, 4,500,000, 4,250,000?",
        answers: ["25,000", "50,000", "250,000", "500,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the 7th term when skip counting forward in 125,000s from 750,000?",
        answers: ["1,500,000", "1,625,000", "1,750,000", "1,250,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which sequence uses forward skip counting with doubling intervals: +100,000, +200,000, +400,000…?",
        answers: [
            "500,000, 600,000, 800,000, 1,200,000",
            "500,000, 600,000, 700,000, 800,000",
            "500,000, 700,000, 900,000, 1,100,000",
            "500,000, 600,000, 800,000, 1,000,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the 6th term when skip counting backward in alternating 300,000 then 100,000 from 3,000,000",
        answers: ["1,500,000", "1,700,000", "1,800,000", "1,600,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "What is the 5th term in this alternating pattern: forward 200,000, back 100,000, starting at 2,000,000?",
        answers: ["2,150,000", "2,200,000", "2,250,000", "2,300,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find three missing terms: 9,000,000, ____, ____, 7,000,000, ____, 6,000,000",
        answers: [
            "8,500,000, 8,000,000, 6,500,000",
            "8,750,000, 8,250,000, 6,500,000",
            "8,700,000, 8,400,000, 6,200,000",
            "8,600,000, 8,200,000, 6,400,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    }
    ]
};

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
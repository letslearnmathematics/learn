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
        text: "If 1 rod = 10 cubes, how many cubes are in 3 rods?",
        answers: ["3", "30", "300", "3,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many rods make 1 flat?",
        answers: ["1", "10", "100", "1,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "What is the value of 2 flats + 5 rods + 7 cubes?",
        answers: ["275", "2,057", "257", "2570"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many cubes are in 1 block?",
        answers: ["10", "100", "1,000", "10,000"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you have 6 blocks, how many flats is that?",
        answers: ["6", "60", "600", "6,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Convert 8 rods + 9 cubes to total cubes.",
        answers: ["17", "69", "89", "98"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many rods are in 2 flats?",
        answers: ["2", "20", "200", "2,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "What is 1 block - 3 flats in cubes?",
        answers: ["7", "70", "700", "7,000"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you have 60 cubes, how many rods can you make?",
        answers: ["6", "60", "600", "6,000"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many cubes are in 1 flat + 2 rods?",
        answers: ["12", "102", "120", "1,200"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Which equals 250 cubes?",
        answers: ["2 flats + 5 rods", "2 rods + 5 flats", "2 blocks + 5 cubes", "2 blocks + 5 rods"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Subtract: 1 flat - 4 rods. Result in cubes?",
        answers: ["6", "60", "96", "600"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many full flats can you make from 325 cubes?",
        answers: ["3", "32", "325", "3,250"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Add: 3 rods + 7 rods. Total cubes?",
        answers: ["10", "37", "100", "370"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If 1 block = 10 flats, how many flats are in 5 blocks?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many cubes are in 4 rods + 9 cubes?",
        answers: ["49", "409", "94", "490"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you combine 2 flats + 0 rods + 3 cubes, what is the total?",
        answers: ["23", "203", "230", "2,003"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many rods are needed to make 1 block?",
        answers: ["10", "100", "1,000", "10,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "What is 5 flats - 2 rods in cubes?",
        answers: ["3", "48", "480", "498"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you have 120 cubes, how many flats can you make?",
        answers: ["1", "12", "120", "1,200"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      }
    ],
    2: [
      // Level 2 questions would go here
      // Follow same format as level 1
      {
        text: "How many cubes are in 7 rods + 2 cubes?",
        answers: ["27", "72", "702", "720"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is the value of 1 flat + 0 rods + 5 cubes?",
        answers: ["15", "105", "150", "1,005"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many rods make 5 flats?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 3 flats - 4 rods. Result in cubes?",
        answers: ["26", "260", "296", "2,600"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If you have 15 rods, how many cubes is that?",
        answers: ["15", "150", "1,500", "15,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many full rods can you make from 84 cubes?",
        answers: ["8", "84", "840", "8,400"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 1 block + 2 flats + 3 rods + 4 cubes?",
        answers: ["123", "1,234", "12,340", "123,400"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Convert 9 rods + 9 cubes to total cubes.",
        answers: ["18", "99", "909", "999"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in half a flat?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If 1 block = 10 flats, how many cubes are in 0.5 blocks?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Add: 1 rod + 1 flat + 1 block. Total cubes?",
        answers: ["111", "1,110", "11,100", "111,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many flats are in 2 blocks + 5 flats?",
        answers: ["7", "25", "250", "2,500"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 3 rods \\(\\times\\) 4 in cubes?",
        answers: ["12", "120", "1,200", "12,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 1 block \\(\\div\\) 2 rods. Result?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If you have 250 cubes, how many full flats can you make?",
        answers: ["2", "25", "250", "2,500"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.1 blocks?",
        answers: ["1", "10", "100", "1,000"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Combine: 4 flats + 9 rods + 6 cubes. Total cubes?",
        answers: ["4.096", "469", "496", "964"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 1 flat - 1 rod - 1 cube, in cubes?",
        answers: ["89", "98", "109", "189"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If 20 rods = _____ cubes, the missing value is:",
        answers: ["20", "200", "2,000", "20,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.25 flats?",
        answers: ["25", "250", "2.5", "2,500"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    ],
    3: [
      // Level 3 questions would go here
      // Follow same format as level 1
    {
        text: "Add: 3 rods + 5 rods. Total cubes?",
        answers: ["8", "80", "800", "8,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 1 flat - 2 rods. Remaining cubes?",
        answers: ["8", "80", "98", "800"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Multiply: 4 rods \\(\\times\\) 3. Total cubes?",
        answers: ["12", "120", "1,200", "12,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 1 block \\(\\div\\) 5 rods. Result?",
        answers: ["2", "20", "200", "2,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 2 flats + 7 rods + 4 cubes?",
        answers: ["2,074", "247", "274", "724"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If you have 5 rods \\(\\times\\) 4, how many cubes total?",
        answers: ["20", "200", "2,000", "20,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Solve: 1 block - 3 flats + 2 rods.",
        answers: ["720", "702", "270", "1,320"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.5 flats + 2 rods?",
        answers: ["25", "45", "70", "700"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 3 rods \\(\\times\\) 2 rods?",
        answers: ["6 cubes", "60 cubes", "600 cubes", "6,000 cubes"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 2 blocks \\(\\div\\) 4 flats. Result?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 10 rods - 25 cubes.",
        answers: ["7.5 cubes", "75 cubes", "750 cubes", "7,500 cubes"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Add: 0.3 blocks + 4 rods. Total cubes?",
        answers: ["34", "340", "430", "3,040"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Multiply: 1 flat \\(\\times\\) 1 rod.",
        answers: ["10 cubes", "100 cubes", "1,000 cubes", "10,000 cubes"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If 1 rod = 10 cubes, what is 7 rods ÷ 2?",
        answers: ["3.5 cubes", "35 cubes", "350 cubes", "3,500 cubes"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Solve: 5 flats - 3 rods + 1 block.",
        answers: ["1,270", "1,470", "1,700", "15,300"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.2 blocks + 0.5 flats?",
        answers: ["25", "250", "2,500", "25,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 12 rods \\(\\times\\) 5?",
        answers: ["60 cubes", "600 cubes", "6,000 cubes", "60,000 cubes"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 3 blocks \\(\\div\\) 6 rods.",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Add: 0.7 flats + 8 cubes.",
        answers: ["15", "78", "708", "780"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 1 block - 0.5 blocks.",
        answers: ["5 cubes", "50 cubes", "500 cubes", "5,000 cubes"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    ], 
    4: [
        // Level 4 questions would go here
      // Follow same format as level 1
        {
            text: "Solve: (2 flats \\(\\times\\) 3) + (5 rods \\(\\times\\) 4).",
            answers: ["800", "1,100", "1,600", "2,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = 10 cubes, what is 1 flat \\(\\div\\) 2 rods?",
            answers: ["5", "50", "500", "5,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.4 blocks + 3 flats - 2 rods?",
            answers: ["420", "480", "4,200", "4,800"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Multiply: 0.5 blocks \\(\\times\\) 10 rods.",
            answers: ["50 cubes", "500 cubes", "5,000 cubes", "50,000 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "1,000 cubes ÷ 25 cubes",
            answers: ["2 rods", "4 rods", "40 rods", "400 rods"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A builder uses 3 flats + 8 rods of material. How many cubes is this?",
            answers: ["38", "308", "380", "3,080"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Subtract: 1.5 blocks - 7 flats. Result in cubes?",
            answers: ["80", "800", "8,000", "80,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Multiply: 6 rods \\(\\times\\) 0.5 flats. (Hint: 0.5 flat = 50 cubes)",
            answers: ["30 cubes", "300 cubes", "3,000 cubes", "30,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A shop sells 2 rods + 5 cubes of ribbon per customer. How much ribbon for 4 customers?",
            answers: ["25 cubes", "100 cubes", "250 cubes", "1,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Divide: 9 flats \\(\\div\\) 3 rods.",
            answers: ["3", "30", "300", "3,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Solve: (1 block - 2 rods) + (3 flats \\(\\times\\) 2).",
            answers: ["1,160", "1,600", "2,600", "3,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = 10 cubes, what is \\frac{1}{4} block + \\frac{1}{2} flat?",
            answers: ["250 cubes", "300 cubes", "350 cubes", "400 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A recipe requires 2 rods + 7 cubes of sugar. Double the recipe.",
            answers: ["27 cubes", "54 cubes", "270 cubes", "540 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "How many full rods can you make from 365 cubes?",
            answers: ["3", "36", "360", "3,650"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.2 blocks + 30 rods - 1 flat?",
            answers: ["10 cubes", "100 cubes", "1,000 cubes", "10,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A classroom has 4 blocks + 5 flats of paper. How many sheets if 1 cube = 1 sheet?",
            answers: ["45", "450", "4,500", "45,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 5 rods = 50 cubes, what is 5 rods \\(\\times\\) 5 rods?",
            answers: ["25 cubes", "250 cubes", "2,500 cubes", "25,000 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A tank has 2 blocks - 5 flats of water. How many cubes remain?",
            answers: ["500", "1,500", "2,500", "5,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Combine: 0.3 flats + 4 rods + 0.7 blocks.",
            answers: ["740 cubes", "804 cubes", "840 cubes", "8,040 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A factory produces 1 block + 2 flats daily. Weekly production?",
            answers: ["1,200 cubes", "8,400 cubes", "12,000 cubes", "84,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ], 
    5: [
        // Level 5 questions would go here
      // Follow same format as level 1
        {
            text: "Emma buys a toy for 2 flats + 3 rods + 5 cubes. How much does she spend (in cubes)?",
            answers: ["235", "253", "352", "325"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A book costs 1 block - 2 flats. What's the price in cubes?",
            answers: ["800", "1,200", "8,000", "12,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = Gh₵10.00, how much is 5 flats + 4 rods?",
            answers: ["Gh₵54.00", "Gh₵540.00", "Gh₵5,400.00", "Gh₵54,000.00"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A wall is built with 3 blocks + 5 flats of bricks. How many bricks are used?",
            answers: ["305", "3,050", "3,500", "35,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A rope is 4 rods + 7 cubes long. How many cubes is that?",
            answers: ["407", "470", "4,007", "47"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A tank holds 2 blocks of water. If you remove 5 flats, how much remains?",
            answers: ["500", "1,500", "2,500", "5,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A machine makes 1 flat of widgets every hour. How many widgets does it make in 8 hours?",
            answers: ["8", "80", "800", "8,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A worker packs 2 rods of boxes daily. How many cubes does he pack in 5 days?",
            answers: ["10", "100", "500", "1,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Half a block + a quarter flat = ___ cubes.",
            answers: ["250", "525", "600", "1,025"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "0.3 blocks + 0.7 flats = ___ cubes.",
            answers: ["37", "3,070", "3,700", "370"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A store has 5 blocks of stock. It sells 3 flats + 2 rods daily. How many cubes remain after 2 days?",
            answers: ["4,360", "4,600", "4,960", "5,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "You have 2 blocks. You give away 1 flat + 5 rods + 3 cubes. How much is left?",
            answers: ["847", "1,847", "2,153", "2,847"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A pizza is cut into 1 flat + 2 rods slices. How many slices is that?",
            answers: ["12", "102", "120", "1,020"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A school orders 4 blocks + 5 rods of pencils. How many pencils is that?",
            answers: ["405", "4,500", "45,000", "4,050"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A car travels 1 rod km per minute. How far in 1 flat minutes?",
            answers: ["10 km", "100 km", "0.1 km", "1,000 km"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Combine: 0.5 blocks + 25 rods - 3 flats.",
            answers: ["0 cubes", "200 cubes", "450 cubes", "700 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = 1,000 marbles, how many marbles are in 2.5 blocks?",
            answers: ["25", "250", "2,500", "25,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A box weighs 1 block - 5 rods. What's its weight in cubes?",
            answers: ["50", "500", "950", "995"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A recipe needs 3 rods + 2 cubes of flour. What is triple the recipe.",
            answers: ["96", "15", "9", "32"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A garden has 2 blocks of plants. If 1 flat + 2 rods die, how many survive?",
            answers: ["1,880", "1,808", "1,280", "1,082"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ], 
    6: [
        // Level 6 questions would go here
      // Follow same format as level 1
        {
            text: "A store has 3 blocks + 7 flats of product. They sell 1 block + 2 flats + 5 rods in a day. How much inventory remains?",
            answers: ["1,450 cubes", "2,450 cubes", "1,550 cubes", "2,550 cubes"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A factory produces 4 rods + 3 cubes of goods every hour. How many cubes are made in an 8-hour shift?",
            answers: ["344 cubes", "434 cubes", "3,440 cubes", "4,340 cubes"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Sarah saves 2 flats + 5 rods weekly. How many cubes does she save in 4 weeks?",
            answers: ["100", "250", "1,000", "10,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A wall is 0.5 blocks + 2 flats tall. How many cubes is the height?",
            answers: ["520", "700", "1,200", "7,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A Gh₵1,000.00 phone is discounted by 3 rods + 2 cubes. What's the new price in cubes?",
            answers: ["Gh₵968.00", "Gh₵986.00", "Gh₵698.00", "Gh₵896.00"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A farmer harvests 5 blocks + 4 flats of corn. If 1 flat spoils, how much remains?",
            answers: ["5,500", "530", "5,400", "5,300"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A truck carries 2 blocks + 5 rods of sand per trip. How many cubes can it transport in 3 trips?",
            answers: ["2,500", "2,050", "615", "6,150"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Water boils at 1 flat °C. If it cools by 3 rods °C, what's the new temperature?",
            answers: ["30°C", "70°C", "130°C", "170°C"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A runner completes 1 block + 2 flats meters in a race. How many meters is that?",
            answers: ["1,002", "1,020", "1,200", "12,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A cake requires 3 rods + 4 cubes of flour. How much flour is needed for 5 cakes?",
            answers: ["170", "107", "1,700", "17,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 3 blocks + \\(x\\) rods = 3,200 cubes, find the value of \\(x\\)?",
            answers: ["2", "20", "200", "2,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is \\(\\dfrac{1}{2}\\) block + \\(\\dfrac{1}{4}\\) flat in cubes?",
            answers: ["525", "600", "1,025", "1,250"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If \\(x\\) rods = 1 flat, what is \\(x\\)?",
            answers: ["15", "5", "20", "10"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A store has 5 blocks of inventory. It sells 2 blocks + 3 flats + 4 rods on Monday. How much remains?",
            answers: ["2,660", "2,340", "4,340", "1,640"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Which is greater: 0.6 blocks or 7 flats?",
            answers: ["0.6 blocks", "7 flats", "They are equal", "Not enough information"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = 10 cubes, how many flats are in 50 rods?",
            answers: ["0.5", "5", "50", "500"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A tank has 4,500 cubes of water. How many full blocks + flats is this?",
            answers: ["4 blocks + 5 flats", "5 blocks + 4 flats", "3 blocks + 15 flats", "2 blocks + 25 flats"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.3 blocks - 15 rods?",
            answers: ["150", "15", "1,500", "0"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = 10 flats, and 1 flat = 10 rods, how many rods are in 2 blocks?",
            answers: ["20", "200", "2,000", "20,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A construction project needs 12,000 cubes of concrete. How many full blocks are required?",
            answers: ["12", "120", "1,200", "1.2"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ], 
    7: [
        // Level 7 questions would go here
      // Follow same format as level 1
        {
            text: "If 5 rods + \\(x\\) cubes = 1 flat, what is the value of \\(x\\)?",
            answers: ["40", "50", "60", "100"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is \\(\\dfrac{3}{4}\\) block - 2 rods in cubes?",
            answers: ["550", "650", "730", "800"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A truck carries 2 blocks + 3 flats of sand. It drops off 5 rods + 7 cubes. How much sand remains?",
            answers: ["2,243", "2,343", "2,443", "2,543"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Which is greater: 0.7 blocks or 6 flats + 5 rods?",
            answers: ["0.7 blocks", "6 flats + 5 rods", "Equal", "Not comparable"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 150 rods = _____ blocks, what fills the blank?",
            answers: ["0.15", "1.5", "15", "150"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A box weighs 3,050 cubes. How many full blocks + flats + rods is this?",
            answers: ["3 blocks + 0 flats + 5 rods", "3 blocks + 5 flats + 0 rods", "30 blocks + 5 rods", "305 flats"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = 5 flats, 1 flat = 2 rods, and 1 rod = 10 cubes, how many cubes are in 2 blocks?",
            answers: ["100", "200", "1,000", "2,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A bakery uses 2 flats + 8 rods of flour daily. How much flour is used in 5 days?",
            answers: ["1,400", "2,800", "14,000", "28,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.4 blocks \\(\\times\\) 5 rods? (Assume rod = 10 cubes)",
            answers: ["20", "200", "2,000", "20,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If A = \\(\\dfrac{1}{4}\\) block, B = 3 rods, and C = 0.2 flats, which is smallest?",
            answers: ["A", "B", "C", "All equal"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A container holds 2.5 blocks of water. How many flats is this equivalent to?",
            answers: ["2.5", "25", "250", "2,500"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = \\(x\\) rods, what is the value of \\(x\\)?",
            answers: ["10", "100", "1,000", "10,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A factory produces 3 blocks + 5 flats of goods daily. How many cubes are produced in 4 days?",
            answers: ["1,400", "3,500", "14,000", "35,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is \\(\\dfrac{3}{4}\\) block + \\(\\dfrac{1}{5}\\) flat in cubes?",
            answers: ["755", "770", "800", "850"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Which quantity is largest?",
            answers: ["0.6 blocks", "7 flats", "65 rods", "600 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A machine makes 2 rods + 5 cubes every minute. How much does it produce in 30 minutes?",
            answers: ["75", "250", "750", "7500"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 cube = 1 gram, how many kilograms is 1 block?",
            answers: ["1", "10", "100", "1,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A shipment contains 4,200 cubes. How many full blocks and flats is this?",
            answers: ["4 blocks + 2 flats", "2 blocks + 4 flats", "42 flats", "420 rods"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "35% of a block equals how many rods?",
            answers: ["3.5", "35", "350", "3,500"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Boxes hold 1 flat (100 cubes) each. How many boxes are needed for 3 blocks + 2 rods?",
            answers: ["30", "31", "32", "40"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ]
  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
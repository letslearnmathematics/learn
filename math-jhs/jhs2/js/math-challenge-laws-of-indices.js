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
            text: "What is $5^2 \\times 5^3$ simplified using the multiplication law?",
            answers: ["5", "$5^5$", "$5^6$", "$25^5$"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "Simplify $\\frac{7^4}{7^2}$ using the division law",
            answers: ["$7^2$", "$7^6$", "1", "$7^8$"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is $(2^3)^2$ simplified using the power law?",
            answers: ["$2^5$", "$2^6$", "$2^9$", "$4^6$"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "According to the zero index law, what is $9^0$ equal to?",
            answers: ["0", "1", "9", "Undefined"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "What is $4^{-2}$ equivalent to?",
            answers: ["-16", "$\\frac{1}{16}$", "-8", "$\\frac{1}{8}$"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "Simplify $8^{\\frac{1}{3}}$ using the fractional index law",
            answers: ["2", "4", "$\\frac{8}{3}$", "24"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is $3 \\times 3^4$ simplified?",
            answers: ["$3^4$", "$3^5$", "$9^4$", "$12^4$"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "Simplify $\\frac{x^5}{x^2}$",
            answers: ["$x^3$", "$x^{2.5}$", "$x^7$", "$x^{10}$"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is $(5^2)^0$ equal to?",
            answers: ["0", "1", "5", "25"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "Express $\\frac{1}{2^3}$ using negative indices",
            answers: ["$2^{-1}$", "$2^{-2}$", "$2^{-3}$", "$3^{-2}$"],
            correctIndex: 2,
            videoSolution: ""
        },
        {
            text: "What is $\\sqrt{25}$ expressed with fractional indices?",
            answers: ["$25^1$", "$25^2$", "$25^{0.5}$", "$25^{-1}$"],
            correctIndex: 2,
            videoSolution: ""
        },
        {
            text: "Simplify $10^6 \\div 10^4$",
            answers: ["10", "$10^2$", "$10^{10}$", "1000"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "What is $y^0 \\times y^5$ equal to?",
            answers: ["0", "1", "$y^5$", "$y^6$"],
            correctIndex: 2,
            videoSolution: ""
        },
        {
            text: "Express $\\frac{1}{5}$ using negative indices",
            answers: ["-5", "$5^{-1}$", "$-5^1$", "$1^{-5}$"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "What is $\\sqrt[3]{8}$ in index notation?",
            answers: ["$8^1$", "$8^2$", "$8^{\\frac{1}{3}}$", "$8^{-\\frac{1}{3}}$"],
            correctIndex: 2,
            videoSolution: ""
        },
        {
            text: "Simplify $(a^3)^2 \\times a^4$",
            answers: ["$a^6$", "$a^9$", "$a^{10}$", "$a^{24}$"],
            correctIndex: 2,
            videoSolution: ""
        },
        {
            text: "What is $6^3 \\div 6^3$ equal to?",
            answers: ["0", "1", "6", "$6^6$"],
            correctIndex: 1,
            videoSolution: ""
        },
        {
            text: "Express $\\sqrt{x}$ using fractional indices",
            answers: ["$x^2$", "$x^{-1}$", "$x^{\\frac{1}{2}}$", "$x^{-\\frac{1}{2}}$"],
            correctIndex: 2,
            videoSolution: ""
        },
        {
            text: "Simplify $2^4 \\times 2^{-2}$",
            answers: ["$2^2$", "$2^6$", "$4^2$", "$8^{-8}$"],
            correctIndex: 0,
            videoSolution: ""
        },
        {
            text: "What is $100^{\\frac{1}{2}}$ equal to?",
            answers: ["50", "10", "$\\frac{1}{100}$", "200"],
            correctIndex: 1,
            videoSolution: ""
        }
    ],
    2:[
    {
        text: "Simplify $(3^2 \\times 3^4) \\div 3^3$",
        answers: ["$3^2$", "$3^3$", "$3^4$", "$3^5$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is $(5^3)^2 \\div 5^4$ simplified?",
        answers: ["$5^1$", "$5^2$", "$5^6$", "$5^{10}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{2^5 \\times 2^3}{2^4 \\times 2^2}$",
        answers: ["$2^0$", "$2^1$", "$2^2$", "$2^3$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is $(4^{-2})^{-1}$ equal to?",
        answers: ["$4^{-2}$", "$4^0$", "$4^2$", "$4^{-1}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Simplify $8^{\\frac{2}{3}}$",
        answers: ["2", "4", "8", "16"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is $\\frac{3^{-2} \\times 3^5}{3^2}$ simplified?",
        answers: ["$3^{-4}$", "$3^1$", "$3^2$", "$3^3$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $(x^4 y^3)^2 \\div (x^2 y)^3$",
        answers: ["$x^2 y^3$", "$x^4 y^6$", "$x^8 y^9$", "$x^{10} y^3$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is $16^{-\\frac{1}{2}}$ equal to?",
        answers: ["-4", "$\\frac{1}{4}$", "$\\frac{1}{8}$", "-$\\frac{1}{16}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{2^3}{2^{-2}}\\right)^2$",
        answers: ["$2^2$", "$2^5$", "$2^{10}$", "$2^{12}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is $\\sqrt[4]{81}$ expressed with fractional indices?",
        answers: ["$81^2$", "$81^{\\frac{1}{4}}$", "$81^{-4}$", "$81^{\\frac{1}{2}}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $(a^{-3}b^2)^{-2} \\times (a^2 b^{-1})^3$",
        answers: ["$a^{10}b^{-7}$", "$a^2b^1$", "$a^{-6}b^{-4}$", "$a^{-10}b^7$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is $125^{\\frac{2}{3}}$ equal to?",
        answers: ["5", "25", "50", "250"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(3x^2 y)^3}{(9xy^2)^2}$",
        answers: ["$3x^4 y^{-1}$", "$x^4 y^{-1}$", "$3x^4 y^7$", "$\\frac{x^4}{y}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is $(2^{-1} + 3^0)^{-1}$ equal to?",
        answers: ["$\\frac{1}{2}$", "$\\frac{2}{3}$", "$\\frac{3}{2}$", "2"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\sqrt{32^{\\frac{2}{5}}}$",
        answers: ["2", "4", "8", "16"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is $\\left(\\frac{x^{-2}}{y^3}\\right)^{-3}$ simplified?",
        answers: ["$x^{-6}y^{-9}$", "$x^6y^{-9}$", "$x^{-5}y^0$", "$x^6y^9$"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Simplify $(0.25)^{-\\frac{1}{2}}$",
        answers: ["0.5", "2", "4", "16"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is $\\frac{5^{n+2} - 5^{n+1}}{5^n}$ equal to?",
        answers: ["1", "4", "5", "$5^n$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{8}{27}\\right)^{-\\frac{2}{3}}$",
        answers: ["$\\frac{4}{9}$", "$\\frac{9}{4}$", "$\\frac{2}{3}$", "$\\frac{3}{2}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is $(2^a \\times 4^b \\times 8^c)^{\\frac{1}{3}}$ simplified?",
        answers: ["$2^{a+b+c}$", "$2^{\\frac{a+2b+3c}{3}}$", "$8^{\\frac{a+b+c}{3}}$", "$2^{3a+6b+9c}$"],
        correctIndex: 1,
        videoSolution: ""
    }
],
    3: [
    {
        text: "Simplify $\\left(\\frac{8x^6 y^{-3}}{27x^{-9} y^6}\\right)^{-\\frac{1}{3}}$",
        answers: ["$\\frac{3x^5}{2y^3}$", "$\\frac{2y^3}{3x^5}$", "$\\frac{9x^5}{4y^3}$", "$\\frac{3x^{-5}}{2y^{-3}}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $2^x = 8^{y+1}$ and $3^y = 27^{x-1}$, what is $x+y$?",
        answers: ["$\\frac{9}{5}$", "$\\frac{12}{7}$", "$\\frac{15}{8}$", "$\\frac{21}{11}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(2^{n+3} - 2^{n+1})}{2^{n-1}}$ to its simplest form",
        answers: ["6", "8", "12", "14"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Solve for x: $9^{x-1} = \\left(\\frac{1}{27}\\right)^{2x-3}$",
        answers: ["$\\frac{7}{8}$", "$\\frac{5}{6}$", "$\\frac{11}{12}$", "$\\frac{9}{10}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Express $\\sqrt[5]{\\frac{x^{10}}{y^{-15}}}$ in simplified index form",
        answers: ["$x^2 y^3$", "$x^5 y^{15}$", "$x^{-2} y^{-3}$", "$x^{\\frac{1}{2}} y^{\\frac{1}{3}}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $5^{2x} \\times 25^{3x-1} = 125^{x+2}$, find x",
        answers: ["1", "$\\frac{5}{4}$", "$\\frac{7}{5}$", "2"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{a^{-\\frac{3}{2}} b^{\\frac{1}{4}}}{a^{\\frac{1}{2}} b^{-\\frac{3}{4}}}\\right)^{-4}$",
        answers: ["$a^8 b^4$", "$a^{-8} b^{-4}$", "$a^4 b^8$", "$\\frac{a^4}{b^8}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the value of $\\frac{4^{x+3} - 4^{x+1}}{4^{x-1}}$ when simplified?",
        answers: ["15", "30", "60", "120"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If $\\sqrt[x]{8} = 2^y$ and $\\sqrt[y]{81} = 3^x$, find $x+y$",
        answers: ["5", "6", "7", "8"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{x^{-2} y^3 z^{-1}}{x^3 y^{-2} z}\\right)^{-2} \\times \\left(\\frac{x y^{-1}}{z^2}\\right)^3$",
        answers: ["$x^{13} y^{-12} z^{-1}$", "$x^5 y^{-4} z^7$", "$x^{-5} y^4 z^{-7}$", "$x^{-13} y^{12} z^1$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find x if $\\frac{16^{x}}{8^{x-1}} = 4^{x+2}$",
        answers: ["$\\frac{3}{2}$", "$\\frac{5}{3}$", "$\\frac{7}{4}$", "$\\frac{9}{5}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(3a^2 b^{-3})^{-2} \\times (2a^{-1} b^2)^3}{(6a^{-2} b)^2}$",
        answers: ["$\\frac{8a^4}{27b^{14}}$", "$\\frac{27b^{14}}{8a^4}$", "$\\frac{8b^{14}}{27a^4}$", "$\\frac{27a^4}{8b^{14}}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If $2^{x} = 3^{y} = 6^{-z}$, express $\\frac{1}{x} + \\frac{1}{y}$ in terms of z",
        answers: ["z", "-z", "$\\frac{1}{z}$", "$-\\frac{1}{z}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{8^{0.5} \\times 16^{-\\frac{1}{4}}}{32^{\\frac{1}{5}}}\\right)^{10}$",
        answers: ["$\\frac{1}{4}$", "$\\frac{1}{2}$", "2", "4"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the value of $\\frac{5^{n+2} - 6 \\times 5^{n+1}}{9 \\times 5^n - 5^{n+1}}$",
        answers: ["1", "5", "-5", "$\\frac{5}{4}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If $x = 2^{\\frac{1}{3}} + 2^{-\\frac{1}{3}}$, what is $2x^3 - 6x$?",
        answers: ["3", "4", "5", "6"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(a^{2n+1} \\times a^{3-2n})^3}{(a^{n-2} \\times a^{5-n})^2}$",
        answers: ["$a^8$", "$a^{10}$", "$a^{12}$", "$a^{14}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Solve the equation $9 \\times 3^{x} = 4^{x} + 10 \\times 2^{x}$ for x",
        answers: ["0", "1", "2", "3"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If $5^{2x-y} = 100$ and $2^{x+y} = 32$, find $x^2 + y^2$",
        answers: ["5", "10", "13", "17"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{x^{a+b}}{x^{a-b}}\\right)^{\\frac{1}{2a}}} \\times \\left(\\frac{x^{2b}}{x^{-2a}}\\right)^{\\frac{1}{2b}}}$",
        answers: ["$x^{1+\\frac{a}{b}}$", "$x^{2}$", "$x^{1+\\frac{b}{a}}$", "$x^{\\frac{a+b}{ab}}$"],
        correctIndex: 0,
        videoSolution: ""
    }
], 
    4: [
    {
        text: "Simplify $\\frac{(3^{x+2} - 3^x)}{8 \\times 3^{x-1}}$ to its simplest form",
        answers: ["1", "$\\frac{3}{4}$", "$\\frac{9}{8}$", "3"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $2^{2x} - 3 \\times 2^{x+1} + 8 = 0$, find the value of x",
        answers: ["1", "2", "3", "4"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{16x^8 y^{-4}}{81x^{-6} y^{12}}\\right)^{-\\frac{1}{4}}$",
        answers: ["$\\frac{3y^4}{2x^{\\frac{7}{2}}}$", "$\\frac{2x^{\\frac{7}{2}}}{3y^4}$", "$\\frac{9y^8}{4x^7}$", "$\\frac{3x^{-\\frac{7}{2}}}{2y^{-4}}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the value of $\\frac{5^{n} + 5^{n+1} + 5^{n+2}}{31 \\times 5^{n-1}}$?",
        answers: ["5", "10", "25", "125"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Solve for x: $8^{x-1} = 16^{2x+1}$",
        answers: ["-$\\frac{7}{5}$", "-$\\frac{5}{7}$", "$\\frac{3}{5}$", "$\\frac{5}{3}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(a^{2n+3} \\times a^{4-3n})^2}{(a^{n-1} \\times a^{7-2n})^3}$",
        answers: ["$a^{-5}$", "$a^{-3}$", "$a^3$", "$a^5$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If $4^{x} = 8^{y}$, express y in terms of x",
        answers: ["$y = \\frac{2x}{3}$", "$y = \\frac{3x}{2}$", "$y = \\frac{x}{2}$", "$y = 2x$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is $\\frac{2^{x+3} + 2^{x+2} + 2^{x+1}}{2^{x-1}}$ simplified?",
        answers: ["7", "14", "28", "56"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{x^{-\\frac{1}{2}} y^{\\frac{2}{3}}}{x^{\\frac{1}{3}} y^{-\\frac{1}{4}}}\\right)^{12}$",
        answers: ["$x^{-14} y^{11}$", "$x^{14} y^{-11}$", "$x^{-10} y^7$", "$x^{10} y^{-7}$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find x if $9 \\times 3^x = 27^{x-1}$",
        answers: ["$\\frac{3}{2}$", "$\\frac{5}{2}$", "3", "5"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(2a^3 b^{-2})^{-3} \\times (3a^{-1} b)^2}{(6a^{-2} b^3)^{-1}}$",
        answers: ["$\\frac{3a^5}{8b^{11}}$", "$\\frac{8b^{11}}{3a^5}$", "$\\frac{3b^{11}}{8a^5}$", "$\\frac{8a^5}{3b^{11}}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If $5^{2x} = 10$, find the value of $5^{-x}$",
        answers: ["$\\frac{1}{\\sqrt{10}}$", "$\\sqrt{10}$", "$\\frac{1}{10}$", "10"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is $\\frac{3^{x+2} + 3^{x+1} + 3^x}{13 \\times 3^{x-1}}$ simplified?",
        answers: ["1", "3", "9", "13"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{27^{\\frac{1}{3}} \\times 16^{-\\frac{1}{4}}}{81^{\\frac{1}{4}}}\\right)^6$",
        answers: ["$\\frac{1}{9}$", "$\\frac{1}{3}$", "3", "9"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find x if $\\frac{8^x}{2^{x+1}} = 16^{x-1}$",
        answers: ["$\\frac{3}{2}$", "$\\frac{5}{3}$", "$\\frac{7}{4}$", "$\\frac{9}{5}$"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\frac{(x^{2a+b} \\times x^{a-2b})^3}{(x^{a-b} \\times x^{2a+b})^2}$",
        answers: ["$x^{a-4b}$", "$x^{2a-3b}$", "$x^{3a-8b}$", "$x^{5a-7b}$"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If $2^x = 3^y = 6^z$, prove that $\\frac{1}{z} = \\frac{1}{x} + \\frac{1}{y}$",
        answers: ["$xy = z(x+y)$", "$xz = y(x+z)$", "$yz = x(y+z)$", "$x+y+z=1$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is $\\frac{4^{x+1} - 2^{2x-1}}{3 \\times 2^{2x}}$ simplified?",
        answers: ["$\\frac{1}{2}$", "1", "$\\frac{3}{2}$", "2"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Simplify $\\left(\\frac{a^{\\frac{3}{2}} b^{-\\frac{1}{3}}}{a^{-\\frac{1}{4}} b^{\\frac{2}{3}}}\\right)^4 \\times \\left(\\frac{a^{-1} b}{a^2 b^{-2}}\\right)^{-1}$",
        answers: ["$a^7 b^{-6}$", "$a^{-7} b^6$", "$a^5 b^{-4}$", "$a^{-5} b^4$"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the value of $x$ if $\\frac{9^{x}}{27^{x-1}} = \\frac{1}{3}$",
        answers: ["$\\frac{1}{2}$", "$\\frac{3}{4}$", "$\\frac{5}{6}$", "$\\frac{7}{8}$"],
        correctIndex: 1,
        videoSolution: ""
    }
], 
    5: [
    {
        "text": "Simplify $\\frac{(2^{x+3} \\cdot 4^{x})}{8^{x-2}}$",
        "answers": ["$2^5$", "$2^7$", "$2^{4x+9}$", "$2^{3x+5}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(\\frac{9a^{-4}}{27a^{-1}}\\right)^{-2}$",
        "answers": ["$3a^{6}$", "$9a^{4}$", "$9a^{-4}$", "$3a^{-6}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $3^{x} = 81$, what is the value of $3^{x-2}$?",
        "answers": ["3", "9", "27", "81"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{x^{1/2}}{x^{-1/3}}\\right)^6$",
        "answers": ["$x^{5}$", "$x^{1}$", "$x^{4}$", "$x^{6}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is $\\left(\\frac{81x^8}{16y^{-4}}\\right)^{\\frac{1}{4}}$?",
        "answers": ["$\\frac{3x^2}{2y}$", "$\\frac{3x^2y}{2}$", "$\\frac{3x^2}{2y^2}$", "$\\frac{3x^2y^2}{2}$"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Solve for $x$ if $2^{2x} = 32$",
        "answers": ["2.5", "3", "4", "5"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{a^{-1}b^2}{a^2b^{-3}}\\right)^{-2}$",
        "answers": ["$a^6b^{-10}$", "$a^{-6}b^{10}$", "$a^4b^{-2}$", "$a^{-4}b^{2}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is $\\left(16^{3/4}\\right) \\div \\left(4^{1/2}\\right)$?",
        "answers": ["2", "4", "8", "16"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\frac{(x^{-2}y^3)^3}{(x^{-1}y)^2}$",
        "answers": ["$x^{-4}y^7$", "$x^{-5}y^8$", "$x^{-3}y^6$", "$x^{-4}y^6$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $5^x = 25$, find the value of $5^{x+1}$",
        "answers": ["125", "625", "100", "50"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{1}{x^{-3}y^2}\\right)^2$",
        "answers": ["$x^6y^4$", "$x^{-6}y^4$", "$x^3y^2$", "$x^{-3}y^{-2}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Find $x$ if $\\frac{2^x}{8^{x+1}} = 1$",
        "answers": ["-1", "0", "1", "2"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(27x^6\\right)^{1/3}$",
        "answers": ["$3x^2$", "$9x^3$", "$3x^3$", "$6x^2$"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{a^{3/2}}{b^{1/4}}\\right)^4$",
        "answers": ["$a^6b^{-1}$", "$a^5b^{-1}$", "$a^4b^{-1}$", "$a^6b^{-2}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is $\\left(\\frac{64a^{-6}}{81b^4}\\right)^{\\frac{1}{2}}$?",
        "answers": ["$\\frac{8a^{-3}}{9b^2}$", "$\\frac{8a^3}{9b^2}$", "$\\frac{8a^{-3}}{9b}$", "$\\frac{8a^3}{9b}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Solve: $9^{x+1} = 3^{2x+4}$",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{x^2y^{-1}}{x^{-3}y^4}\\right)^3$",
        "answers": ["$x^{15}y^{-15}$", "$x^{6}y^{-15}$", "$x^{6}y^{-3}$", "$x^{15}y^{-3}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $4^x = 8$, find $2^{2x}$",
        "answers": ["4", "8", "16", "32"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{3x^{-2}}{6x^3}\\right)^{-2}$",
        "answers": ["$4x^{10}$", "$2x^{10}$", "$4x^{-10}$", "$2x^{-10}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Find the value of $x$ if $\\left(\\frac{1}{4}\\right)^x = 8$",
        "answers": ["$-3/2$", "$-5/2$", "$-2$", "$-3$"],
        "correctIndex": 1,
        "videoSolution": ""
    }
]
, 
    6: [
    {
        "text": "Simplify $\\frac{2^{x+3} + 2^{x+2}}{2^{x-1}}$",
        "answers": ["28", "20", "24", "16"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $a^{x+1} = a^2 \\cdot a^{3x-4}$, find x",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{a^2 b^{-3}}{a^{-1} b^2}\\right)^{-2}$",
        "answers": ["$a^{-6}b^{10}$", "$a^{6}b^{-10}$", "$a^{3}b^{-1}$", "$a^{-3}b^1$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(\\frac{8x^6y^{-9}}{27x^3y^3}\\right)^{-\\frac{2}{3}}$",
        "answers": ["$\\frac{9x^2}{4y^8}$", "$\\frac{4y^8}{9x^2}$", "$\\frac{4x^2}{9y^8}$", "$\\frac{9y^8}{4x^2}$"],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "Find the value of x if $\\frac{5^{x+1}}{25^{x}} = 1$",
        "answers": ["0", "1", "2", "3"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{4x^{-2}y^3}{8x^3y^{-2}}\\right)^2$",
        "answers": ["$\\frac{y^{10}}{4x^{10}}$", "$\\frac{y^{8}}{4x^{10}}$", "$\\frac{y^{10}}{16x^{10}}$", "$\\frac{y^8}{16x^8}$"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If $3^x = 81$ and $3^y = 27$, find $3^{x-y}$",
        "answers": ["1", "3", "9", "27"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{16a^{-4}}{81b^2}\\right)^{\\frac{3}{4}}$",
        "answers": ["$\\frac{8a^{-3}}{27b^{3/2}}$", "$\\frac{8a^{-3}}{27b^{3}}$", "$\\frac{8a^{-3}}{9b^{3}}$", "$\\frac{8a^3}{27b^{3}}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "If $2^x = 4^{x+1}$, find x",
        "answers": ["1", "0", "-1", "2"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{x^{-2}y^3}{x^4y^{-1}}\\right)^{-3}$",
        "answers": ["$x^{18}y^{-12}$", "$x^{-18}y^{12}$", "$x^{6}y^{-12}$", "$x^{-6}y^{12}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is $\\left(\\frac{81x^{-8}}{16y^4}\\right)^{1/4}$?",
        "answers": ["$\\frac{3x^{-2}}{2y}$", "$\\frac{3x^2}{2y}$", "$\\frac{3x^{-2}}{2y^2}$", "$\\frac{3x^2}{2y^2}$"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If $x^{a+b} = x^3 \\cdot x^{-1}$, find $a + b$",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{27x^3}{64y^6}\\right)^{-\\frac{2}{3}}$",
        "answers": ["$\\frac{16y^4}{9x^2}$", "$\\frac{16y^6}{9x^2}$", "$\\frac{9x^2}{16y^4}$", "$\\frac{4x^2}{3y^2}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $3^{2x-1} = 27$, find $x$",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(\\frac{x^{-\\frac{3}{4}}y^{\\frac{1}{2}}}{x^{\\frac{1}{4}}y^{-\\frac{1}{4}}}\\right)^2$",
        "answers": ["$x^{-2}y^{1.5}$", "$x^{-2}y^{3/2}$", "$x^{-2}y^3$", "$x^2y^{-3/2}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{a^2b^{-1}}{a^{-3}b^2}\\right)^{-2}$",
        "answers": ["$a^{-10}b^{6}$", "$a^{10}b^{-6}$", "$a^{-5}b^1$", "$a^5b^{-1}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is $\\frac{(2^{x+2} + 2^{x})}{2^{x-2}}$ simplified?",
        "answers": ["20", "24", "28", "32"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Solve: $\\left(\\frac{1}{9}\\right)^{x} = 27$",
        "answers": ["-1", "-1.5", "-2", "-3"],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If $a^{3x} = a^9$, what is $x$?",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{x^{-2}y^5}{x^3y^{-1}}\\right)^{2}$",
        "answers": ["$x^{-10}y^{12}$", "$x^5y^{6}$", "$x^{-5}y^{12}$", "$x^5y^{-6}$"],
        "correctIndex": 2,
        "videoSolution": ""
    }
]
, 
    7: [
    {
        "text": "Simplify $\\frac{3^{2x} + 3^{x+1}}{3^{x}}$",
        "answers": ["$3^{x} + 3$", "$3^{x+1} + 1$", "$3^{x} + 3^{2}$", "$3^{x+1} + 3$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $2^x = 3^y = 6^z$, prove that $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{z}$. What is $z$ in terms of $x$ and $y$?",
        "answers": ["$z = \\frac{xy}{x+y}$", "$z = x + y$", "$z = \\frac{x+y}{xy}$", "$z = \\frac{x}{y}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(\\frac{x^{-\\frac{3}{2}} y^{\\frac{5}{3}}}{x^{\\frac{2}{3}} y^{-\\frac{1}{4}}}\\right)^6$",
        "answers": ["$x^{-13} y^{10.5}$", "$x^{-13} y^{31/2}$", "$x^{-13} y^{21/2}$", "$x^{-13} y^{11/2}$"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If $3^{x+2} + 3^{x+1} + 3^x = 39 \\times 3^x$, find the value of x",
        "answers": ["any x", "1", "2", "3"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{27^{1/3} \\cdot 16^{-1/4}}{81^{1/4}}\\right)^6$",
        "answers": ["$\\frac{1}{9}$", "$\\frac{1}{3}$", "$3$", "$\\frac{1}{27}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $5^{2x} = 125$, what is $5^{x-1}$?",
        "answers": ["$\\frac{1}{5}$", "$\\sqrt{5}$", "$5$", "$25$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{4a^{-3}b^{2}}{16a^{2}b^{-1}}\\right)^{-3/2}$",
        "answers": ["$2a^{7.5}b^{-4.5}$", "$8a^{7.5}b^{-4.5}$", "$8a^{-7.5}b^{4.5}$", "$2a^{-7.5}b^{4.5}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "If $x = \\log_2 81$, find the value of $2^{x/2}$",
        "answers": ["9", "81", "3", "√81"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(\\frac{x^{-2}y^3}{x^5y^{-2}}\\right)^{-2}$",
        "answers": ["$x^{14}y^{-10}$", "$x^{-14}y^{10}$", "$x^6y^{-5}$", "$x^{-6}y^{5}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{2^{2x+1}}{4^x}\\right)^2$",
        "answers": ["$2^2$", "$2^x$", "$2^{2x}$", "$2^4$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $2^x = 3$, express $8^{x+1}$ in terms of powers of 3",
        "answers": ["$3^6$", "$3^5$", "$9^x$", "$3^{3x+3}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Solve: $\\left(\\frac{1}{2}\\right)^x = 16$",
        "answers": ["4", "-4", "5", "-5"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "If $a^{2x+1} = a^3 \\cdot a^{4x-2}$, find x",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{x^{-\\frac{1}{3}}y^{\\frac{3}{4}}}{x^{\\frac{5}{6}}y^{-\\frac{1}{2}}}\\right)^6$",
        "answers": ["$x^{-7}y^{7.5}$", "$x^{-7}y^{7/2}$", "$x^{-2}y^{6}$", "$x^2y^{-6}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is $\\left(\\frac{a^3 b^{-2}}{a^{-2} b^5}\\right)^{-1/5}$?",
        "answers": ["$a^{-1}b^{1.4}$", "$a^{-1}b^{-1.4}$", "$a^1b^{1.4}$", "$a^1b^{-1.4}$"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "If $2^x = 5$ and $2^y = 25$, find $2^{x - 0.5y}$",
        "answers": ["1", "5", "√5", "25"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Evaluate $\\left(\\frac{1}{x^2y^{-3}}\\right)^3 \\cdot (x^3y)^2$",
        "answers": ["$x^0y^0$", "$x^{-1}y^5$", "$x^0y^5$", "$x^0y^2$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $9^x = 3$, find $x$",
        "answers": ["1/2", "1/3", "2", "3"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Simplify $\\left(\\frac{a^{-1/2}b^2}{a^{1/2}b^{-1}}\\right)^4$",
        "answers": ["$a^{-4}b^{12}$", "$a^4b^{12}$", "$a^{-4}b^{-12}$", "$a^4b^{-12}$"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If $x = \\log_4 8$, find $4^x$",
        "answers": ["8", "16", "√8", "2"],
        "correctIndex": 0,
        "videoSolution": ""
    }
]

};

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
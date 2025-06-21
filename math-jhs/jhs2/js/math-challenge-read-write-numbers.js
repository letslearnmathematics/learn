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
        text: "What is the place value of 5 in 3,502,417,896?",
        answers: ["Ones", "Tens", "Hundred millions", "Billions"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Write 4,000,300,020 in words",
        answers: [
        "Four billion three hundred thousand and twenty",
        "Four billion three million and twenty",
        "Four billion three hundred million and twenty",
        "Four million three hundred thousand and twenty"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which digit is in the billions place in 7,045,678,921?",
        answers: ["7", "0", "4", "5"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Write 'Two billion fifty million' in figures",
        answers: ["2,050,000", "2,050,000,000", "2,500,000,000", "2,005,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the place value of 8 in 1,208,456,709?",
        answers: ["Millions", "Ten millions", "Hundred millions", "Billions"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Write 9,080,000,015 in words",
        answers: [
        "Nine billion eight hundred million and fifteen",
        "Nine billion eighty million and fifteen",
        "Nine billion eight million and fifteen",
        "Nine billion eight hundred thousand and fifteen"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Identify the digit in the hundred millions place for 6,128,475,360",
        answers: ["6", "1", "2", "8"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Write 'Seven billion two hundred and one million' in figures",
        answers: ["7,201,000", "7,201,000,000", "7,210,000,000", "7,200,100,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the place value of 0 in 3,040,000,107?",
        answers: ["Ten millions", "Hundred millions", "Billions", "Millions"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Write 1,000,500,300 in words",
        answers: [
        "One billion five hundred thousand and three hundred",
        "One million five hundred thousand and three hundred",
        "One billion five million and three hundred",
        "One billion fifty thousand and three hundred"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the ten millions place in 5,842,136,709?",
        answers: ["8", "4", "2", "1"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Write 'Thirty billion forty million' in figures",
        answers: ["30,040,000", "30,400,000,000", "30,040,000,000", "3,040,000,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the place value of 3 in 12,006,450,318?",
        answers: ["Hundreds", "Tens", "Thousands", "Ten thousands"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Write 42,017,000,200 in words",
        answers: [
        "Forty-two billion seventeen million two hundred",
        "Forty-two million seventeen thousand two hundred",
        "Four billion two hundred seventeen million two hundred",
        "Forty-two billion one hundred and seven million two hundred"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Identify the digit in the millions place for 9,128,475,360",
        answers: ["1", "2", "8", "4"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Write 'Fifteen billion eighty million' in figures",
        answers: ["15,080,000,000", "15,800,000,000", "1,580,000,000", "15,008,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is the place value of 7 in 3,098,067,907?",
        answers: ["Hundreds", "Thousands", "Ten thousands", "Millions"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Write the numeric part of serial number GH20348765 in words",
        answers: [
        "Twenty million three hundred and forty-eight thousand seven hundred and sixty-five",
        "Two million thirty-four thousand eight hundred and sixty-five",
        "Two hundred and three million forty-eight thousand seven hundred and sixty-five",
        "Twenty-three million forty-eight thousand seven hundred and sixty-five"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit is in the hundred thousands place in 5,842,136,709?",
        answers: ["1", "3", "6", "7"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Write 'One billion eighty-six thousand' in figures",
        answers: ["1,086,000", "1,000,086,000", "1,000,860,000", "1,086,000,000"],
        correctIndex: 1,
        videoSolution: ""
    }
],
    2: [
    {
        "text": "What is the place value of 7 in 12,345,678,912?",
        "answers": ["Hundred millions", "Ten millions", "Millions", "Hundred thousands"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Write 5,060,700,080 in words",
        "answers": [
            "Five billion, sixty million, seven hundred thousand and eighty",
            "Five billion, six million, seven hundred thousand and eighty",
            "Five billion, sixty-seven million and eighty",
            "Five billion, sixty million, seventy thousand and eighty"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit is in the hundred millions place in 9,876,543,210?",
        "answers": ["8", "7", "6", "9"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write 'Seven billion, two hundred and one million, thirty-four thousand, five hundred and six' in figures",
        "answers": ["7,201,034,506", "7,210,345,006", "7,201,345,060", "7,021,034,506"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the place value of 0 in 4,050,600,300?",
        "answers": ["Hundred millions", "Ten millions", "Millions", "Hundred thousands"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write 12,006,450,318 in words",
        "answers": [
            "Twelve billion, six million, four hundred and fifty thousand, three hundred and eighteen",
            "Twelve billion, sixty million, four hundred and fifty thousand, three hundred and eighteen",
            "Twelve billion, six million, forty-five thousand, three hundred and eighteen",
            "Twelve billion, six million, four hundred and five thousand, three hundred and eighteen"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Identify the digit in the ten millions place for 3,128,475,360",
        "answers": ["1", "2", "8", "4"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write 'Twenty-three billion, four hundred and five million, six thousand, seven hundred and eight' in figures",
        "answers": ["23,405,006,708", "23,450,600,708", "23,405,060,708", "23,045,006,708"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the place value of 3 in 1,203,456,789?",
        "answers": ["Millions", "Ten millions", "Hundred thousands", "Hundred millions"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write 30,040,000,107 in words",
        "answers": [
            "Thirty billion, forty million, one hundred and seven",
            "Thirty billion, four million, one hundred and seven",
            "Three billion, forty million, one hundred and seven",
            "Thirty billion and forty million, one hundred and seven"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit is in the billions place in 15,842,136,709?",
        "answers": ["1", "5", "8", "4"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write 'One hundred and two billion, seven million, fifty thousand, nine hundred and one' in figures",
        "answers": ["102,007,050,901", "102,070,050,901", "100,207,050,901", "120,007,050,901"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the place value of 9 in 6,129,087,543?",
        "answers": ["Hundred thousands", "Millions", "Ten thousands", "Hundred millions"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write 7,503,618,942 in words",
        "answers": [
            "Seven billion, five hundred and three million, six hundred and eighteen thousand, nine hundred and forty-two",
            "Seven billion, five hundred and three million, six hundred and eighty-one thousand, nine hundred and forty-two",
            "Seven billion, fifty-three million, six hundred and eighteen thousand, nine hundred and forty-two",
            "Seven billion, five hundred and three million, sixteen thousand, nine hundred and forty-two"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Identify the digit in the hundred thousands place for 5,842,136,709",
        "answers": ["1", "3", "6", "7"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write 'Sixty billion, four hundred and twenty million, three thousand and eight' in figures",
        "answers": ["60,420,003,008", "60,402,003,008", "60,420,030,008", "6,420,003,008"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the place value of 2 in 3,098,067,907?",
        "answers": ["Hundreds", "Thousands", "Ten thousands", "Millions"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write the numeric part of serial number GH20348765 in words",
        "answers": [
            "Twenty million, three hundred and forty-eight thousand, seven hundred and sixty-five",
            "Two million, thirty-four thousand, eight hundred and sixty-five",
            "Two hundred and three million, forty-eight thousand, seven hundred and sixty-five",
            "Twenty-three million, forty-eight thousand, seven hundred and sixty-five"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit is in the ten thousands place in 5,842,136,709?",
        "answers": ["1", "3", "6", "7"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write 'One billion, eighty-six thousand and nineteen' in figures",
        "answers": ["1,000,086,019", "1,086,000,019", "1,000,860,019", "1,086,019"],
        "correctIndex": 0,
        "videoSolution": ""
    }
],
    3:[
    {
        text: "What is the place value of the underlined digit in 12,<u>0</u>45,600,000?",
        answers: ["Ten millions", "Hundred millions", "Billions", "Hundred thousands"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        "text": "Write 'A billion, twenty-three million, four hundred and five thousand and six' in figures.",
        "answers": [
            "1,023,405,006",
            "1,023,450,006",
            "1,230,405,006",
            "1,023,405,060"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit is in the *hundred thousands* place in 7,<u>0</u>50,<u>0</u>00,309?",
        "answers": ["0", "5", "3", "9"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write 9,007,000,500 in words.",
        "answers": [
            "Nine billion, seven million, five hundred",
            "Nine billion and seven million, five hundred",
            "Nine billion, seven hundred thousand, five hundred",
            "Nine billion, seven million and five hundred"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the correct numeral for 'Three hundred and six billion, eighty million, nine thousand and one'?",
        "answers": [
            "306,080,009,001",
            "306,800,009,001",
            "360,080,009,001",
            "306,080,090,001"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write the numeric part of currency serial number <strong>NG502<u>1</u>8743</strong> in words.",
        "answers": [
            "Five million, twenty-one thousand, eight hundred and forty-three",
            "Fifty million, twenty-one thousand, eight hundred and forty-three",
            "Five hundred and two million, one hundred and eighty-seven thousand, four hundred and thirty",
            "Five million, two hundred and eighteen thousand, seven hundred and forty-three"
        ],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which statement about 6,<u>0</u>00,450,300 is *false*?",
        "answers": [
            "The digit '6' represents six hundred million",
            "The '5' is in the ten thousands place",
            "The number has three zeros in the millions period",
            "The '3' is in the hundreds place"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write 'Four billion and five hundred thousand' in figures.",
        "answers": [
            "4,000,500,000",
            "4,500,000,000",
            "4,000,050,000",
            "4,000,005,000"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Identify the *incorrect* number-word pair:",
        "answers": [
            "8,002,000,600 → Eight billion, two million, six hundred",
            "3,040,000,107 → Three billion, forty million, one hundred and seven",
            "1,000,086,019 → One billion, eighty-six thousand and nineteen",
            "7,503,618,942 → Seven billion, five hundred and three million, six hundred and eighteen thousand, nine hundred and forty-two"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "The population of a country is 'Two billion, one hundred and five million, two thousand and eight'. How is this written in figures?",
        "answers": [
            "2,105,002,008",
            "2,150,002,008",
            "2,105,200,008",
            "2,105,020,008"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the place value of the *first* '0' in 10,<u>0</u>50,600,000?",
        "answers": ["Hundred millions", "Ten millions", "Millions", "Billions"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Write 1,000,000,001 in words.",
        "answers": [
            "One billion and one",
            "A billion, one",
            "One billion, one million and one",
            "One billion, one thousand and one"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit is in the *millions* place in 9,<u>0</u>87,<u>6</u>54,321?",
        "answers": ["0", "6", "8", "7"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Write 'Thirty-three billion, seven hundred and five' in figures.",
        "answers": [
            "33,000,000,705",
            "33,000,705,000",
            "33,700,000,005",
            "33,000,007,050"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "A banknote’s serial number is <strong>ZA3<u>0</u>210874</strong>. What is the place value of the underlined digit?",
        "answers": ["Millions", "Hundred thousands", "Ten thousands", "Thousands"],
        "correctIndex": 0,
        "videoSolution": ""
    }
], 
    4:[
    {
        "text": "Which of these is *not* equivalent to 4.56 billion?",
        "answers": [
            "4,560,000,000",
            "Four billion, five hundred and sixty million",
            "4,560 × 10⁶",
            "4,560 million"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "Convert all options to the same format (figures or words). Note: 4,560 × 10⁶ = 4,560,000,000, but 4.56 billion is 4,560,000,000."
    },
    {
        "text": "Write 'Seven trillion, eighty billion, four hundred and two thousand and fifteen' in figures.",
        "answers": [
            "7,080,402,015",
            "7,080,402,015,000",
            "7,080,000,402,015",
            "7,800,402,015"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "Trillions are 12 zeros (1,000,000,000,000). Check the placement of 'eighty billion' and 'four hundred and two thousand'."
    },
    {
        "text": "The distance to a star is 1.302 × 10¹² miles. How is this written in words?",
        "answers": [
            "One trillion, three hundred and two billion miles",
            "One trillion, three hundred and two million miles",
            "One billion, three hundred and two million miles",
            "One trillion, thirty-two billion miles"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "10¹² = 1 trillion. 1.302 × 10¹² = 1,302,000,000,000."
    },
    {
        "text": "Identify the error in this number: *'Three billion, fifty-six million, four thousand, two hundred and nine'* (written as 3,560,400,209).",
        "answers": [
            "Missing 'and' before 'two hundred'",
            "Incorrect comma placement",
            "'Four thousand' should be 'forty thousand'",
            "No error; it is correct"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "Compare the words to the numeral: 3,560,004,209 vs. 3,560,400,209."
    },
    {
        "text": "A country's GDP is £9.0072 × 10¹¹. How is this written in words?",
        "answers": [
            "Nine hundred billion, seven hundred and twenty million pounds",
            "Nine hundred billion and seventy-two million pounds",
            "Nine billion, seven hundred and twenty thousand pounds",
            "Nine hundred and seven billion, two hundred million pounds"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "10¹¹ = 100 billion. 9.0072 × 10¹¹ = 900,720,000,000."
    },
    {
        "text": "Which number is the *smallest*?",
        "answers": [
            "Four billion, five hundred and six million",
            "4,560,000,000",
            "4.506 × 10⁹",
            "4,506 million"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "Convert all to figures: A) 4,506,000,000; B) 4,560,000,000; C) 4,506,000,000; D) 4,506,000,000. Check for subtle differences."
    },
    {
        "text": "Write the serial number <strong>XE120<u>3</u>4509</strong> in words, focusing on the numeric part.",
        "answers": [
            "One hundred and twenty million, three hundred and forty-five thousand and nine",
            "Twelve million, thirty-four thousand, five hundred and nine",
            "One hundred and two million, three hundred and forty-five thousand and ninety",
            "Twelve million, three hundred and forty-five thousand and nine"
        ],
        "correctIndex": 3,
        "videoSolution": "",
        "hint": "Ignore the letters. The numeric part is 12,034,509."
    },
    {
        "text": "What is the place value of the *second* '7' in 7,<u>7</u>07,077,070?",
        "answers": [
            "Hundred millions",
            "Ten millions",
            "Millions",
            "Hundred thousands"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "Break down the number: 7,707,077,070. The second '7' is in the millions place."
    },
    {
        "text": "The population of a city is 'Four million, two hundred and six thousand, five hundred and nine'. Which numeral is *incorrect*?",
        "answers": [
            "4,260,509",
            "4,206,509",
            "4,200,000 + 6,000 + 500 + 9",
            "4,206,500 + 9"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "The correct figure is 4,206,509. Option A swaps 'six thousand' and 'two hundred thousand'."
    },
    {
        "text": "If 2.4 billion = 2,400,000,000, what is 0.006 billion in figures?",
        "answers": [
            "6,000,000",
            "600,000",
            "60,000,000",
            "6,000"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "0.006 billion = 0.006 × 1,000,000,000 = 6,000,000."
    }
], 
    5: [
    {
        "text": "Which is the correct British English wording for 15,003,020,100?",
        "answers": [
            "Fifteen billion, three million, twenty thousand, one hundred",
            "Fifteen billion and three million, twenty thousand and one hundred",
            "Fifteen billion, three million and twenty thousand, one hundred",
            "Fifteen billion, three million, twenty thousand and one hundred"
        ],
        "correctIndex": 3,
        "videoSolution": "",
        "hint": "British English requires 'and' before the last unit (one hundred). Commas separate other groups."
    },
    {
        "text": "Identify the error in this numeral: 'Ten billion, four hundred and two million, thirty thousand and five' written as 10,402,300,005.",
        "answers": [
            "Missing comma after 'billion'",
            "'Thirty thousand' should be 030,000 (three zeros)",
            "Extra zero in the millions place",
            "No error"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "The words specify 30,000 (not 300,000), so it should be 10,402,030,005."
    },
    {
        "text": "Write 'Seven billion and eighty-five thousand' in figures.",
        "answers": [
            "7,000,085,000",
            "7,085,000,000",
            "7,000,850,000",
            "7,000,080,500"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "'And' appears before the last unit (85,000), implying no millions component."
    },
    {
        "text": "What is the place value of the first '0' in 20,004,500,600?",
        "answers": [
            "Hundred millions",
            "Ten millions",
            "Millions",
            "Hundred thousands"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Breakdown: 20,004,500,600 → 20 (billion), 004 (million), 500 (thousand), 600 (units)."
    },
    {
        "text": "Which numeral matches 'Nine billion, nine hundred and ninety-nine thousand'?",
        "answers": [
            "9,000,999,000",
            "9,900,099,000",
            "9,000,099,900",
            "9,000,900,999"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "No millions mentioned, so millions place = 000."
    },
    {
        "text": "The numeric part of serial number GH25040078 is written in words as:",
        "answers": [
            "Twenty-five million, forty thousand and seventy-eight",
            "Two hundred and fifty million, four hundred thousand, seven hundred and eighty",
            "Two million, five hundred and four thousand and seventy-eight",
            "Twenty-five million and four thousand, seventy-eight"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "GH25040078 → 25,040,078. British English uses 'and' before the last unit."
    },
    {
        "text": "What is missing in this number: 'Twelve billion, five hundred million __ six hundred thousand, forty-two'?",
        "answers": [
            "The word 'and'",
            "A comma after 'million'",
            "The millions value (should be 500,006)",
            "Nothing is missing"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "British English requires 'and' before the last unit (forty-two), even with intermediate groups."
    },
    {
        "text": "Which digit is in the ten thousands place in 15,842,136,709?",
        "answers": [
            "1",
            "3",
            "6",
            "7"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "Breakdown: 15,842,136,709 → ...136,709 → '3' is in the ten thousands place."
    },
    {
        "text": "Write 3,000,010,002 in words.",
        "answers": [
            "Three billion, ten thousand and two",
            "Three billion and ten million and two",
            "Three billion, one hundred thousand and two",
            "Three billion, ten thousand, two"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "No millions component; 'and' precedes the last unit (two)."
    },
    {
        "text": "Identify the correct numeral for 'A billion, twenty-five million and eight'.",
        "answers": [
            "1,025,000,008",
            "1,250,000,008",
            "1,025,008,000",
            "1,000,025,008"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "'A billion' = 1,000,000,000; 'and eight' implies it's the last unit."
    }
], 
    6: [
    {
        "text": "Which version correctly writes 11,001,100,101 in British English words?",
        "answers": [
            "Eleven billion, one million, one hundred thousand, one hundred and one",
            "Eleven billion and one million, one hundred thousand and one hundred and one",
            "Eleven billion, one million, one hundred thousand and one hundred and one",
            "Eleven billion, one million and one hundred thousand, one hundred one"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "British English uses one 'and' only before the last unit (one hundred and one). Commas separate other groups."
    },
    {
        "text": "The number 20,040,030,007 has how many zeros in the millions period?",
        "answers": ["4", "3", "2", "1"],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "Breakdown: 20,040,030,007 → 040 (millions) has two zeros (between 4 and 3)."
    },
    {
        "text": "What is the smallest possible number matching '___ billion, ___ million, ___ thousand and ___' where blanks are single-digit words?",
        "answers": [
            "1,000,001,001",
            "1,001,001,001",
            "1,000,000,001",
            "1,001,000,001"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Fill blanks with smallest digits (1): 'one billion, one million, one thousand and one' = 1,001,001,001."
    },
    {
        "text": "Identify the incorrect digit in this numeral based on its words: 'Twelve billion, three hundred and four million, fifty thousand and six' written as 12,340,050,006.",
        "answers": [
            "The '4' should be '3'",
            "The '5' should be '0'",
            "The '0' before '50' should be '4'",
            "No error"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "'Three hundred and four million' = 304,000,000 (not 340,000,000). Correct numeral: 12,304,050,006."
    },
    {
        "text": "Write 'Nine billion and nine hundred' in figures.",
        "answers": [
            "9,000,000,900",
            "9,000,900,000",
            "9,900,000,000",
            "9,000,009,000"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "'And' before 'nine hundred' implies it's the last unit with no millions/thousands."
    },
    {
        "text": "Which digit in 15,000,600,300 changes if 'fifteen billion, six hundred thousand and three hundred' becomes 'fifteen billion, six million and three hundred'?",
        "answers": [
            "The fifth '0' from the left",
            "The seventh '0' from the left",
            "The '6'",
            "No change needed"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Original: 15,000,600,300 → New: 15,006,000,300. Fifth '0' (in millions place) becomes '6'."
    },
    {
        "text": "A serial number's numeric part (GH25040078) is written as 'Twenty-five million, forty thousand and seventy-eight'. If changed to 'Twenty-five million and forty thousand, seventy-eight', how does the numeral change?",
        "answers": [
            "No change (25,040,078)",
            "Becomes 25,000,040,078",
            "Becomes 25,400,078",
            "Loses a comma"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "The 'and' placement doesn't affect the numeral when word order is unchanged."
    },
    {
        "text": "What is the place value of the first '5' in 15,505,505,505?",
        "answers": [
            "Hundred millions",
            "Ten millions",
            "Millions",
            "Hundred thousands"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "Breakdown: 15,505,505,505 → The first '5' is in the ten millions place."
    },
    {
        "text": "Which number is written incorrectly in words?",
        "answers": [
            "10,100,100,100 → Ten billion, one hundred million, one hundred thousand and one hundred",
            "7,000,000,007 → Seven billion and seven",
            "3,030,030,030 → Three billion, thirty million, thirty thousand and thirty",
            "1,000,100,001 → One billion, one hundred thousand and one"
        ],
        "correctIndex": 3,
        "videoSolution": "",
        "hint": "Option D misses 'and' before 'one' (last unit). Should be '...and one'."
    },
    {
        "text": "Write the largest possible 10-digit number that can be formed from '___ billion, ___ hundred ___ty ___ million, ___ thousand and ___' (each blank is a single word).",
        "answers": [
            "9,999,999,999",
            "9,900,990,099",
            "9,999,900,999",
            "9,999,990,009"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Fill blanks with maximum values: 'nine billion, nine hundred ninety-nine million, nine hundred ninety-nine thousand and nine' = 9,999,999,999."
    }
], 
    7: [
    {
        "text": "Which phrasing is *incorrect* for 7,000,000,007?",
        "answers": [
            "Seven billion and seven",
            "Seven billion, seven",
            "Seven billion, zero million, zero thousand and seven",
            "Seven billion and zero million, zero thousand and seven"
        ],
        "correctIndex": 3,
        "videoSolution": "",
        "hint": "British English doesn't use 'and' before groups (like million/thousand), only before the last unit."
    },
    {
        "text": "The number 13,030,030,030 is written in words as 'Thirteen billion, thirty million, thirty thousand and thirty'. If you remove all commas from the words, how does the numeral change?",
        "answers": [
            "No change (commas in words don't affect the numeral)",
            "Becomes 1,303,003,003",
            "Loses its place value structure",
            "Requires hyphens between number words"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Commas in British English words are optional for separation; the numeral stays identical."
    },
    {
        "text": "What is the *minimum* number of words needed to correctly express 9,000,900,900 in British English?",
        "answers": ["7", "9", "11", "13"],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Optimal phrasing: 'Nine billion, nine hundred thousand, nine hundred' (7 words: nine + billion + nine + hundred + thousand + nine + hundred)."
    },
    {
        "text": "Identify the *correct* numeral for: 'A billion, twenty-three million, four hundred and five thousand, six hundred and seven' *without* using commas in the words.",
        "answers": [
            "1,023,405,607",
            "1,023,450,607",
            "1,230,405,607",
            "1,023,405,670"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Removing commas from words doesn't change the numeral. Verify place values: 'a billion' = 1,000,000,000."
    },
    {
        "text": "Which number has a '3' in the *hundred millions* place when written as 1,234,567,890 but a '0' in the same place when written in words as 'One billion, two hundred and thirty-four million, five hundred and sixty-seven thousand, eight hundred and ninety'?",
        "answers": [
            "1,034,567,890",
            "1,204,567,890",
            "1,230,567,890",
            "No such number exists"
        ],
        "correctIndex": 3,
        "videoSolution": "",
        "hint": "The words explicitly state 'two hundred and thirty-four million' (200,000,000 + 34,000,000), so the hundred millions digit must be 2."
    },
    {
        "text": "Write 'Nine billion, nine hundred and ninety-nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine' *without* using the word 'and'.",
        "answers": [
            "Nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine",
            "Nine billion, nine ninety-nine million, nine ninety-nine thousand, nine ninety-nine",
            "Nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine ninety-nine",
            "Invalid (British English requires 'and')"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "British English allows omitting 'and' except before the last unit, but the question specifies complete removal."
    },
    {
        "text": "If you change *one* digit in 12,345,678,900 to make it 'Twelve billion, three hundred and forty-five million, six hundred and seventy-eight thousand and nine', which digit changes?",
        "answers": [
            "The last '0' becomes '9'",
            "The '9' becomes '0'",
            "The '1' becomes '0'",
            "No single-digit change works"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "Original: 12,345,678,900 → Target: 12,345,678,009. Only the '9' needs to become '0'."
    },
    {
        "text": "What is unique about the British English wording of 8,888,888,888 compared to other 10-digit numbers?",
        "answers": [
            "It uses 'and' eight times",
            "Every digit is identical",
            "It requires hyphens in 'eight hundred and eighty-eight'",
            "It can't be written without repeating words"
        ],
        "correctIndex": 1,
        "videoSolution": "",
        "hint": "All digits are '8', making it the largest 10-digit number with identical digits."
    },
    {
        "text": "Which number's wording violates British English conventions?",
        "answers": [
            "1,000,000,001 → 'One billion and one'",
            "2,000,200,002 → 'Two billion, two hundred thousand and two'",
            "3,003,000,300 → 'Three billion and three million and three hundred'",
            "4,040,040,040 → 'Four billion, forty million, forty thousand and forty'"
        ],
        "correctIndex": 2,
        "videoSolution": "",
        "hint": "British English uses 'and' only before the last unit, not between groups like 'and three million'."
    },
    {
        "text": "Create the *smallest* 10-digit number possible using the phrase: '___ billion, ___ hundred ___ million, ___ thousand and ___' (each blank is a single word).",
        "answers": [
            "1,000,100,001",
            "1,100,000,001",
            "1,000,000,001",
            "1,010,000,001"
        ],
        "correctIndex": 0,
        "videoSolution": "",
        "hint": "Fill blanks minimally: 'one billion, one hundred zero million, one thousand and one' → 1,000,100,001."
    }
]
  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
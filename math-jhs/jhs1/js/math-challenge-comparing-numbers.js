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
        text: "Which number is greater: 5,678,901 or 5,678,910?",
        answers: ["5,678,901", "5,678,910", "They are equal", "Cannot compare"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare using the correct symbol: 1,234,567 ___ 1,234,576",
        answers: [">", "<", "=", "≠"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which number comes between 45,678,900 and 45,678,902?",
        answers: ["45,678,899", "45,678,901", "45,678,903", "45,678,905"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the value of the 7 in 87,654,321?",
        answers: ["7,000,000", "70,000,000", "700,000", "7,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count by 100 from 1,000,000 to the 5th term",
        answers: ["1,000,500", "1,005,000", "1,100,000", "1,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which is the smallest: 12,345,678; 12,345,687; or 12,345,768?",
        answers: ["12,345,678", "12,345,687", "12,345,768", "All equal"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 999,999,999 ___ 1,000,000,000",
        answers: [">", "<", "=", "≥"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What number is 10,000 more than 45,678,901?",
        answers: ["45,688,901", "45,678,911", "45,778,901", "46,678,901"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit in 987,654,321 has the highest place value?",
        answers: ["9", "8", "7", "1"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Skip count backwards by 1,000 from 10,000,000 to the 3rd term",
        answers: ["9,999,000", "9,997,000", "9,990,000", "9,700,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: 76,543,210; 76,543,201; 76,543,102",
        answers: [
            "76,543,210, 76,543,201, 76,543,102",
            "76,543,102, 76,543,201, 76,543,210",
            "76,543,201, 76,543,102, 76,543,210",
            "76,543,102, 76,543,210, 76,543,201"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 50,000 less than 100,000,000?",
        answers: ["99,950,000", "50,000,000", "95,000,000", "99,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 123,456,789 ___ 123,456,798",
        answers: [">", "<", "=", "≤"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which number is 100,000 more than 89,999,999?",
        answers: ["90,000,000", "90,099,999", "89,100,999", "90,999,999"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the place value of 4 in 345,678,912?",
        answers: ["Millions", "Ten Millions", "Hundred Millions", "Billions"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Skip count by 1,000,000 from 5,000,000 to the 4th term",
        answers: ["8,000,000", "9,000,000", "10,000,000", "20,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which is greater: 234,567,890 or 234,567,089?",
        answers: ["234,567,890", "234,567,089", "Equal", "Cannot determine"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What number is 1 less than 1,000,000,000?",
        answers: ["999,999,999", "999,999,990", "900,000,000", "99,999,999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 987,654,321 ___ 987,654,312",
        answers: [">", "<", "=", "≥"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit determines that 456,789,123 is greater than 456,789,113?",
        answers: ["2 (tens)", "1 (hundreds)", "3 (ones)", "9 (thousands)"],
        correctIndex: 0,
        videoSolution: ""
    }
    ],
    2: [
    {
        text: "Which number is 1 million less than 1 billion?",
        answers: ["999,999,999", "999,000,000", "900,000,000", "99,999,999"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare: 45,678,901 + 1,000,000 ___ 46,678,901",
        answers: [">", "<", "=", "≠"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the difference between 500,000,000 and 499,999,999?",
        answers: ["1", "10", "100", "1,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If you skip count by 10,000 from 12,345,678, what is the 5th term?",
        answers: ["12,385,678", "12,395,678", "12,845,678", "12,345,718"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which comparison is correct?",
        answers: [
            "123,456 < 123,465",
            "9,999,999 > 10,000,000",
            "78,901,234 = 78,910,234",
            "456,789,012 < 456,789,002"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What number makes this true? 987,654,32_ > 987,654,325",
        answers: ["4", "5", "6", "Any digit"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Round 456,789,123 to the nearest million",
        answers: ["456,000,000", "457,000,000", "460,000,000", "500,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "If A = 234,567,890 and B = 234,567,980, then:",
        answers: [
            "A > B by 90",
            "A < B by 90",
            "A = B",
            "A < B by 9"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 10,000,000 - 9,999,999?",
        answers: ["1", "10", "100", "1,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which digit change makes 67,890,123 < 67,890,023?",
        answers: [
            "Change the millions digit",
            "Change the ten-thousands digit",
            "Change the hundreds digit",
            "This is impossible"
        ],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "If you count backwards by 100,000 from 5,000,000, what's the 3rd term?",
        answers: ["4,800,000", "4,700,000", "4,900,000", "4,000,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which number is closest to 1 billion without reaching it?",
        answers: ["999,999,999", "999,999,990", "999,990,000", "990,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Complete: 345,678,901 < 345,678,9__ < 345,679,000",
        answers: ["00", "01", "10", "99"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is the smallest 9-digit number greater than 999,999,999?",
        answers: ["1,000,000,000", "999,999,990", "1,111,111,111", "900,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "If X = 123,456,789 and Y = 123,456,798, then X - Y =",
        answers: ["9", "-9", "19", "-19"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which interval would include 456,789,000 but not 456,790,000?",
        answers: [
            "456,780,000 to 456,789,999",
            "456,700,000 to 456,799,999",
            "456,789,000 to 456,789,999",
            "456,000,000 to 457,000,000"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "How many 10,000s are in 100,000,000?",
        answers: ["10", "100", "1,000", "10,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which comparison is false?",
        answers: [
            "1 billion > 999 million",
            "50 million < 500 million",
            "100,000 = 1 million",
            "25,000,000 > 24,999,999"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "If you add 1 to the largest 9-digit number, you get:",
        answers: [
            "The smallest 10-digit number",
            "1,000,000,000",
            "Both A and B",
            "An undefined number"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which number satisfies: 888,888,888 < ___ < 888,888,898",
        answers: ["888,888,889", "888,888,880", "888,888,900", "888,888,808"],
        correctIndex: 0,
        videoSolution: ""
    }
    ],
    3: [
    {
        "text": "What is 500 million less than 2 billion?",
        "answers": ["1,500,000,000", "1,000,000,000", "1,999,500,000", "1,500,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Compare: 123,456,789 + 1,000,000 ___ 124,456,789",
        "answers": [">", "<", "=", "≠"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "What is the difference between 1,000,000,000 and 999,999,999?",
        "answers": ["1", "10", "100", "1,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If you skip count by 100,000 from 50,000,000, what is the 4th term?",
        "answers": ["50,400,000", "50,300,000", "50,500,000", "50,600,000"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which comparison is correct?",
        "answers": [
            "250,000,000 > 249,999,999",
            "99,999,999 > 100,000,000",
            "456,789,012 = 456,789,021",
            "123,456,789 < 123,456,780"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What number makes this true? 765,432,10_ > 765,432,105",
        "answers": ["4", "5", "6", "Any digit"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Round 789,456,123 to the nearest ten million",
        "answers": ["780,000,000", "790,000,000", "789,000,000", "800,000,000"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "If A = 345,678,901 and B = 345,678,091, then:",
        "answers": [
            "A > B by 810",
            "A < B by 810",
            "A = B",
            "A > B by 900"
        ],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is 100,000,000 - 99,999,999?",
        "answers": ["1", "10", "100", "1,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit change makes 89,012,345 < 89,012,344?",
        "answers": [
            "Change the millions digit",
            "Change the ten-thousands digit",
            "Change the ones digit",
            "This is impossible"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If you count backwards by 1,000,000 from 10,000,000, what's the 3rd term?",
        "answers": ["8,000,000", "7,000,000", "9,000,000", "6,000,000"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which number is closest to 500 million without reaching it?",
        "answers": ["499,999,999", "499,999,990", "499,990,000", "490,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Complete: 678,901,234 < 678,901,2__ < 678,901,300",
        "answers": ["34", "35", "40", "99"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the smallest 8-digit number greater than 99,999,999?",
        "answers": ["100,000,000", "99,999,990", "100,000,001", "90,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If X = 987,654,321 and Y = 987,654,312, then X - Y =",
        "answers": ["9", "-9", "19", "-19"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which interval would include 123,456,700 but not 123,457,000?",
        "answers": [
            "123,456,000 to 123,456,999",
            "123,450,000 to 123,459,999",
            "123,456,700 to 123,456,799",
            "123,400,000 to 123,500,000"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "How many 100,000s are in 10,000,000?",
        "answers": ["10", "100", "1,000", "10,000"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which comparison is false?",
        "answers": [
            "1 billion > 999,999,999",
            "75 million < 750 million",
            "10,000 = 100,000",
            "30,000,000 > 29,999,999"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If you add 1 to the largest 8-digit number, you get:",
        "answers": [
            "The smallest 9-digit number",
            "100,000,000",
            "Both A and B",
            "An undefined number"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "Which number satisfies: 555,555,555 < ___ < 555,555,565",
        "answers": ["555,555,556", "555,555,550", "555,555,600", "555,555,506"],
        "correctIndex": 0,
        "videoSolution": ""
    }
    ],
    4: [
    {
        "text": "What is the sum of 1.75 billion and 325 million, expressed in millions?",
        "answers": ["2,075 million", "2,000 million", "2,100 million", "1,775 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Compare: (375 million × 4) ___ (1.5 billion ÷ 1)",
        "answers": [">", "<", "=", "≠"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If you subtract 18.5 million from 1.85 billion, what remains?",
        "answers": ["1,831,500,000", "1,830,000,000", "1,825,000,000", "1,800,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is 30% of 6.5 billion?",
        "answers": ["1.95 billion", "2.15 billion", "1.5 billion", "2.0 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which expression equals 750 million?",
        "answers": [
            "(1.5 billion ÷ 2) + (50 million × 0)",
            "(500 million × 2) - 250 million",
            "(2.25 billion ÷ 3) + 75 million",
            "All of the above"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "Round 4,629,753,186 to the nearest hundred million",
        "answers": ["4,600,000,000", "4,700,000,000", "4,630,000,000", "4,500,000,000"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "If A = 8.2 billion and B = 8,199,999,999, then A - B =",
        "answers": ["1", "10", "100", "1,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "How many times greater is 1.2 billion than 30 million?",
        "answers": ["40", "400", "4,000", "40,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which number is 15 million less than 3.3 billion?",
        "answers": ["3,285,000,000", "3,150,000,000", "3,285,000,000", "3,299,985,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If you divide 9.6 billion by 300, what is the result?",
        "answers": ["32 million", "320 million", "3.2 million", "320,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit in 7,654,321,098 has a place value of 10 million?",
        "answers": ["7", "6", "5", "4"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "What is the product of 450 million and 6?",
        "answers": ["2.7 billion", "27 billion", "270 million", "2.5 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If 2.4 billion = 24 × N, what is N?",
        "answers": ["10 million", "100 million", "1 billion", "10 billion"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which interval includes numbers from 2.1 billion to 2.3 billion, excluding 2.2 billion?",
        "answers": [
            "2,100,000,000 ≤ X < 2,200,000,000",
            "2,100,000,000 < X ≤ 2,300,000,000",
            "2,100,000,000 ≤ X ≤ 2,300,000,000, X ≠ 2,200,000,000",
            "2,200,000,000 < X ≤ 2,300,000,000"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If 5.4 billion is split equally among 6 countries, how much per country?",
        "answers": ["900 million", "90 million", "9 billion", "9 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the missing term: 3.6 billion, 3 billion, ___, 1.8 billion, 900 million?",
        "answers": ["2.4 billion", "2.7 billion", "2.1 billion", "1.5 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which is NOT equal to 1.25 billion?",
        "answers": [
            "1,250 million",
            "5/4 of 1 billion",
            "125 × 10 million",
            "1.5 billion - 500 million"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If a number is 1/8 of 12 billion, what is 25% of that number?",
        "answers": ["375 million", "3 billion", "300 million", "1.5 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which comparison is true?",
        "answers": [
            "1.8 billion + 300 million > 2.1 billion",
            "40% of 5 billion = 2 billion",
            "700 million × 4 < 2.8 billion",
            "All are true"
        ],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the next number in the pattern: 100 million, 1 billion, 10 billion, ___?",
        "answers": ["100 billion", "1 trillion", "50 billion", "20 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    }
    ],
    5: [
    {
        "text": "What is the sum of 4.25 billion and 1.75 billion, expressed in millions?",
        "answers": ["6,000 million", "5,000 million", "6,500 million", "5,500 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Compare: (1.8 billion ÷ 3) ___ (600 million × 1)",
        "answers": [">", "<", "=", "≠"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If you subtract 125.5 million from 2.5 billion, what remains?",
        "answers": ["2,374,500,000", "2,375,000,000", "2,365,000,000", "2,400,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is 45% of 8.4 billion?",
        "answers": ["3.78 billion", "3.5 billion", "4.0 billion", "3.25 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which expression equals 1.2 billion?",
        "answers": [
            "(3.6 billion ÷ 3) + (150 million × 2)",
            "(800 million × 2) - 400 million",
            "(4.8 billion ÷ 4) + 300 million",
            "All of the above"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "Round 8,472,635,921 to the nearest ten million",
        "answers": ["8,470,000,000", "8,500,000,000", "8,480,000,000", "8,400,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If A = 12.5 billion and B = 12,499,999,999, then A - B =",
        "answers": ["1", "10", "100", "1,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "How many times greater is 3.6 billion than 45 million?",
        "answers": ["80", "800", "8,000", "80,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which number is 75 million less than 4.8 billion?",
        "answers": ["4,725,000,000", "4,750,000,000", "4,725,000,000", "4,799,925,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If you divide 12.9 billion by 300, what is the result?",
        "answers": ["43 million", "430 million", "4.3 million", "4,300,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit in 9,876,543,210 has a place value of 100 million?",
        "answers": ["9", "8", "7", "6"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the product of 675 million and 8?",
        "answers": ["5.4 billion", "54 billion", "5.04 billion", "5.8 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If 7.2 billion = 72 × N, what is N?",
        "answers": ["10 million", "100 million", "1 billion", "10 billion"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which interval includes numbers from 3.15 billion to 3.45 billion, excluding 3.3 billion?",
        "answers": [
            "3,150,000,000 ≤ X < 3,300,000,000",
            "3,150,000,000 < X ≤ 3,450,000,000",
            "3,150,000,000 ≤ X ≤ 3,450,000,000, X ≠ 3,300,000,000",
            "3,300,000,000 < X ≤ 3,450,000,000"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If 8.1 billion is split equally among 9 countries, how much per country?",
        "answers": ["900 million", "90 million", "9 billion", "9 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the missing term: 4.8 billion, 4.2 billion, ___, 3 billion, 2.4 billion?",
        "answers": ["3.6 billion", "3.9 billion", "3.3 billion", "3.0 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which is NOT equal to 2.75 billion?",
        "answers": [
            "2,750 million",
            "11/4 of 1 billion",
            "275 × 10 million",
            "3 billion - 500 million"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If a number is 1/6 of 18 billion, what is 40% of that number?",
        "answers": ["1.2 billion", "3 billion", "1.5 billion", "1.8 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which comparison is true?",
        "answers": [
            "2.4 billion + 600 million > 3.1 billion",
            "35% of 6 billion = 2.1 billion",
            "900 million × 5 < 4.5 billion",
            "All are true"
        ],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the next number in the pattern: 250 million, 2.5 billion, 25 billion, ___?",
        "answers": ["250 billion", "2.5 trillion", "125 billion", "50 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    }
    ], 
    6: [
    {
        "text": "What is the sum of 7.8 billion and 9.25 billion, expressed in millions?",
        "answers": ["17,050 million", "16,500 million", "17,500 million", "16,050 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Compare: (2.7 billion ÷ 4.5) ___ (600 million × 1)",
        "answers": [">", "<", "=", "≠"],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If you subtract 375.25 million from 5.5 billion, what remains?",
        "answers": ["5,124,750,000", "5,125,000,000", "5,124,000,000", "5,125,750,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is 62.5% of 7.2 billion?",
        "answers": ["4.5 billion", "4.8 billion", "4.2 billion", "4.0 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which expression equals 2.4 billion?",
        "answers": [
            "(7.2 billion ÷ 3) + (300 million × 2)",
            "(1.5 billion × 2) - 600 million",
            "(9.6 billion ÷ 4) + 0 million",
            "All of the above"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "Round 12,845,372,619 to the nearest hundred million",
        "answers": ["12,800,000,000", "12,900,000,000", "12,850,000,000", "12,700,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If A = 24.8 billion and B = 24,799,999,999, then A - B =",
        "answers": ["1", "10", "100", "1,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "How many times greater is 5.4 billion than 36 million?",
        "answers": ["150", "15", "1,500", "150,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which number is 125 million less than 6.3 billion?",
        "answers": ["6,175,000,000", "6,150,000,000", "6,125,000,000", "6,200,000,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If you divide 18.6 billion by 400, what is the result?",
        "answers": ["46.5 million", "465 million", "4.65 million", "465,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit in 12,345,678,900 has a place value of 10 billion?",
        "answers": ["1", "2", "3", "4"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the product of 825 million and 12?",
        "answers": ["9.9 billion", "99 billion", "9.09 billion", "9.0 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If 14.4 billion = 144 × N, what is N?",
        "answers": ["10 million", "100 million", "1 billion", "10 billion"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which interval includes numbers from 4.85 billion to 5.15 billion, excluding 5 billion?",
        "answers": [
            "4,850,000,000 ≤ X < 5,000,000,000",
            "4,850,000,000 < X ≤ 5,150,000,000",
            "4,850,000,000 ≤ X ≤ 5,150,000,000, X ≠ 5,000,000,000",
            "5,000,000,000 < X ≤ 5,150,000,000"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If 10.8 billion is split equally among 12 countries, how much per country?",
        "answers": ["900 million", "90 million", "9 billion", "9 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the missing term: 6.3 billion, 5.6 billion, ___, 4.2 billion, 3.5 billion?",
        "answers": ["4.9 billion", "4.8 billion", "4.7 billion", "4.6 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which is NOT equal to 3.25 billion?",
        "answers": [
            "3,250 million",
            "13/4 of 1 billion",
            "325 × 10 million",
            "4 billion - 1 billion"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If a number is 1/8 of 24 billion, what is 30% of that number?",
        "answers": ["900 million", "3 billion", "1.5 billion", "1.8 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which comparison is true?",
        "answers": [
            "3.6 billion + 900 million > 4.6 billion",
            "37.5% of 8 billion = 3 billion",
            "1.1 billion × 4 < 4.4 billion",
            "All are true"
        ],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the next number in the pattern: 375 million, 3.75 billion, 37.5 billion, ___?",
        "answers": ["375 billion", "3.75 trillion", "187.5 billion", "75 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    }
    ], 
    7: [
    {
        "text": "What is 3.75 billion increased by 12.5%?",
        "answers": ["4.21875 billion", "4.5 billion", "4.125 billion", "4.3125 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If (4.8 billion ÷ 0.6) = (X × 800 million), what is X?",
        "answers": ["10", "100", "1", "0.1"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the difference between 18.9 billion and the product of 2.7 billion and 7?",
        "answers": ["0", "1 million", "100 million", "1 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which is greater: 37.5% of 12.8 billion or 5/8 of 7.68 billion?",
        "answers": ["They are equal", "37.5% of 12.8 billion", "5/8 of 7.68 billion", "Cannot be determined"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If 15 billion is divided in a 3:5 ratio, what is the larger share?",
        "answers": ["9.375 billion", "5.625 billion", "8.5 billion", "6.5 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is 1.44 billion expressed as a percentage of 18 billion?",
        "answers": ["8%", "12%", "6%", "10%"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which expression equals 7.2 billion?",
        "answers": [
            "(28.8 billion ÷ 4) + 0",
            "(1.8 billion × 4) + 0",
            "(10.8 billion × ⅔)",
            "All of the above"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If A = 5.6 billion and B = 5,599,999,999, then A - B =",
        "answers": ["1", "10", "100", "1,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "How many times greater is 6.3 billion than 42 million?",
        "answers": ["150", "15", "1,500", "15,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which number is 225 million more than 8.775 billion?",
        "answers": ["9 billion", "8.9 billion", "9.1 billion", "9.2 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If you divide 25.2 billion by 600, what is the result?",
        "answers": ["42 million", "420 million", "4.2 million", "420,000"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which digit in 45,678,901,234 has a place value of 50 billion?",
        "answers": ["4", "5", "6", "7"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "What is the product of 675 million and 16?",
        "answers": ["10.8 billion", "108 billion", "1.08 billion", "108 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "If 19.2 billion = 192 × N, what is N?",
        "answers": ["10 million", "100 million", "1 billion", "10 billion"],
        "correctIndex": 1,
        "videoSolution": ""
    },
    {
        "text": "Which interval includes numbers from 7.25 billion to 7.75 billion, excluding 7.5 billion?",
        "answers": [
            "7,250,000,000 ≤ X < 7,500,000,000",
            "7,250,000,000 < X ≤ 7,750,000,000",
            "7,250,000,000 ≤ X ≤ 7,750,000,000, X ≠ 7,500,000,000",
            "7,500,000,000 < X ≤ 7,750,000,000"
        ],
        "correctIndex": 2,
        "videoSolution": ""
    },
    {
        "text": "If 13.5 billion is split equally among 15 countries, how much per country?",
        "answers": ["900 million", "90 million", "9 billion", "9 million"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the missing term: 8.4 billion, 7.7 billion, ___, 6.3 billion, 5.6 billion?",
        "answers": ["7 billion", "6.8 billion", "6.5 billion", "6.2 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "Which is NOT equal to 4.5 billion?",
        "answers": [
            "4,500 million",
            "9/2 of 1 billion",
            "450 × 10 million",
            "5 billion - 1 billion"
        ],
        "correctIndex": 3,
        "videoSolution": ""
    },
    {
        "text": "If a number is 1/6 of 30 billion, what is 40% of that number?",
        "answers": ["2 billion", "1.5 billion", "1.8 billion", "2.5 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    },
    {
        "text": "What is the next number in the pattern: 625 million, 6.25 billion, 62.5 billion, ___?",
        "answers": ["625 billion", "6.25 trillion", "312.5 billion", "125 billion"],
        "correctIndex": 0,
        "videoSolution": ""
    }
]
  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
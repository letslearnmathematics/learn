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
        text: "Compare 45,678 and 45,768 using >, <, or =",
        answers: ["45,678 > 45,768", "45,678 = 45,768", "45,678 < 45,768", "Cannot compare"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which symbol makes this true: 123,456 __ 123,465?",
        answers: ["≥", "<", ">", "="],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare 999,999 and 1,000,000",
        answers: ["999,999 < 1,000,000", "999,999 > 1,000,000", "999,999 = 1,000,000", "None of these"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which is greater: 456,789 or 456,798?",
        answers: ["They are equal", "456,789", "456,798", "Cannot determine"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Compare 3,450,000 and 3,405,000",
        answers: ["3,450,000 < 3,405,000", "3,450,000 = 3,405,000", "None of these", "3,450,000 > 3,405,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which symbol makes this true: 78,901 __ 78,910?",
        answers: ["<", "≤", ">", "="],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare 12,345,678 and 12,345,687",
        answers: ["Cannot compare", "12,345,678 > 12,345,687", "12,345,678 = 12,345,687", "12,345,678 < 12,345,687"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which is smaller: 987,654 or 987,645?",
        answers: ["987,654", "They are equal", "Cannot determine", "987,645"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Compare 5,555,555 and 5,555,555",
        answers: ["5,555,555 = 5,555,555", "None of these", "5,555,555 < 5,555,555", "5,555,555 > 5,555,555"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which symbol makes this true: 100,001 __ 99,999?",
        answers: ["<", ">", "=", "≤"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare 23,456,789 and 23,456,798",
        answers: ["23,456,789 = 23,456,798", "23,456,789 < 23,456,798", "Cannot compare", "23,456,789 > 23,456,798"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which is greater: 345,678 or 345,687?",
        answers: ["345,678", "They are equal", "Cannot determine", "345,687"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Compare 9,999,999 and 10,000,000",
        answers: ["9,999,999 > 10,000,000", "9,999,999 = 10,000,000", "9,999,999 < 10,000,000", "None of these"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which symbol makes this true: 456,789 __ 456,798?",
        answers: ["<", "≥", ">", "="],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare 1,234,567 and 1,234,576",
        answers: ["Cannot compare", "1,234,567 < 1,234,576", "1,234,567 = 1,234,576", "1,234,567 > 1,234,576"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which is smaller: 876,543 or 876,534?",
        answers: ["876,543", "876,534", "They are equal", "Cannot determine"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare 6,666,666 and 6,666,666",
        answers: ["6,666,666 < 6,666,666", "None of these", "6,666,666 = 6,666,666", "6,666,666 > 6,666,666"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which symbol makes this true: 200,002 __ 199,999?",
        answers: ["<", "=", "≤", ">"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Compare 34,567,890 and 34,567,809",
        answers: ["Cannot compare", "34,567,890 > 34,567,809", "34,567,890 = 34,567,809", "34,567,890 < 34,567,809"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which is greater: 567,890 or 567,809?",
        answers: ["567,809", "Cannot determine", "They are equal", "567,890"],
        correctIndex: 3,
        videoSolution: ""
    }
],
    2: [
    {
        text: "Order these numbers from smallest to largest: 45,678, 45,768, 45,687",
        answers: ["45,687, 45,678, 45,768", "45,678, 45,687, 45,768", "45,678, 45,768, 45,687", "45,768, 45,687, 45,678"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 123,456, 123,465, 123,546",
        answers: ["123,546, 123,456, 123,465", "123,546, 123,465, 123,456", "123,456, 123,465, 123,546", "123,465, 123,456, 123,546"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which set is ordered from largest to smallest?",
        answers: ["999,999, 99,999, 9,999", "9,999, 99,999, 999,999", "999,999, 9,999, 99,999", "99,999, 9,999, 999,999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Order these numbers from largest to smallest: 456,789, 456,798, 456,879",
        answers: ["456,879, 456,798, 456,789", "456,798, 456,789, 456,879", "456,879, 456,789, 456,798", "456,789, 456,798, 456,879"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: 3,450,000, 3,405,000, 3,045,000",
        answers: ["3,045,000, 3,405,000, 3,450,000", "3,045,000, 3,450,000, 3,405,000", "3,450,000, 3,405,000, 3,045,000", "3,405,000, 3,045,000, 3,450,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which set is ordered from smallest to largest?",
        answers: ["78,091, 78,901, 78,910", "78,901, 78,910, 78,091", "78,910, 78,901, 78,091", "78,901, 78,091, 78,910"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Order these numbers from smallest to largest: 12,345,678, 12,345,687, 12,354,678",
        answers: ["12,354,678, 12,345,687, 12,345,678", "12,345,687, 12,345,678, 12,354,678", "12,345,678, 12,345,687, 12,354,678", "12,345,678, 12,354,678, 12,345,687"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 987,654, 987,645, 987,564",
        answers: ["987,645, 987,654, 987,564", "987,654, 987,564, 987,645", "987,564, 987,645, 987,654", "987,654, 987,645, 987,564"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which set is ordered from largest to smallest?",
        answers: ["5,555,555, 555,555, 55,555", "555,555, 5,555,555, 55,555", "5,555,555, 55,555, 555,555", "55,555, 555,555, 5,555,555"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Order these numbers from largest to smallest: 100,001, 99,999, 100,100",
        answers: ["100,001, 100,100, 99,999", "100,100, 99,999, 100,001", "99,999, 100,001, 100,100", "100,100, 100,001, 99,999"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: 23,456,789, 23,456,798, 23,465,789",
        answers: ["23,456,789, 23,465,789, 23,456,798", "23,456,789, 23,456,798, 23,465,789", "23,465,789, 23,456,798, 23,456,789", "23,456,798, 23,456,789, 23,465,789"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which set is ordered from smallest to largest?",
        answers: ["345,687, 345,678, 345,768", "345,768, 345,687, 345,678", "345,678, 345,768, 345,687", "345,678, 345,687, 345,768"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Order these numbers from largest to smallest: 9,999,999, 10,000,000, 9,900,000",
        answers: ["10,000,000, 9,999,999, 9,900,000", "9,999,999, 10,000,000, 9,900,000", "9,900,000, 9,999,999, 10,000,000", "10,000,000, 9,900,000, 9,999,999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 456,789, 456,798, 456,879",
        answers: ["456,879, 456,798, 456,789", "456,798, 456,789, 456,879", "456,879, 456,789, 456,798", "456,789, 456,798, 456,879"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which set is ordered from smallest to largest?",
        answers: ["1,234,567, 1,243,567, 1,234,576", "1,243,567, 1,234,576, 1,234,567", "1,234,567, 1,234,576, 1,243,567", "1,234,576, 1,234,567, 1,243,567"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Order these numbers from smallest to largest: 876,543, 876,534, 876,453",
        answers: ["876,453, 876,534, 876,543", "876,453, 876,543, 876,534", "876,534, 876,453, 876,543", "876,543, 876,534, 876,453"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: 6,666,666, 6,066,666, 6,666,066",
        answers: ["6,066,666, 6,666,066, 6,666,666", "6,066,666, 6,666,666, 6,666,066", "6,666,066, 6,066,666, 6,666,666", "6,666,666, 6,666,066, 6,066,666"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which set is ordered from largest to smallest?",
        answers: ["199,999, 200,002, 199,992", "200,002, 199,992, 199,999", "200,002, 199,999, 199,992", "200,002, 199,999, 199,992"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Order these numbers from largest to smallest: 34,567,890, 34,567,809, 34,568,790",
        answers: ["34,567,809, 34,567,890, 34,568,790", "34,567,890, 34,568,790, 34,567,809", "34,568,790, 34,567,809, 34,567,890", "34,568,790, 34,567,890, 34,567,809"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 567,890, 567,809, 567,980",
        answers: ["567,980, 567,809, 567,890", "567,980, 567,890, 567,809", "567,809, 567,890, 567,980", "567,890, 567,980, 567,809"],
        correctIndex: 1,
        videoSolution: ""
    }
],
    3: [
    {
        text: "What is 100,000 more than 45,678,921?",
        answers: ["45,778,921", "46,678,921", "55,678,921", "45,688,921"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 100,000 less than 123,456,789?",
        answers: ["123,446,789", "122,456,789", "123,356,789", "123,455,789"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find the number that is 500,000 more than 300,000",
        answers: ["305,000", "800,000", "350,000", "300,500"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 100,000 less than 1,000,000?",
        answers: ["900,000", "999,000", "990,000", "99,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,000,000 more than 45,678,921",
        answers: ["45,778,921", "45,688,921", "46,678,921", "55,678,921"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 500,000 less than 3,450,000?",
        answers: ["2,950,000", "2,450,000", "3,400,000", "3,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 100,000 more than 12,345,678",
        answers: ["12,445,678", "12,355,678", "12,345,778", "13,345,678"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 1,000,000 less than 987,654,321?",
        answers: ["987,653,321", "986,654,321", "987,554,321", "977,654,321"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 500,000 more than 5,555,555",
        answers: ["5,555,555", "5,655,555", "6,055,555", "5,565,555"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 100,000 less than 100,001?",
        answers: ["1", "99,001", "99,901", "901"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,000,000 more than 23,456,789",
        answers: ["23,456,889", "23,556,789", "33,456,789", "24,456,789"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "What is 500,000 less than 345,678?",
        answers: ["345,178", "340,678", "-154,322", "344,678"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find the number that is 100,000 more than 9,999,999",
        answers: ["9,999,999", "10,999,999", "10,099,999", "9,999,999"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 1,000,000 less than 456,789?",
        answers: ["456,788", "446,789", "-543,211", "455,789"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find the number that is 500,000 more than 1,234,567",
        answers: ["1,284,567", "1,234,567", "1,734,567", "1,334,567"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 100,000 less than 876,543?",
        answers: ["875,543", "776,543", "876,443", "866,543"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,000,000 more than 6,666,666",
        answers: ["16,666,666", "7,666,666", "6,766,666", "6,666,766"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 500,000 less than 200,002?",
        answers: ["200,001", "-299,998", "150,002", "199,502"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 100,000 more than 34,567,890",
        answers: ["34,567,990", "34,577,890", "34,667,890", "35,567,890"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 1,000,000 less than 567,890?",
        answers: ["566,890", "567,880", "557,890", "-432,110"],
        correctIndex: 3,
        videoSolution: ""
    }
],
    4: [
    {
        text: "What is 150,000 more than 45,678,921?",
        answers: ["45,688,921", "45,778,921", "45,828,921", "45,678,921"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 250,000 less than 123,456,789?",
        answers: ["123,206,789", "123,446,789", "123,456,539", "123,256,789"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 750,000 more than 300,000",
        answers: ["300,750", "1,050,000", "307,500", "375,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 150,000 less than 1,000,000?",
        answers: ["850,000", "998,500", "985,000", "150,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,500,000 more than 45,678,921",
        answers: ["45,688,921", "47,178,921", "45,678,921", "45,828,921"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 750,000 less than 3,450,000?",
        answers: ["3,000,000", "2,700,000", "2,450,000", "3,400,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 250,000 more than 12,345,678",
        answers: ["12,595,678", "13,345,678", "12,345,928", "12,355,678"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 1,500,000 less than 987,654,321?",
        answers: ["987,654,321", "986,154,321", "977,654,321", "987,554,321"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 750,000 more than 5,555,555",
        answers: ["5,565,555", "5,555,555", "6,305,555", "5,655,555"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 150,000 less than 100,001?",
        answers: ["-49,999", "99,851", "99,001", "85,001"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,250,000 more than 23,456,789",
        answers: ["23,456,889", "33,456,789", "24,706,789", "23,556,789"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 750,000 less than 345,678?",
        answers: ["344,678", "340,678", "-404,322", "345,178"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Find the number that is 150,000 more than 9,999,999",
        answers: ["10,149,999", "10,999,999", "9,999,999", "9,999,999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 1,250,000 less than 456,789?",
        answers: ["455,789", "-793,211", "446,789", "456,788"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 750,000 more than 1,234,567",
        answers: ["1,284,567", "1,234,567", "1,984,567", "1,334,567"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 250,000 less than 876,543?",
        answers: ["875,543", "866,543", "876,443", "626,543"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,750,000 more than 6,666,666",
        answers: ["6,766,666", "8,416,666", "16,666,666", "6,666,766"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 750,000 less than 200,002?",
        answers: ["200,001", "-549,998", "150,002", "199,502"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 250,000 more than 34,567,890",
        answers: ["34,577,890", "34,817,890", "35,567,890", "34,567,990"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 1,750,000 less than 567,890?",
        answers: ["557,890", "-1,182,110", "566,890", "567,880"],
        correctIndex: 1,
        videoSolution: ""
    }
],
 
    5: [
    {
        text: "Which of these is greater: 456,789,123 or 456,788,999?",
        answers: ["456,788,999", "456,789,123", "456,789,000", "456,700,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare: 999,999,999 ___ 1,000,000,000",
        answers: ["=", ">", "<", "None"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which of these is the smallest number?",
        answers: ["987,654,321", "987,654,123", "987,654,312", "987,655,000"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 123,456,789; 123,465,789; 123,456,798",
        answers: [
            "123,456,798; 123,456,789; 123,465,789",
            "123,456,789; 123,456,798; 123,465,789",
            "123,465,789; 123,456,798; 123,456,789",
            "123,456,789; 123,465,789; 123,456,798"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 500,000 more than 123,000,000?",
        answers: ["123,500,000", "124,000,000", "123,050,000", "123,005,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 100,000 less than 100,000,000?",
        answers: ["99,900,000", "99,000,000", "99,999,000", "100,099,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these pairs are equal?",
        answers: [
            "234,567,890 and 234,567,809",
            "456,000,000 and 456,000,000",
            "123,456,789 and 123,456,798",
            "500,500,500 and 500,505,000"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 750,000 less than 500,000?",
        answers: ["-250,000", "0", "250,000", "-750,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is missing in this ascending list? 234,567,809; ___ ; 234,567,890",
        answers: ["234,567,889", "234,567,888", "234,567,800", "234,567,879"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 500,000,000 ___ 499,500,000",
        answers: [">", "<", "=", "None"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 250,000 more than 876,543,210",
        answers: ["876,793,210", "876,543,460", "876,553,210", "876,783,210"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: 99,999,999; 100,000,000; 100,000,001",
        answers: [
            "100,000,000; 99,999,999; 100,000,001",
            "100,000,001; 100,000,000; 99,999,999",
            "99,999,999; 100,000,000; 100,000,001",
            "100,000,001; 99,999,999; 100,000,000"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 1,000,000 more than 999,000,000?",
        answers: ["1,000,000,000", "999,100,000", "999,999,999", "999,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these is true?",
        answers: [
            "234,567,890 < 234,567,809",
            "999,999,999 = 1,000,000,000",
            "1,000,000,000 > 999,999,999",
            "500,000,000 = 500,500,000"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which number is greatest?",
        answers: ["1,000,000,000", "999,999,999", "987,654,321", "876,543,210"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 500,000 less than 123,500,000?",
        answers: ["123,000,000", "123,499,500", "123,400,000", "123,450,000"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Compare: 123,456,789 ___ 123,456,788",
        answers: ["<", ">", "=", "None"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,500,000 more than 10,000,000",
        answers: ["11,500,000", "11,050,000", "10,015,000", "10,150,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these numbers is in the middle when arranged in ascending order: 456,789; 654,321; 567,890?",
        answers: ["654,321", "456,789", "567,890", "567,789"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 250,000 less than 123,456,789?",
        answers: ["123,206,789", "123,456,539", "123,206,788", "123,456,788"],
        correctIndex: 0,
        videoSolution: ""
    }
    ],


    6: [
    {
        text: "What is 1,250,000 more than 88,888,888?",
        answers: ["90,138,888", "88,888,988", "89,888,888", "89,138,888"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which number is greatest among the following?",
        answers: ["123,456,780", "123,456,789", "123,456,788", "123,456,700"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare: 500,500,500 ___ 500,505,000",
        answers: ["<", ">", "=", "None"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 750,000 less than 500,500,000?",
        answers: ["499,750,000", "500,000,000", "499,500,000", "499,250,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Arrange in ascending order: 345,678,912; 345,678,921; 345,679,000",
        answers: [
            "345,678,912; 345,679,000; 345,678,921",
            "345,678,912; 345,678,921; 345,679,000",
            "345,678,921; 345,678,912; 345,679,000",
            "345,679,000; 345,678,921; 345,678,912"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,000,000 less than 345,678,000",
        answers: ["344,678,000", "345,677,000", "344,778,000", "346,678,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 234,567,890 ___ 234,567,809",
        answers: ["<", ">", "=", "None"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which of these is the correct descending order?",
        answers: [
            "234,567,890; 234,567,809; 234,567,800",
            "234,567,800; 234,567,809; 234,567,890",
            "234,567,809; 234,567,800; 234,567,890",
            "234,567,809; 234,567,890; 234,567,800"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 500,000 more than 999,999,999?",
        answers: ["1,000,499,999", "1,000,999,999", "1,000,499,000", "1,000,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 750,000 more than 250,000",
        answers: ["1,000,000", "500,000", "750,000", "1,050,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 1,750,000 less than 1,500,000?",
        answers: ["-250,000", "250,000", "-1,250,000", "-1,750,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 250,000 more than 1,999,999",
        answers: ["2,249,999", "2,000,000", "2,099,999", "2,499,999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 876,543,210 ___ 876,543,200",
        answers: ["=", "<", ">", "None"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Arrange these in ascending order: 88,888,888; 89,888,888; 87,888,888",
        answers: [
            "87,888,888; 88,888,888; 89,888,888",
            "89,888,888; 88,888,888; 87,888,888",
            "88,888,888; 89,888,888; 87,888,888",
            "88,888,888; 87,888,888; 89,888,888"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 1,500,000 more than 98,500,000?",
        answers: ["99,000,000", "100,000,000", "100,000,500", "100,000,000"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Which is smaller: 987,654,321 or 987,564,321?",
        answers: ["987,564,321", "987,654,321", "They are equal", "Can't tell"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Find the number that is 100,000 more than 45,578,921",
        answers: ["45,678,921", "45,588,921", "45,679,921", "45,578,931"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number comes last when arranged in descending order: 765,432,000; 765,432,100; 765,432,001",
        answers: ["765,432,100", "765,432,000", "765,432,001", "765,432,999"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 500,000 less than 100,500,000?",
        answers: ["100,000,000", "99,500,000", "100,499,000", "101,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of these numbers is equal to 234,567,890?",
        answers: ["234,567,089", "234,567,890", "234,576,890", "234,567,098"],
        correctIndex: 1,
        videoSolution: ""
    }
    ], 
    
    7: [
    {
        text: "Which number is the greatest: 1,000,000,000; 999,999,999; 987,654,321?",
        answers: ["999,999,999", "987,654,321", "1,000,000,000", "987,654,322"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is 1,500,000 less than 1,000,000?",
        answers: ["-500,000", "500,000", "-1,000,000", "1,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 345,600,000; 345,660,000; 345,606,000",
        answers: [
            "345,660,000; 345,606,000; 345,600,000",
            "345,600,000; 345,606,000; 345,660,000",
            "345,660,000; 345,600,000; 345,606,000",
            "345,606,000; 345,660,000; 345,600,000"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 2,000,000 more than 998,000,000?",
        answers: ["1,000,000,000", "1,998,000,000", "1,000,000,001", "1,000,000,002"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Compare: 345,678,000 ___ 345,678,000",
        answers: ["<", ">", "=", "None"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which of these is the correct ascending order?",
        answers: [
            "87,654,321; 87,655,321; 87,654,322",
            "87,654,321; 87,654,322; 87,655,321",
            "87,654,322; 87,655,321; 87,654,321",
            "87,655,321; 87,654,321; 87,654,322"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Which of the following is NOT equal to 123,456,789?",
        answers: ["123,456,789", "123,456,788 + 1", "123,456,780 + 9", "123,456,788"],
        correctIndex: 3,
        videoSolution: ""
    },
    {
        text: "Find the number that is 1,750,000 more than 998,250,000",
        answers: ["1,000,000,000", "1,000,000,001", "1,000,000,250", "1,000,000,500"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 2,500,000 less than 2,000,000?",
        answers: ["-500,000", "-2,000,000", "500,000", "0"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number is smallest among these?",
        answers: ["555,555,555", "555,555,550", "555,555,500", "555,555,505"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Arrange in descending order: 345,345,345; 354,354,354; 435,435,435",
        answers: [
            "435,435,435; 354,354,354; 345,345,345",
            "345,345,345; 354,354,354; 435,435,435",
            "354,354,354; 435,435,435; 345,345,345",
            "435,435,435; 345,345,345; 354,354,354"
        ],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "What is 500,000 more than 1,000,000,000?",
        answers: ["1,000,500,000", "1,000,000,500", "1,050,000,000", "1,005,000,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which of the following gives a difference of exactly 100,000?",
        answers: ["123,456,789 and 123,556,789", "123,456,789 and 123,457,789", "123,456,789 and 123,466,789", "123,456,789 and 123,456,689"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Compare: 888,888,888 ___ 888,888,889",
        answers: ["=", ">", "<", "None"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Which of these is an incorrect comparison?",
        answers: [
            "234,567,890 > 234,567,809",
            "1,000,000,000 < 999,999,999",
            "500,500,500 < 500,505,000",
            "123,456,789 = 123,456,789"
        ],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "What is 3,000,000 less than 2,500,000?",
        answers: ["-500,000", "500,000", "-3,000,000", "-2,500,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Find the number that is 999,999 more than 1",
        answers: ["1,000,000", "999,999", "2", "1,000,001"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which pair of numbers are equal?",
        answers: [
            "345,678,900 and 345,678,909",
            "100,000,000 and 99,999,999",
            "876,543,210 and 876,543,210",
            "345,678,901 and 345,678,900"
        ],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "What is the result of 123,456,789 minus 500,000?",
        answers: ["122,956,789", "123,956,789", "122,956,788", "124,456,789"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Which number fits: 987,654,321 ___ 987,655,321?",
        answers: [">", "<", "=", "None"],
        correctIndex: 1,
        videoSolution: ""
    }
    ]

};

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
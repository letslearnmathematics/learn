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
        text: "Express 45,678 to 3 significant figures",
        answers: ["45,600", "45,670", "45,700", "45,680"],
        correctIndex: 2,
        videoSolution: ""
    },
    {
        text: "Express 0.0342567 to 5 significant figures",
        answers: ["0.034256", "0.034257", "0.03426", "0.034255"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.0023456 to 2 significant figures",
        answers: ["0.0023", "0.0024", "0.00234", "0.00235"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 987.654 to 4 significant figures",
        answers: ["987.6", "987.7", "987.65", "987.66"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 39.9748 km to 3 significant figures",
        answers: ["39.9", "40.0", "39.97", "39.98"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 2.71828 to 2 decimal places",
        answers: ["2.71", "2.72", "2.718", "2.70"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 15.9876 to 3 decimal places",
        answers: ["15.987", "15.988", "15.9876", "15.980"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.12345 to 4 decimal places",
        answers: ["0.1234", "0.1235", "0.12345", "0.12346"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 98.7654 to 1 decimal place",
        answers: ["98.7", "98.8", "98.77", "98.76"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 7.65432 to 4 decimal places",
        answers: ["7.6543", "7.6544", "7.65432", "7.6540"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 3560 to 5 significant figures",
        answers: ["35,600", "3,560.0", "35,600.0", "3,560"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.0043216 to 5 significant figures",
        answers: ["0.0043216", "0.0043217", "0.004322", "0.004321"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 356.07 to 5 significant figures",
        answers: ["356.07", "356.08", "356.070", "356.1"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 4687.02 to 5 significant figures",
        answers: ["4,687.0", "4,687.02", "4,687.1", "4,687.020"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 5.6789 to 2 decimal places",
        answers: ["5.67", "5.68", "5.678", "5.679"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.004321 to 3 decimal places",
        answers: ["0.004", "0.00432", "0.0043", "0.004321"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 123.456789 to 4 decimal places",
        answers: ["123.4567", "123.4568", "123.45679", "123.4560"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.99999 to 3 decimal places",
        answers: ["1.000", "0.999", "1.00", "0.9999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 12.34567 to 1 decimal place",
        answers: ["12.3", "12.4", "12.34", "12.35"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 100.005 to 4 significant figures",
        answers: ["100.0", "100.01", "100.00", "100.005"],
        correctIndex: 0,
        videoSolution: ""
    }
],
    2: [
    {
        text: "Express 12,345,678 to 4 significant figures",
        answers: ["12,350,000", "12,340,000", "12,345,000", "12,346,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.00056789 to 3 significant figures",
        answers: ["0.000568", "0.000567", "0.0005678", "0.0005679"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 987.65432 to 5 decimal places",
        answers: ["987.65432", "987.65431", "987.65433", "987.65430"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.999995 to 4 decimal places",
        answers: ["1.0000", "0.9999", "1.000", "0.99999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 50,505 to 3 significant figures",
        answers: ["50,500", "50,600", "50,510", "50,505"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.123456 to 4 significant figures",
        answers: ["0.1235", "0.1234", "0.12346", "0.12345"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 9.87654 to 1 decimal place",
        answers: ["9.9", "9.8", "9.87", "9.88"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 100.0049 to 5 significant figures",
        answers: ["100.00", "100.005", "100.01", "100.0049"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.00009999 to 2 significant figures",
        answers: ["0.00010", "0.000099", "0.0001", "0.000100"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 55.5555 to 3 decimal places",
        answers: ["55.556", "55.555", "55.5555", "55.5556"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 1234.5678 to 2 significant figures",
        answers: ["1,200", "1,230", "1,234", "1,235"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.333333 to 5 decimal places",
        answers: ["0.33333", "0.33334", "0.33330", "0.333333"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 909.909 to 4 significant figures",
        answers: ["909.9", "909.91", "910.0", "909.909"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.050505 to 3 decimal places",
        answers: ["0.051", "0.050", "0.0505", "0.0506"],
        correctIndex: 1, // corrected from 2
        videoSolution: ""
    },
    {
        text: "Express 1,000,001 to 3 significant figures",
        answers: ["1,000,000", "1,000,001", "1,000,100", "1,001,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.70710678 to 4 decimal places",
        answers: ["0.7071", "0.7072", "0.7070", "0.70711"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 2020.2020 to 5 significant figures",
        answers: ["2,020.2", "2,020.20", "2,020.3", "2,020.202"],
        correctIndex: 0, // corrected from 1
        videoSolution: ""
    },
    {
        text: "Express 0.00040404 to 2 decimal places",
        answers: ["0.00", "0.000", "0.0004", "0.00040"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 3.1415926535 to 6 decimal places",
        answers: ["3.141593", "3.141592", "3.141590", "3.141600"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 99.9999 to 3 significant figures",
        answers: ["100", "100.0", "99.9", "99.99"],
        correctIndex: 0,
        videoSolution: ""
    }
],
    3: [
    {
        text: "Express 12,345,678 to 4 significant figures",
        answers: ["12,350,000", "12,340,000", "12,345,000", "12,346,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.00056789 to 3 significant figures",
        answers: ["0.000568", "0.000567", "0.0005678", "0.0005679"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 987.65432 to 5 decimal places",
        answers: ["987.65432", "987.65431", "987.65433", "987.65430"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.999995 to 4 decimal places",
        answers: ["1.0000", "0.9999", "1.000", "0.99999"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 50,505 to 3 significant figures",
        answers: ["50,500", "50,600", "50,510", "50,505"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.123456 to 4 significant figures",
        answers: ["0.1235", "0.1234", "0.12346", "0.12345"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 9.87654 to 1 decimal place",
        answers: ["9.9", "9.8", "9.87", "9.88"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 100.0049 to 5 significant figures",
        answers: ["100.00", "100.005", "100.01", "100.0049"],
        correctIndex: 1,
        videoSolution: ""
    },
    {
        text: "Express 0.00009999 to 2 significant figures",
        answers: ["0.00010", "0.000099", "0.0001", "0.000100"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 55.5555 to 3 decimal places",
        answers: ["55.556", "55.555", "55.5555", "55.5556"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 1234.5678 to 2 significant figures",
        answers: ["1,200", "1,230", "1,234", "1,235"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.333333 to 5 decimal places",
        answers: ["0.33333", "0.33334", "0.33330", "0.333333"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 909.909 to 4 significant figures",
        answers: ["909.9", "909.91", "910.0", "909.909"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.050505 to 3 decimal places",
        answers: ["0.051", "0.050", "0.0505", "0.0506"],
        correctIndex: 1, // corrected from 2
        videoSolution: ""
    },
    {
        text: "Express 1,000,001 to 3 significant figures",
        answers: ["1,000,000", "1,000,001", "1,000,100", "1,001,000"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 0.70710678 to 4 decimal places",
        answers: ["0.7071", "0.7072", "0.7070", "0.70711"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 2020.2020 to 5 significant figures",
        answers: ["2,020.2", "2,020.20", "2,020.3", "2,020.202"],
        correctIndex: 0, // corrected from 1
        videoSolution: ""
    },
    {
        text: "Express 0.00040404 to 2 decimal places",
        answers: ["0.00", "0.000", "0.0004", "0.00040"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 3.1415926535 to 6 decimal places",
        answers: ["3.141593", "3.141592", "3.141590", "3.141600"],
        correctIndex: 0,
        videoSolution: ""
    },
    {
        text: "Express 99.9999 to 3 significant figures",
        answers: ["100", "100.0", "99.9", "99.99"],
        correctIndex: 0,
        videoSolution: ""
    }
], 
    4: [
    {
        text: "Express 123,456.789 to 5 significant figures",
        answers: ["123,460", "123,450", "123,456.7", "123,456.8"],
        correctIndex: 0,
        videoSolution: "Round the 6 up to 7 because the next digit (8) is ≥5"
    },
    {
        text: "Express 0.0005000049 to 4 significant figures",
        answers: ["0.0005000", "0.0005001", "0.00050000", "0.000500005"],
        correctIndex: 0,
        videoSolution: "Keep four significant digits including the trailing zero"
    },
    {
        text: "Express 987.6543219 to 6 decimal places",
        answers: ["987.654322", "987.654321", "987.6543210", "987.6543219"],
        correctIndex: 0,
        videoSolution: "Round up the last digit because the next digit (9) is ≥5"
    },
    {
        text: "Express 9.9999995 to 4 decimal places",
        answers: ["10.0000", "9.9999", "10.000", "9.99999"],
        correctIndex: 0,
        videoSolution: "The sequence of 9s causes a cascade rounding to 10.0000"
    },
    {
        text: "Express 2024.20245 to 6 significant figures",
        answers: ["2,024.20", "2,024.203", "2,024.2025", "2,024.2024"],
        correctIndex: 0, // corrected
        videoSolution: "The fifth significant figure (4) rounds up because next digit is 5"
    },
    {
        text: "Express 0.01010101 to 5 decimal places",
        answers: ["0.010101", "0.010102", "0.01010", "0.0101010"],
        correctIndex: 2, // corrected
        videoSolution: "No rounding needed as the sixth decimal is 1 (<5)"
    },
    {
        text: "Express 100.00049 to 7 significant figures",
        answers: ["100.0005", "100.0004", "100.00049", "100.000490"],
        correctIndex: 0,
        videoSolution: "The sixth significant figure (4) rounds up because next digit is 9"
    },
    {
        text: "Express 0.00999995 to 3 significant figures",
        answers: ["0.0100", "0.00999", "0.01000", "0.009999"],
        correctIndex: 0,
        videoSolution: "The sequence of 9s causes rounding to 0.0100"
    },
    {
        text: "Express 77.777775 to 5 decimal places",
        answers: ["77.77778", "77.77777", "77.777775", "77.777780"],
        correctIndex: 0,
        videoSolution: "Round the fifth 7 up to 8 because next digit is 5"
    },
    {
        text: "Express 1,234,567.89 to 4 significant figures",
        answers: ["1,235,000", "1,234,000", "1,234,500", "1,234,600"],
        correctIndex: 0,
        videoSolution: "The fourth digit (5) rounds up because next digit is 6"
    },
    {
        text: "Express 0.6666665 to 6 decimal places",
        answers: ["0.666667", "0.666666", "0.6666665", "0.6666660"],
        correctIndex: 0,
        videoSolution: "Round up the sixth 6 because next digit is 5"
    },
    {
        text: "Express 500.00049 to 7 significant figures",
        answers: ["500.0005", "500.0004", "500.00049", "500.000490"],
        correctIndex: 0,
        videoSolution: "The sixth significant figure (4) rounds up because next digit is 9"
    },
    {
        text: "Express 0.0001234567 to 5 decimal places",
        answers: ["0.00012", "0.00012346", "0.000123457", "0.00012345"],
        correctIndex: 1,
        videoSolution: "Count decimal places after leading zeros"
    },
    {
        text: "Express 999.9995 to 4 significant figures",
        answers: ["1,000", "999.9", "1,000.0", "999.99"],
        correctIndex: 2,
        videoSolution: "The sequence of 9s rounds up to 1000.0 (keeping 4 sig figs)"
    },
    {
        text: "Express 0.123456789 to 7 decimal places",
        answers: ["0.1234568", "0.1234567", "0.12345679", "0.12345678"],
        correctIndex: 0,
        videoSolution: "Round the seventh digit (7) up because next digit is 8"
    },
    {
        text: "Express 123.456789 to 8 significant figures",
        answers: ["123.45679", "123.45678", "123.456789", "123.4567890"],
        correctIndex: 0,
        videoSolution: "The eighth significant figure (8) rounds up because next digit is 9"
    },
    {
        text: "Express 0.000099999 to 4 significant figures",
        answers: ["0.0001000", "0.00009999", "0.00010000", "0.000099999"],
        correctIndex: 0,
        videoSolution: "The sequence of 9s rounds up to 0.0001000"
    },
    {
        text: "Express 888.888888 to 7 decimal places",
        answers: ["888.8888880", "888.888888", "888.8888889", "888.8888888"],
        correctIndex: 1,
        videoSolution: "Exact to 7 decimal places already"
    },
    {
        text: "Express 1,000.00049 to 8 significant figures",
        answers: ["1,000.0005", "1,000.0004", "1,000.00049", "1,000.000490"],
        correctIndex: 0,
        videoSolution: "The seventh significant figure (4) rounds up because next digit is 9"
    },
    {
        text: "Express 0.5555555 to 6 decimal places",
        answers: ["0.555556", "0.555555", "0.5555555", "0.5555550"],
        correctIndex: 0,
        videoSolution: "Round the sixth 5 up to 6 because next digit is 5"
    }
], 
    5: [
    {
        text: "Express 1,234,567.8901 to 6 significant figures",
        answers: ["1,234,570", "1,234,567.9", "1,234,567.89", "1,234,567.890"],
        correctIndex: 0,
        videoSolution: "The 6th digit (6) remains unchanged as next digit (7) is ≥5"
    },
    {
        text: "Express 0.000123456789 to 7 decimal places",
        answers: ["0.0001234568", "0.0001234567", "0.00012345679", "0.00012345678"],
        correctIndex: 0,
        videoSolution: "Count decimal places after leading zeros and round up the 8th digit"
    },
    {
        text: "Express 999.999999 to 5 decimal places",
        answers: ["999.99999", "1,000.00000", "999.999999", "1,000.0000"],
        correctIndex: 1,
        videoSolution: "Cascading rounding converts all 9s to 0s and increases the whole number"
    },
    {
        text: "Express 12,345,678.901 to 4 decimal places",
        answers: ["12,345,678.9010", "12,345,678.901", "12,345,678.9009", "12,345,678.9000"],
        correctIndex: 0,
        videoSolution: "Exact to 3 decimal places, add zero for 4th decimal place"
    },
    {
        text: "Express 0.0004999995 to 5 significant figures",
        answers: ["0.00050000", "0.00049999", "0.0005000", "0.000499999"],
        correctIndex: 0,
        videoSolution: "First non-zero digit is 4, round up the sequence of 9s"
    },
    {
        text: "Express 55.5555555 to 6 decimal places",
        answers: ["55.555556", "55.555555", "55.5555555", "55.5555550"],
        correctIndex: 0,
        videoSolution: "Round up the 6th decimal place (5) since next digit is 5"
    },
    {
        text: "Express 987,654,321.0987 to 7 significant figures",
        answers: ["987,654,300", "987,654,321.0", "987,654,321.1", "987,654,321.099"],
        correctIndex: 0,
        videoSolution: "7 s.f. stops at millions, rounding gives 987,654,300"
    },
    {
        text: "Express 0.999999999 to 3 decimal places",
        answers: ["1.000", "0.999", "1.00", "0.9999"],
        correctIndex: 0,
        videoSolution: "Cascading rounding converts all 9s to 0s and increases the whole number"
    },
    {
        text: "Express 123.456789123 to 9 decimal places",
        answers: ["123.456789123", "123.456789120", "123.456789124", "123.456789130"],
        correctIndex: 0,
        videoSolution: "Exact to 9 decimal places already"
    },
    {
        text: "Express 0.000001234567 to 4 significant figures",
        answers: ["0.000001235", "0.000001234", "0.0000012345", "0.0000012346"],
        correctIndex: 0,
        videoSolution: "First non-zero digit is 1, round up the 4th significant digit"
    },
    {
        text: "Express 9,876,543.21098 to 5 decimal places",
        answers: ["9,876,543.21098", "9,876,543.21099", "9,876,543.21100", "9,876,543.21090"],
        correctIndex: 0,
        videoSolution: "Exact to 5 decimal places already"
    },
    {
        text: "Express 0.123456789012 to 10 decimal places",
        answers: ["0.1234567890", "0.1234567891", "0.12345678901", "0.12345678902"],
        correctIndex: 0,
        videoSolution: "Truncate after 10 decimal places (no rounding needed)"
    },
    {
        text: "Express 100.00000049 to 9 significant figures",
        answers: ["100.000000", "100.0000005", "100.0000004", "100.00000049"],
        correctIndex: 0,
        videoSolution: "9 s.f. is 100.000000; the extra digits go beyond"
    },
    {
        text: "Express 0.000000999999 to 3 significant figures",
        answers: ["0.00000100", "0.000000999", "0.0000010", "0.0000009999"],
        correctIndex: 0,
        videoSolution: "Sequence of 9s rounds up to create two trailing zeros"
    },
    {
        text: "Express 777.7777777 to 7 decimal places",
        answers: ["777.7777777", "777.7777778", "777.7777770", "777.7777780"],
        correctIndex: 0,
        videoSolution: "Exact to 7 decimal places already"
    },
    {
        text: "Express 1,000,000.000001 to 8 significant figures",
        answers: ["1,000,000.0", "1,000,000.00", "1,000,000.000", "1,000,000.0000"],
        correctIndex: 0,
        videoSolution: "Trailing zeros after decimal are significant up to 8 figures"
    },
    {
        text: "Express 0.000000123456 to 5 decimal places",
        answers: ["0.00000", "0.00000012346", "0.00000012345", "0.000000123456"],
        correctIndex: 0,
        videoSolution: "Count decimal places including leading zeros"
    },
    {
        text: "Express 999,999.999999 to 4 significant figures",
        answers: ["1,000,000", "999,999.9", "1,000,000.0", "999,999.99"],
        correctIndex: 2,
        videoSolution: "Cascading rounding with proper significant zero retention"
    },
    {
        text: "Express 0.987654321 to 9 decimal places",
        answers: ["0.987654321", "0.9876543210", "0.987654322", "0.987654320"],
        correctIndex: 0,
        videoSolution: "Exact to 9 decimal places already"
    },
    {
        text: "Express 123,456,789.123456789 to 6 decimal places",
        answers: ["123,456,789.123456", "123,456,789.123457", "123,456,789.123460", "123,456,789.123450"],
        correctIndex: 1,
        videoSolution: "Round up the 6th decimal place because next digit is 7"
    }
], 
    6: [
    {
        text: "Express 123,456,789.123456789 to 9 significant figures",
        answers: ["123,456,789", "123,456,789.1", "123,456,789.12", "123,456,789.123"],
        correctIndex: 0,
        videoSolution: "The 9th significant digit is the last 9 in the integer part, so truncate after it."
    },
    {
        text: "Express 0.00000000123456789 to 7 significant figures",
        answers: ["0.000000001234568", "0.000000001234567", "0.0000000012345678", "0.0000000012345679"],
        correctIndex: 0,
        videoSolution: "Round up the 7th significant digit (7) because next digit (8) is ≥5."
    },
    {
        text: "Express 999,999.9999999 to 5 decimal places",
        answers: ["1,000,000.00000", "999,999.99999", "1,000,000.0000", "999,999.999999"],
        correctIndex: 0,
        videoSolution: "Cascading rounding converts all 9s to 0s and increases the whole number."
    },
    {
        text: "Express 1,000,000.0000001 to 8 decimal places",
        answers: ["1,000,000.00000010", "1,000,000.0000001", "1,000,000.0000000", "1,000,000.00000001"],
        correctIndex: 0,
        videoSolution: "Rounded to 8 decimal places becomes 1,000,000.00000010."
    },
    {
        text: "Express 0.0000009999999 to 4 significant figures",
        answers: ["0.000001000", "0.0000009999", "0.00000100", "0.00000099999"],
        correctIndex: 0,
        videoSolution: "Sequence of 9s rounds up to create three trailing zeros."
    },
    {
        text: "Express 777.77777777 to 8 decimal places",
        answers: ["777.77777778", "777.77777777", "777.77777780", "777.77777770"],
        correctIndex: 0,
        videoSolution: "Round up the 8th decimal place (7) because next digit is 7 (≥5)."
    },
    {
        text: "Express 1,234,567,890.123456789 to 7 decimal places",
        answers: ["1,234,567,890.1234568", "1,234,567,890.1234567", "1,234,567,890.12345678", "1,234,567,890.12345679"],
        correctIndex: 0,
        videoSolution: "Round up the 7th decimal place (7) because next digit (8) is ≥5."
    },
    {
        text: "Express 0.000000123456789 to 6 significant figures",
        answers: ["0.000000123457", "0.000000123456", "0.0000001234567", "0.0000001234568"],
        correctIndex: 0,
        videoSolution: "Round up the 6th significant digit (6) because next digit (7) is ≥5."
    },
    {
        text: "Express 9,876,543,210.987654321 to 6 decimal places",
        answers: ["9,876,543,210.987654", "9,876,543,210.987655", "9,876,543,210.987653", "9,876,543,210.987650"],
        correctIndex: 1,
        videoSolution: "Round up the 6th decimal place (4) because next digit (3) is ≥5."
    },
    {
        text: "Express 0.9999999999 to 5 decimal places",
        answers: ["1.00000", "0.99999", "1.0000", "0.999999"],
        correctIndex: 0,
        videoSolution: "Cascading rounding converts all 9s to 0s and increases the whole number."
    },
    {
        text: "Express 123,456.789012345 to 10 decimal places",
        answers: ["123,456.7890123450", "123,456.789012345", "123,456.7890123445", "123,456.7890123460"],
        correctIndex: 0,
        videoSolution: "Adding a trailing 0 to make it 10 decimal places."
    },
    {
        text: "Express 0.000000000123456789 to 5 significant figures",
        answers: ["0.00000000012346", "0.00000000012345", "0.000000000123456", "0.000000000123457"],
        correctIndex: 0,
        videoSolution: "Round up the 5th significant digit (5) because next digit (6) is ≥5."
    },
    {
        text: "Express 987,654,321.098765432 to 9 decimal places",
        answers: ["987,654,321.098765432", "987,654,321.098765430", "987,654,321.098765433", "987,654,321.098765431"],
        correctIndex: 0,
        videoSolution: "Exact to 9 decimal places already, no rounding needed."
    },
    {
        text: "Express 0.000000000999999999 to 3 significant figures",
        answers: ["0.00000000100", "0.000000000999", "0.0000000010", "0.0000000009999"],
        correctIndex: 0,
        videoSolution: "Sequence of 9s rounds up to create two trailing zeros."
    },
    {
        text: "Express 555,555.555555555 to 7 decimal places",
        answers: ["555,555.5555556", "555,555.5555555", "555,555.55555555", "555,555.55555556"],
        correctIndex: 0,
        videoSolution: "Round up the 7th decimal place (5) because next digit is 5 (≥5)."
    },
    {
        text: "Express 1,000,000.000000001 to 9 significant figures",
        answers: ["1,000,000.00", "1,000,000.000", "1,000,000.0000", "1,000,000.00000"],
        correctIndex: 1,
        videoSolution: "Trailing zeros after decimal are significant up to 9 figures."
    },
    {
        text: "Express 0.000000000000123456789 to 4 decimal places",
        answers: ["0.0000", "0.0000000000001235", "0.0000000000001234", "0.00000000000012346"],
        correctIndex: 0,
        videoSolution: "Count decimal places including all leading zeros."
    },
    {
        text: "Express 999,999,999.999999999 to 5 significant figures",
        answers: ["1,000,000,000", "999,999,999.9", "1,000,000,000.0", "999,999,999.99"],
        correctIndex: 2,
        videoSolution: "Cascading rounding with proper significant zero retention."
    },
    {
        text: "Express 0.987654321987654321 to 12 decimal places",
        answers: ["0.987654321988", "0.987654321987", "0.9876543219876", "0.9876543219877"],
        correctIndex: 0,
        videoSolution: "Round up the 12th decimal place (1) because next digit (9) is ≥5."
    },
    {
        text: "Express 123,456,789,123.456789123 to 6 decimal places",
        answers: ["123,456,789,123.456789", "123,456,789,123.456790", "123,456,789,123.456788", "123,456,789,123.456780"],
        correctIndex: 0,
        videoSolution: "Exact to 6 decimal places already, no rounding needed."
    }
], 
    7: [
    {
        text: "Express 12.3456789012 to 10 significant figures",
        answers: ["12.34567890", "12.345678901", "12.345678902", "12.3456789012"],
        correctIndex: 0,
        videoSolution: "The 10th significant digit is 0, so truncate after it."
    },
    {
        text: "Express 0.000123456789 to 7 significant figures",
        answers: ["0.0001234568", "0.0001234567", "0.00012345679", "0.00012345678"],
        correctIndex: 0,
        videoSolution: "Round up the 7th sig fig (7) because next digit (8) is ≥5."
    },
    {
        text: "Express 99.9999999 to 5 decimal places",
        answers: ["100.00000", "99.99999", "100.0000", "99.999999"],
        correctIndex: 0,
        videoSolution: "Cascading rounding with proper zero retention."
    },
    {
        text: "Express 1.0000000001 to 9 decimal places",
        answers: ["1.000000000", "1.0000000001", "1.000000001", "1.0000000000"],
        correctIndex: 0,
        videoSolution: "Cuts at 9 decimal places, gives 1.000000000."
    },
    {
        text: "Express 0.000000123456 to 5 significant figures",
        answers: ["0.00000012346", "0.00000012345", "0.000000123456", "0.000000123457"],
        correctIndex: 0,
        videoSolution: "Round up the 5th sig fig (5) because next digit (6) is ≥5."
    },
    {
        text: "Express 77.7777777 to 7 decimal places",
        answers: ["77.7777777", "77.7777778", "77.7777770", "77.7777780"],
        correctIndex: 0,
        videoSolution: "Exact to 7 decimal places - no rounding."
    },
    {
        text: "Express 123.456789123 to 9 significant figures",
        answers: ["123.456789", "123.4567891", "123.45678912", "123.456789123"],
        correctIndex: 0,
        videoSolution: "Cuts at the 9th significant figure."
    },
    {
        text: "Express 0.000000999999 to 3 significant figures",
        answers: ["0.00000100", "0.000000999", "0.0000010", "0.0000009999"],
        correctIndex: 0,
        videoSolution: "Sequence of 9s rounds up with zero retention."
    },
    {
        text: "Express 55.5555555 to 6 decimal places",
        answers: ["55.555556", "55.555555", "55.5555555", "55.5555550"],
        correctIndex: 0,
        videoSolution: "Round up the 6th decimal (5) because next digit is 5 (≥5)."
    },
    {
        text: "Express 100.0000001 to 8 significant figures",
        answers: ["100.00000", "100.000000", "100.0000001", "100.00000010"],
        correctIndex: 1,
        videoSolution: "Exact to 8 sig figs shows as 100.000000."
    },
    {
        text: "Express 0.000000001234 to 4 decimal places",
        answers: ["0.0000", "0.000000001234", "0.0000000012", "0.00000000123"],
        correctIndex: 0,
        videoSolution: "Count all leading zeros before decimals."
    },
    {
        text: "Express 999.999999 to 4 significant figures",
        answers: ["1,000", "999.9", "1,000.0", "999.99"],
        correctIndex: 0,
        videoSolution: "Cascading rounding results in 1,000."
    },
    {
        text: "Express 0.987654321 to 9 decimal places",
        answers: ["0.987654321", "0.9876543210", "0.987654322", "0.987654320"],
        correctIndex: 0,
        videoSolution: "Exact to 9 decimal places - no rounding."
    },
    {
        text: "Express 123.456789 to 7 decimal places",
        answers: ["123.4567890", "123.456789", "123.4567889", "123.4567891"],
        correctIndex: 1,
        videoSolution: "Exact to 7 decimal places - no rounding."
    },
    {
        text: "Express 0.000000000999 to 2 significant figures",
        answers: ["0.0000000010", "0.00000000099", "0.000000001", "0.00000000099"],
        correctIndex: 0,
        videoSolution: "Sequence of 9s rounds up with zero retention."
    },
    {
        text: "Express 777.777777 to 5 decimal places",
        answers: ["777.77778", "777.77777", "777.777777", "777.777770"],
        correctIndex: 0,
        videoSolution: "Round up the 5th decimal (7) because next digit (7) is ≥5."
    },
    {
        text: "Express 1.000000001 to 9 significant figures",
        answers: ["1.00000000", "1.000000001", "1.00000001", "1.000000000"],
        correctIndex: 0,
        videoSolution: "Cuts at 9th significant figure gives 1.00000000."
    },
    {
        text: "Express 0.000000123456 to 3 decimal places",
        answers: ["0.000", "0.000000123", "0.00000012", "0.000000124"],
        correctIndex: 0,
        videoSolution: "Count all leading zeros before decimals."
    },
    {
        text: "Express 999.99999 to 3 significant figures",
        answers: ["1,000", "999", "1,000.0", "999.99"],
        correctIndex: 0,
        videoSolution: "Cascading rounding results in 1,000."
    },
    {
        text: "Express 0.123456789 to 9 decimal places",
        answers: ["0.123456789", "0.1234567890", "0.123456788", "0.123456790"],
        correctIndex: 0,
        videoSolution: "Exact to 9 decimal places - no rounding."
    }
]
  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
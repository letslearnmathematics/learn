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
    text: "Round 3.456 to the nearest tenth.",
    answers: ["3.4", "3.5", "3.46", "3.45"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-decimals-tenths"
  },
  {
    text: "Round 7.891 to the nearest whole number.",
    answers: ["7", "7.8", "7.9", "8"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-decimals-whole"
  },
  {
    text: "Round 0.345 to the nearest hundredth.",
    answers: ["0.3", "0.34", "0.35", "0.345"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-decimals-hundredths"
  },
  {
    text: "Round 2.999 to the nearest tenth.",
    answers: ["2.9", "3.0", "3", "2.99"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-nines"
  },
  {
    text: "Round 5.678 up to the nearest whole number.",
    answers: ["5", "5.6", "5.7", "6"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-up-decimals"
  },
  {
    text: "Round 4.321 down to the nearest tenth.",
    answers: ["4.3", "4.2", "4.32", "4.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-decimals"
  },
  {
    text: "Round 9.876 to the nearest hundredth.",
    answers: ["9.87", "9.88", "9.8", "9.9"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-hundredths-practice"
  },
  {
    text: "Round 1.234 up to the nearest tenth.",
    answers: ["1.2", "1.3", "1.23", "1.24"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-tenths"
  },
  {
    text: "Round 6.789 down to the nearest whole number.",
    answers: ["6", "6.7", "6.8", "7"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-whole"
  },
  {
    text: "Round 0.987 to the nearest tenth.",
    answers: ["0.9", "1.0", "0.98", "0.99"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-small-decimals"
  },
  {
    text: "How many significant figures does 0.045 have?",
    answers: ["1", "2", "3", "4"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sig-figs-intro"
  },
  {
    text: "Round 12.345 to two decimal places.",
    answers: ["12.34", "12.35", "12.3", "12.4"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/decimal-places-intro"
  },
  {
    text: "Round 8.765 up to the nearest hundredth.",
    answers: ["8.76", "8.77", "8.7", "8.8"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-hundredths"
  },
  {
    text: "Round 3.141 down to the nearest tenth.",
    answers: ["3.1", "3.0", "3.14", "3.2"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-tenths"
  },
  {
    text: "Round 7.500 to the nearest whole number.",
    answers: ["7", "7.5", "8", "7.0"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-midpoint"
  },
  {
    text: "How many decimal places does 12.345 have?",
    answers: ["2", "3", "4", "5"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/counting-decimal-places"
  },
  {
    text: "Round 9.999 to the nearest hundredth.",
    answers: ["9.99", "10.00", "9.9", "10.0"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-repeating-nines"
  },
  {
    text: "Round 4.321 to one decimal place.",
    answers: ["4.3", "4.4", "4.32", "4.2"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/one-decimal-place"
  },
  {
    text: "How many significant figures does 120.0 have?",
    answers: ["1", "2", "3", "4"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/sig-figs-trailing-zeros"
  },
  {
    text: "Round 6.666 to the nearest tenth.",
    answers: ["6.6", "6.7", "6.67", "6.66"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-repeating-digits"
  }
],
    2: [
  {
    text: "Round 78.4604783 to the nearest tenths.",
    answers: ["78.5", "78.4", "78.46", "78.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-tenths-example"
  },
  {
    text: "Round 78.4604783 to the nearest hundredths.",
    answers: ["78.46", "78.47", "78.460", "78.500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-hundredths-example"
  },
  {
    text: "Round 78.4604783 to the nearest thousandths.",
    answers: ["78.460", "78.461", "78.4605", "78.4600"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-thousandths-example"
  },
  {
    text: "Round up 78.4604783 to the nearest tenths.",
    answers: ["78.5", "78.4", "78.46", "78.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-tenths"
  },
  {
    text: "Round up 78.4604783 to the nearest hundredths.",
    answers: ["78.47", "78.46", "78.460", "78.500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-hundredths"
  },
  {
    text: "Round up 78.4604783 to the nearest thousandths.",
    answers: ["78.461", "78.460", "78.4605", "78.4600"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-thousandths"
  },
  {
    text: "Round down 78.4604783 to the nearest tenths.",
    answers: ["78.4", "78.5", "78.46", "78.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-tenths"
  },
  {
    text: "Round down 78.4604783 to the nearest hundredths.",
    answers: ["78.46", "78.47", "78.460", "78.500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-hundredths"
  },
  {
    text: "Round down 78.4604783 to the nearest thousandths.",
    answers: ["78.460", "78.461", "78.4605", "78.4600"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-thousandths"
  },
  {
    text: "How many significant figures does 0.360 have?",
    answers: ["3", "2", "1", "4"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-0360"
  },
  {
    text: "How many significant figures does 7.021 have?",
    answers: ["4", "3", "2", "1"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-7021"
  },
  {
    text: "Round 0.00234567 to 3 significant figures.",
    answers: ["0.00235", "0.00234", "0.002345", "0.002346"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-3-digits"
  },
  {
    text: "Round 84.40995000 to 4 significant figures.",
    answers: ["84.41", "84.40", "84.409", "84.410"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-4-digits"
  },
  {
    text: "Round 0.00234567 to 5 significant figures.",
    answers: ["0.0023457", "0.0023456", "0.002345", "0.002346"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-5-digits"
  },
  {
    text: "Express 745.9674 correct to 3 decimal places.",
    answers: ["745.967", "745.968", "745.970", "745.966"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/3-decimal-places"
  },
  {
    text: "Express 745.9674 correct to 2 decimal places.",
    answers: ["745.97", "745.96", "745.967", "745.968"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/2-decimal-places"
  },
  {
    text: "Express 745.9674 correct to 1 decimal place.",
    answers: ["746.0", "745.9", "745.97", "745.96"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/1-decimal-place"
  },
  {
    text: "Which of these could be Musa's actual measurement if he rounded to 0.76m (2 decimal places)?",
    answers: ["0.755m", "0.764m", "0.759m", "0.765m"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-range-example"
  },
  {
    text: "What is the place value of the digit 4 in 78.4604783?",
    answers: ["Tenths", "Hundredths", "Thousandths", "Ten-thousandths"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/decimal-place-values"
  },
  {
    text: "What is the place value of the digit 6 in 78.4604783?",
    answers: ["Hundredths", "Tenths", "Thousandths", "Ten-thousandths"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/decimal-place-values-2"
  }
],
    3: [
  {
    text: "Round 123.456789 to the nearest thousandths.",
    answers: ["123.457", "123.456", "123.4568", "123.4567"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-thousandths-advanced"
  },
  {
    text: "Round 45.678901 up to the nearest hundredths.",
    answers: ["45.68", "45.67", "45.679", "45.678"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-hundredths-advanced"
  },
  {
    text: "Round 99.999999 down to the nearest tenths.",
    answers: ["99.9", "100.0", "99.99", "99.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-nines"
  },
  {
    text: "How many significant figures does 0.007890 have?",
    answers: ["4", "3", "5", "6"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-leading-zeros"
  },
  {
    text: "Round 0.000456789 to 2 significant figures.",
    answers: ["0.00046", "0.00045", "0.000457", "0.000456"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-small-numbers"
  },
  {
    text: "Express 987.654321 correct to 4 decimal places.",
    answers: ["987.6543", "987.6544", "987.6540", "987.65432"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/4-decimal-places"
  },
  {
    text: "Which measurement would NOT round to 12.35 when rounded to 2 decimal places?",
    answers: ["12.345", "12.354", "12.346", "12.355"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-boundaries"
  },
  {
    text: "Round 55.555555 to the nearest thousandths.",
    answers: ["55.556", "55.555", "55.5556", "55.5555"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-repeating-digits"
  },
  {
    text: "How many decimal places does 0.123456789 have?",
    answers: ["9", "8", "7", "6"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/counting-many-decimals"
  },
  {
    text: "Round 33.333333 up to the nearest hundredths.",
    answers: ["33.34", "33.33", "33.333", "33.330"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-repeating"
  },
  {
    text: "What is the smallest number that rounds to 7.80 when rounded to 2 decimal places?",
    answers: ["7.795", "7.799", "7.805", "7.750"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-range-min"
  },
  {
    text: "Round 66.666666 down to the nearest thousandths.",
    answers: ["66.666", "66.667", "66.6666", "66.6667"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-repeating"
  },
  {
    text: "How many significant figures does 100.004 have?",
    answers: ["6", "5", "4", "3"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-middle-zeros"
  },
  {
    text: "Round 0.999999 to 3 significant figures.",
    answers: ["1.00", "0.999", "1.000", "0.100"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-near-one"
  },
  {
    text: "Express 1234.56789 correct to 1 decimal place.",
    answers: ["1234.6", "1234.5", "1234.57", "1234.56"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/large-number-decimals"
  },
  {
    text: "What is the place value of the digit 8 in 12.3456789?",
    answers: ["Hundred-thousandths", "Ten-thousandths", "Millionths", "Thousandths"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/advanced-place-values"
  },
  {
    text: "Round 22.222222 to the nearest ten-thousandths.",
    answers: ["22.2222", "22.2223", "22.2220", "22.22222"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-ten-thousandths"
  },
  {
    text: "Which of these numbers has exactly 5 significant figures?",
    answers: ["100.40", "0.001234", "1004.0", "0.10040"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/identifying-sig-figs"
  },
  {
    text: "Round 77.777777 up to the nearest thousandths.",
    answers: ["77.778", "77.777", "77.780", "77.7778"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-thousandths-advanced"
  },
  {
    text: "What is the largest number that rounds to 5.25 when rounded to 2 decimal places?",
    answers: ["5.254", "5.255", "5.259", "5.249"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-range-max"
  }
], 
    4: [
  {
    text: "Round 0.00456789 to 3 significant figures.",
    answers: ["0.00457", "0.00456", "0.004568", "0.0046"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-small-advanced"
  },
  {
    text: "Round 56789.4321 to the nearest hundred.",
    answers: ["56789.00", "56800", "56700", "56790"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-to-hundreds"
  },
  {
    text: "Express 0.987654321 correct to 5 decimal places.",
    answers: ["0.98765", "0.987654", "0.987655", "0.98764"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-5-decimals"
  },
  {
    text: "How many significant figures does 300.50 have?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/sig-figs-trailing-zeros"
  },
  {
    text: "Round 74.44444 up to the nearest thousandth.",
    answers: ["74.444", "74.445", "74.4444", "74.4450"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-thousandths"
  },
  {
    text: "Round 18.9999 down to 2 decimal places.",
    answers: ["18.99", "19.00", "18.90", "18.999"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-advanced"
  },
  {
    text: "What is the smallest number that rounds to 15.60 (2 d.p.)?",
    answers: ["15.595", "15.601", "15.605", "15.599"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-boundaries-min"
  },
  {
    text: "What is the largest number that rounds to 15.60 (2 d.p.)?",
    answers: ["15.605", "15.609", "15.615", "15.599"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-boundaries-max"
  },
  {
    text: "Round 0.0009999 to 2 significant figures.",
    answers: ["0.0010", "0.00099", "0.001", "0.0009"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-tiny-numbers"
  },
  {
    text: "How many decimal places does 234.567000 have?",
    answers: ["6", "3", "5", "7"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/decimal-places-trailing-zeros"
  },
  {
    text: "Round 909.505 to the nearest whole number.",
    answers: ["910", "909", "909.5", "900"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-to-whole-numbers"
  },
  {
    text: "Express 1.23456789 correct to 6 significant figures.",
    answers: ["1.23457", "1.23456", "1.234568", "1.234569"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-6-sigfigs"
  },
  {
    text: "Which number has exactly 4 significant figures?",
    answers: ["0.004560", "1004", "56.70", "0.00789"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/identifying-sigfigs-advanced"
  },
  {
    text: "Round 4444.4444 to the nearest thousand.",
    answers: ["4000", "5000", "4444", "4500"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-to-thousands"
  },
  {
    text: "Round 23.45678 up to 3 decimal places.",
    answers: ["23.456", "23.457", "23.4568", "23.4570"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-3dp"
  },
  {
    text: "Express 999.9999 correct to 2 decimal places.",
    answers: ["1000.00", "999.99", "1000.0", "999.90"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-nines-special"
  },
  {
    text: "Round 0.345678 down to 4 significant figures.",
    answers: ["0.3456", "0.3457", "0.346", "0.345"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-rounding-down"
  },
  {
    text: "What is the place value of the digit 5 in 0.005678?",
    answers: ["Thousandths", "Ten-thousandths", "Hundredths", "Millionths"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/place-values-advanced"
  },
  {
    text: "Round 87.50049 to 3 decimal places.",
    answers: ["87.500", "87.501", "87.499", "87.50"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-3-decimals"
  },
  {
    text: "Which measurement would NOT round to 6.78 when rounded to 2 d.p.?",
    answers: ["6.775", "6.784", "6.776", "6.785"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-check-boundaries"
  }
]
, 
    5: [
  {
    text: "Round 0.00098765 to 3 significant figures.",
    answers: ["0.000988", "0.000987", "0.00099", "0.00098"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-level5-small"
  },
  {
    text: "Express 12345.6789 correct to 2 decimal places.",
    answers: ["12345.68", "12345.67", "12346", "12345.7"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-2dp-advanced"
  },
  {
    text: "How many significant figures does 0.01020 have?",
    answers: ["4", "3", "5", "2"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-trailing-leading"
  },
  {
    text: "Round 888.8888 to the nearest thousand.",
    answers: ["1000", "900", "889", "1000.0"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-thousands-special"
  },
  {
    text: "What is the smallest number that rounds to 4.50 (2 d.p.)?",
    answers: ["4.495", "4.499", "4.500", "4.451"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-smallest-boundary"
  },
  {
    text: "What is the largest number that rounds to 4.50 (2 d.p.)?",
    answers: ["4.509", "4.505", "4.511", "4.500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-largest-boundary"
  },
  {
    text: "Round 45.67849 up to 3 decimal places.",
    answers: ["45.678", "45.679", "45.6785", "45.680"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-3dp"
  },
  {
    text: "Express 0.00044449 correct to 2 significant figures.",
    answers: ["0.00044", "0.00045", "0.000444", "0.0004"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sigfigs-boundary"
  },
  {
    text: "How many decimal places does 200.0003 have?",
    answers: ["4", "6", "5", "7"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/counting-decimal-places"
  },
  {
    text: "Round 9999.999 to 2 decimal places.",
    answers: ["10000.00", "9999.99", "10000", "9999.90"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-near-10000"
  },
  {
    text: "Round 56.0505 to the nearest hundredth.",
    answers: ["56.05", "56.06", "56.050", "56.1"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-hundredths-edge"
  },
  {
    text: "Which of these numbers has exactly 6 significant figures?",
    answers: ["0.0123456", "100.450", "0.000560340", "123450"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/identifying-6-sigfigs"
  },
  {
    text: "Express 123.9994 correct to 3 decimal places.",
    answers: ["124.000", "123.999", "124.00", "124"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-999"
  },
  {
    text: "Round 0.1234567 down to 4 significant figures.",
    answers: ["0.1234", "0.1235", "0.124", "0.123"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-rounding-down-level5"
  },
  {
    text: "What is the place value of 9 in 0.0009023?",
    answers: ["Ten-thousandths", "Thousandths", "Hundred-thousandths", "Millionths"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/place-value-difficult"
  },
  {
    text: "Round 78.44445 to 4 decimal places.",
    answers: ["78.4445", "78.4444", "78.445", "78.44"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-4-decimals"
  },
  {
    text: "How many significant figures does 0.0001002 have?",
    answers: ["7", "4", "5", "6"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sigfigs-leading-trailing"
  },
  {
    text: "Which number would NOT round to 2.35 when rounded to 2 decimal places?",
    answers: ["2.349", "2.351", "2.354", "2.345"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-not-match"
  },
  {
    text: "Round 1234567.89 to the nearest thousand.",
    answers: ["1235000", "1234000", "1234570", "1234600"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-thousands-big"
  },
  {
    text: "Express 0.99994 to 3 significant figures.",
    answers: ["1.00", "0.999", "0.100", "0.9999"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-near-one-advanced"
  }
]
, 
    6: [
  {
    text: "Round 0.000456789 to 4 significant figures.",
    answers: ["0.0004568", "0.0004567", "0.000457", "0.00046"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-4sf-small"
  },
  {
    text: "Express 98765.4321 correct to 3 decimal places.",
    answers: ["98765.432", "98765.431", "98765.433", "98765.43"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-3dp-advanced"
  },
  {
    text: "How many significant figures does 0.00010020 have?",
    answers: ["5", "4", "6", "3"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-leading-trailing-zeros"
  },
  {
    text: "Round 777.7777 to the nearest ten.",
    answers: ["780", "770", "777.8", "800"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-to-nearest-ten"
  },
  {
    text: "What is the smallest number that rounds to 8.90 (2 d.p.)?",
    answers: ["8.895", "8.899", "8.901", "8.905"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-smallest-boundary-level6"
  },
  {
    text: "What is the largest number that rounds to 8.90 (2 d.p.)?",
    answers: ["8.909", "8.905", "8.899", "8.910"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-largest-boundary-level6"
  },
  {
    text: "Round 65.43219 up to 4 decimal places.",
    answers: ["65.4322", "65.4321", "65.43219", "65.4320"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-up-4dp"
  },
  {
    text: "Express 0.00033349 correct to 3 significant figures.",
    answers: ["0.000333", "0.000334", "0.0003335", "0.00033"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sigfigs-rounding-boundary"
  },
  {
    text: "How many decimal places does 123.450600 have?",
    answers: ["6", "7", "5", "4"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/decimal-places-trailing-level6"
  },
  {
    text: "Round 0.9994999 to 3 decimal places.",
    answers: ["0.999", "1.000", "0.998", "0.9995"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-critical-boundary"
  },
  {
    text: "Round 0.99995 to 4 significant figures.",
    answers: ["1.000", "0.9999", "0.99995", "0.999"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-near-one-level6"
  },
  {
    text: "Which of these numbers has exactly 7 significant figures?",
    answers: ["0.001234560", "1234560", "12.34560", "0.000123456"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/identifying-7-sigfigs"
  },
  {
    text: "Round 6543.21 to the nearest hundred.",
    answers: ["6500", "6600", "6540", "6550"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-to-hundreds-advanced"
  },
  {
    text: "Express 345.67891 correct to 5 significant figures.",
    answers: ["345.68", "345.679", "345.67", "345.6789"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-5sf"
  },
  {
    text: "What is the place value of the digit 4 in 12.345678?",
    answers: ["Thousandths", "Hundredths", "Ten-thousandths", "Millionths"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/place-value-level6"
  },
  {
    text: "Round 0.00056789 down to 2 significant figures.",
    answers: ["0.00056", "0.00057", "0.0006", "0.0005"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-rounding-down-level6"
  },
  {
    text: "Which measurement would NOT round to 14.25 (2 d.p.)?",
    answers: ["14.245", "14.254", "14.249", "14.251"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-boundary-check"
  },
  {
    text: "Round 123456.789 to the nearest ten-thousand.",
    answers: ["120000", "123000", "130000", "125000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-to-ten-thousands"
  },
  {
    text: "Express 0.0044444 correct to 2 decimal places.",
    answers: ["0.00", "0.004", "0.01", "0.0044"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-small-to-decimal-places"
  },
  {
    text: "How many significant figures does 1.000500 have?",
    answers: ["7", "6", "5", "4"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sigfigs-tricky-trailing"
  }
], 
    7: [
  {
    text: "Round 0.0000098765 to 3 significant figures.",
    answers: ["0.00000988", "0.00000987", "0.000009876", "0.0000099"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-level7-small"
  },
  {
    text: "Express 9876543.21 correct to 4 decimal places.",
    answers: ["9876543.2100", "9876543.2101", "9876543.2099", "9876543.21"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-4dp-big"
  },
  {
    text: "How many significant figures does 0.000100200 have?",
    answers: ["6", "5", "4", "7"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-extreme-zeros"
  },
  {
    text: "Round 49.995 to the nearest whole number.",
    answers: ["50", "49", "49.9", "51"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-critical-boundary-level7"
  },
  {
    text: "What is the smallest number that rounds to 0.050 (3 d.p.)?",
    answers: ["0.0495", "0.0501", "0.0499", "0.0500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-smallest-boundary-level7"
  },
  {
    text: "What is the largest number that rounds to 0.050 (3 d.p.)?",
    answers: ["0.0504", "0.0505", "0.051", "0.0499"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-largest-boundary-level7"
  },
  {
    text: "Round 2345.678901 to the nearest thousand.",
    answers: ["2000", "3000", "2346", "2400"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-to-thousands-level7"
  },
  {
    text: "Express 0.000444449 correct to 5 significant figures.",
    answers: ["0.00044445", "0.00044444", "0.0004444", "0.00044450"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-5sf-boundary"
  },
  {
    text: "How many decimal places does 0.1234000 have?",
    answers: ["7", "4", "5", "6"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/decimal-places-boundary"
  },
  {
    text: "Round 4.99995 to 4 decimal places.",
    answers: ["5.0000", "4.9999", "4.99995", "5.00"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-4dp-critical"
  },
  {
    text: "Round 0.000567891 to 2 significant figures.",
    answers: ["0.00057", "0.00056", "0.0006", "0.00058"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-2sf-level7"
  },
  {
    text: "Which of these numbers has exactly 8 significant figures?",
    answers: ["0.0001234560", "12.345678", "1234567", "0.0012345"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/identifying-8-sigfigs"
  },
  {
    text: "Express 765.4999 correct to 2 decimal places.",
    answers: ["765.50", "765.49", "765.5", "765.00"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-2dp-boundary"
  },
  {
    text: "What is the place value of the digit 7 in 0.0000007?",
    answers: ["Millionths", "Ten-millionths", "Hundred-thousandths", "Billionths"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/place-value-level7"
  },
  {
    text: "Round 0.333335 down to 4 significant figures.",
    answers: ["0.3333", "0.3334", "0.333", "0.334"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-rounding-down-level7"
  },
  {
    text: "Which measurement would NOT round to 23.46 (2 d.p.)?",
    answers: ["23.455", "23.464", "23.456", "23.459"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-not-match-level7"
  },
  {
    text: "Round 987654.321 to the nearest ten-thousand.",
    answers: ["990000", "980000", "987000", "988000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-to-ten-thousands-level7"
  },
  {
    text: "Express 0.00009999 to 2 significant figures.",
    answers: ["0.000100", "0.000099", "0.0000999", "0.0001"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-near-boundary-level7"
  },
  {
    text: "How many significant figures does 1000.000 have?",
    answers: ["7", "6", "5", "4"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sigfigs-1000-trailing"
  },
  {
    text: "Round 0.8888888 up to 6 decimal places.",
    answers: ["0.888889", "0.888888", "0.888887", "0.889"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-6dp-level7"
  }
]

  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
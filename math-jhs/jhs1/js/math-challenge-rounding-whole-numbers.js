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
    text: "Round 4,732 to the nearest hundred.",
    answers: ["4,700", "4,730", "4,800", "5,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 8,569 up to the nearest thousand.",
    answers: ["8,000", "8,500", "8,600", "9,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "Round 3,241 down to the nearest hundred.",
    answers: ["3,000", "3,200", "3,240", "3,300"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 6,789 rounded to the nearest ten?",
    answers: ["6,780", "6,790", "6,800", "7,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 9,505 to the nearest thousand.",
    answers: ["9,000", "9,500", "10,000", "9,600"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 1,234 up to the nearest hundred.",
    answers: ["1,200", "1,230", "1,300", "1,240"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "Round 5,671 down to the nearest ten.",
    answers: ["5,600", "5,670", "5,700", "5,680"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 7,328 rounded to the nearest thousand?",
    answers: ["7,000", "7,300", "7,400", "8,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 2,499 to the nearest hundred.",
    answers: ["2,400", "2,490", "2,500", "2,600"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 4,321 up to the nearest thousand.",
    answers: ["4,000", "4,300", "4,400", "5,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 8,765 rounded to three significant figures?",
    answers: ["8,760", "8,770", "8,800", "8,700"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 6,543 down to the nearest hundred.",
    answers: ["6,500", "6,540", "6,600", "6,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 3,987 rounded to the nearest ten?",
    answers: ["3,980", "3,990", "4,000", "3,900"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 7,654 to two significant figures.",
    answers: ["7,600", "7,700", "7,650", "7,660"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 2,345 up to the nearest hundred.",
    answers: ["2,300", "2,340", "2,400", "2,350"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 9,876 rounded to the nearest thousand?",
    answers: ["9,000", "9,800", "9,900", "10,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 1,111 down to the nearest ten.",
    answers: ["1,100", "1,110", "1,000", "1,200"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 5,555 rounded to three significant figures?",
    answers: ["5,550", "5,560", "5,500", "5,600"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 3,333 up to the nearest hundred.",
    answers: ["3,300", "3,330", "3,400", "3,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 6,666 rounded to the nearest thousand?",
    answers: ["6,000", "6,600", "6,700", "7,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  }
],
    2: [
  {
    text: "Round 34,567 to the nearest thousand.",
    answers: ["34,000", "34,500", "35,000", "34,600"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 89,432 up to the nearest ten thousand.",
    answers: ["89,000", "90,000", "89,400", "80,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "Round 56,789 down to the nearest hundred.",
    answers: ["56,700", "56,780", "56,800", "57,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 123,456 rounded to the nearest ten thousand?",
    answers: ["120,000", "123,000", "123,500", "100,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 75,501 to the nearest thousand.",
    answers: ["75,000", "75,500", "76,000", "75,600"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 99,999 up to the nearest hundred.",
    answers: ["99,900", "99,990", "100,000", "100,900"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "Round 42,315 down to the nearest thousand.",
    answers: ["42,000", "42,300", "43,000", "40,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 67,891 rounded to the nearest hundred?",
    answers: ["67,800", "67,890", "67,900", "68,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 150,505 to three significant figures.",
    answers: ["151,000", "150,000", "151,500", "150,500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 333,333 up to the nearest ten thousand.",
    answers: ["330,000", "333,000", "333,300", "340,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 888,888 rounded to four significant figures?",
    answers: ["888,900", "888,800", "889,000", "888,800"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 499,999 down to the nearest thousand.",
    answers: ["499,000", "499,900", "500,000", "490,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 625,000 rounded to the nearest hundred thousand?",
    answers: ["600,000", "620,000", "630,000", "625,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 777,777 to two significant figures.",
    answers: ["780,000", "770,000", "777,000", "800,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 123,456 up to the nearest hundred.",
    answers: ["123,400", "123,460", "123,500", "124,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 987,654 rounded to the nearest ten thousand?",
    answers: ["980,000", "987,000", "990,000", "1,000,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 555,555 down to the nearest ten thousand.",
    answers: ["550,000", "555,000", "560,000", "500,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 444,444 rounded to five significant figures?",
    answers: ["444,440", "444,450", "444,400", "444,500"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 666,666 up to the nearest thousand.",
    answers: ["666,000", "666,600", "667,000", "670,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 250,000 rounded to the nearest hundred thousand?",
    answers: ["200,000", "250,000", "300,000", "250,500"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  }
],
    3: [
  {
    text: "Round 1,234,567 to the nearest hundred thousand.",
    answers: ["1,200,000", "1,230,000", "1,235,000", "1,300,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 4,999,999 up to the nearest million.",
    answers: ["4,900,000", "4,990,000", "5,000,000", "5,900,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "Round 7,654,321 down to the nearest ten thousand.",
    answers: ["7,650,000", "7,600,000", "7,654,000", "7,700,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 8,888,888 rounded to the nearest million?",
    answers: ["8,000,000", "8,800,000", "8,900,000", "9,000,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 3,456,789 to three significant figures.",
    answers: ["3,450,000", "3,460,000", "3,500,000", "3,456,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 6,543,210 up to the nearest hundred thousand.",
    answers: ["6,500,000", "6,540,000", "6,600,000", "6,543,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "Round 9,876,543 down to the nearest thousand.",
    answers: ["9,876,000", "9,870,000", "9,877,000", "9,800,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 5,555,555 rounded to the nearest ten thousand?",
    answers: ["5,555,000", "5,550,000", "5,560,000", "5,600,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 2,345,678 to four significant figures.",
    answers: ["2,345,000", "2,346,000", "2,350,000", "2,340,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 1,999,999 up to the nearest ten thousand.",
    answers: ["1,990,000", "2,000,000", "1,999,000", "2,009,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 7,777,777 rounded to two significant figures?",
    answers: ["7,700,000", "7,800,000", "7,770,000", "7,780,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 3,333,333 down to the nearest hundred thousand.",
    answers: ["3,300,000", "3,330,000", "3,333,000", "3,400,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 6,499,999 rounded to the nearest million?",
    answers: ["6,000,000", "6,400,000", "6,500,000", "7,000,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 8,765,432 to five significant figures.",
    answers: ["8,765,400", "8,765,500", "8,765,430", "8,765,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 4,321,098 up to the nearest hundred thousand.",
    answers: ["4,300,000", "4,320,000", "4,400,000", "4,321,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 9,999,999 rounded to the nearest ten?",
    answers: ["9,999,990", "10,000,000", "9,999,900", "10,000,990"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  },
  {
    text: "Round 5,678,901 down to the nearest hundred thousand.",
    answers: ["5,600,000", "5,670,000", "5,678,000", "5,700,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down"
  },
  {
    text: "What is 1,234,567 rounded to three significant figures?",
    answers: ["1,230,000", "1,234,000", "1,240,000", "1,235,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/significant-figures"
  },
  {
    text: "Round 7,890,123 up to the nearest million.",
    answers: ["7,800,000", "7,890,000", "8,000,000", "7,900,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up"
  },
  {
    text: "What is 6,543,210 rounded to the nearest hundred thousand?",
    answers: ["6,500,000", "6,540,000", "6,543,000", "6,600,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-basics"
  }
], 
    4: [
  {
    text: "A city has a population of 2,345,678. Round this to the nearest hundred thousand for a news report.",
    answers: ["2,300,000", "2,340,000", "2,350,000", "2,400,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-realworld"
  },
  {
    text: "A company made $8,765,432 in revenue. Round this up to the nearest million for their annual report.",
    answers: ["8,700,000", "8,765,000", "8,800,000", "9,000,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-up-applied"
  },
  {
    text: "Round 12,345,678 down to the nearest hundred thousand.",
    answers: ["12,300,000", "12,340,000", "12,345,000", "12,400,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-large"
  },
  {
    text: "A national park covers 7,654,321 acres. Round this to three significant figures for a brochure.",
    answers: ["7,650,000", "7,660,000", "7,700,000", "7,654,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-applied"
  },
  {
    text: "Round the sum of 3,456,789 and 1,234,567 to the nearest million.",
    answers: ["4,000,000", "4,600,000", "4,691,000", "5,000,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-after-addition"
  },
  {
    text: "A factory produced 15,999,999 units. Round this up to the nearest hundred thousand for inventory records.",
    answers: ["15,900,000", "16,000,000", "16,100,000", "15,999,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-inventory"
  },
  {
    text: "Round the difference between 10,000,000 and 3,456,789 down to the nearest million.",
    answers: ["6,000,000", "6,500,000", "7,000,000", "6,543,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-after-subtraction"
  },
  {
    text: "A country's GDP is $23,456,789,000. Round this to four significant figures for an economic report.",
    answers: ["23,450,000,000", "23,460,000,000", "23,500,000,000", "23,456,700,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sig-figs-billions"
  },
  {
    text: "Round 45,678,901 to the nearest ten million.",
    answers: ["40,000,000", "45,000,000", "46,000,000", "50,000,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-ten-millions"
  },
  {
    text: "A distance is 123,456,789 meters. Round this down to the nearest million meters.",
    answers: ["123,000,000", "123,400,000", "123,500,000", "124,000,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-distance"
  },
  {
    text: "Round the product of 1,234 and 9,876 to the nearest hundred thousand.",
    answers: ["12,100,000", "12,180,000", "12,200,000", "12,184,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-after-multiplication"
  },
  {
    text: "A website had 98,765,432 visitors. Round this to two significant figures for a press release.",
    answers: ["98,000,000", "99,000,000", "100,000,000", "98,800,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/sig-figs-large-numbers"
  },
  {
    text: "Round 76,543,210 up to the nearest ten million.",
    answers: ["76,500,000", "77,000,000", "80,000,000", "76,540,000"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up-ten-millions"
  },
  {
    text: "A company's stock is valued at $154.9876 per share. Round this to the nearest dollar for trading.",
    answers: ["$154", "$155", "$154.90", "$154.99"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-money"
  },
  {
    text: "Round the average of 23,456,789 and 34,567,890 to the nearest million.",
    answers: ["28,000,000", "29,000,000", "29,500,000", "30,000,000"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-averages"
  },
  {
    text: "A car's odometer shows 123,456.7 miles. Round this down to the nearest hundred miles for resale value.",
    answers: ["123,400", "123,500", "123,000", "123,456"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-odometer"
  },
  {
    text: "Round 987,654,321 to five significant figures.",
    answers: ["987,650,000", "987,660,000", "987,700,000", "987,654,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-9digit"
  },
  {
    text: "A marathon is 42,165 meters. Round this up to the nearest thousand meters for race planning.",
    answers: ["42,000", "42,100", "42,200", "43,000"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/rounding-up-distance"
  },
  {
    text: "Round the result of 50,000,000 ÷ 7 to the nearest million.",
    answers: ["7,000,000", "7,100,000", "7,142,000", "7,000,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-after-division"
  },
  {
    text: "A library has 1,234,567 books. Round this to the nearest ten thousand for a grant application.",
    answers: ["1,230,000", "1,234,000", "1,235,000", "1,240,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-grant-applications"
  }
], 
    5: [
  {
    text: "Round 12,345.6789 to the nearest whole number.",
    answers: ["12,345", "12,346", "12,345.7", "12,345.68"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-decimals-whole"
  },
  {
    text: "A scientific measurement is 0.00456789 cm. Round this to three significant figures.",
    answers: ["0.00457", "0.00456", "0.004567", "0.00457 cm"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-decimal"
  },
  {
    text: "Round π (3.1415926535) to four significant figures.",
    answers: ["3.142", "3.1416", "3.141", "3.14159"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-pi"
  },
  {
    text: "A chemical solution has a concentration of 0.09999 mol/L. Round this up to two decimal places.",
    answers: ["0.09", "0.10", "0.099", "0.100"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-decimals"
  },
  {
    text: "Round 999.999 down to the nearest whole number.",
    answers: ["999", "999.9", "1,000", "999.99"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-decimals"
  },
  {
    text: "The speed of light is 299,792,458 m/s. Round this to four significant figures.",
    answers: ["299,800,000", "299,790,000", "299,792,500", "299,792,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-physics"
  },
  {
    text: "Round 1,234.5678 to the nearest hundred.",
    answers: ["1,200", "1,230", "1,234.6", "1,234.57"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-mixed-place-values"
  },
  {
    text: "A medication dosage is 0.008765 grams. Round this to two significant figures.",
    answers: ["0.0088", "0.0087", "0.009", "0.00877"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-medicine"
  },
  {
    text: "Round 55.555 up to the nearest whole number.",
    answers: ["55", "55.6", "56", "55.56"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-up-fractions"
  },
  {
    text: "The distance to the moon is 384,400 km. Round this to three significant figures.",
    answers: ["384,000", "385,000", "384,400", "384,000 km"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-astronomy"
  },
  {
    text: "Round 0.009876 down to three decimal places.",
    answers: ["0.009", "0.010", "0.00987", "0.00988"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-small-numbers"
  },
  {
    text: "A microorganism measures 0.000456789 mm. Round this to four significant figures.",
    answers: ["0.0004568", "0.0004567", "0.000457", "0.00045679"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-biology"
  },
  {
    text: "Round 7,654.321 to the nearest ten.",
    answers: ["7,650", "7,654", "7,654.3", "7,660"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-mixed-ten"
  },
  {
    text: "The gravitational constant is 6.67430 × 10⁻¹¹. Round this to three significant figures.",
    answers: ["6.67 × 10⁻¹¹", "6.674 × 10⁻¹¹", "6.68 × 10⁻¹¹", "6.67"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-scientific"
  },
  {
    text: "Round 123.456789 up to two decimal places.",
    answers: ["123.45", "123.46", "123.46", "123.457"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-hundredths"
  },
  {
    text: "A nanoparticle has a diameter of 0.0000001234 m. Round this to two significant figures.",
    answers: ["1.2 × 10⁻⁷", "1.23 × 10⁻⁷", "1.2 × 10⁻⁷ m", "0.00000012"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-nano"
  },
  {
    text: "Round 9,999.999 down to the nearest hundred.",
    answers: ["9,900", "9,999", "10,000", "9,999.99"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-down-nines"
  },
  {
    text: "The atomic mass of carbon is 12.0107 u. Round this to three significant figures.",
    answers: ["12.0", "12.01", "12.010", "12.0 u"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-chemistry"
  },
  {
    text: "Round 0.123456 up to three decimal places.",
    answers: ["0.123", "0.124", "0.1235", "0.12346"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-up-thousandths"
  },
  {
    text: "A financial calculation yields $1234.56789. Round this to the nearest cent.",
    answers: ["$1234.57", "$1234.56", "$1234.567", "$1234.568"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-money-cents"
  }
], 
    6: [
  {
    text: "Estimate the product of 4,876 × 321 by rounding each number to its highest place value before multiplying.",
    answers: ["1,500,000", "1,600,000", "1,550,000", "1,565,196"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimation-multiplication"
  },
  {
    text: "A measurement is recorded as 12.5 cm with a possible error of ±0.25 cm. What is the range of possible values when rounded to the nearest whole centimeter?",
    answers: ["12-13 cm", "12.25-12.75 cm", "12.3-12.7 cm", "12-13 cm with uncertainty"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-error-analysis"
  },
  {
    text: "Round 7.849 to the nearest tenth, then round that result to the nearest whole number. What is your final answer?",
    answers: ["7", "8", "7.8", "7.9"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/multi-step-rounding"
  },
  {
    text: "Estimate the sum of 12,456 + 7,891 + 23,409 by rounding each number to the nearest thousand before adding.",
    answers: ["43,000", "44,000", "43,756", "43,800"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/estimation-addition"
  },
  {
    text: "A number is rounded to 3,400,000. What is the greatest possible value it could have been before rounding?",
    answers: ["3,449,999", "3,444,999", "3,400,000", "3,404,999"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/reverse-rounding"
  },
  {
    text: "Which of these numbers would round to 5.60 when rounded to three significant figures?",
    answers: ["5.594", "5.604", "5.595", "5.605"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/sig-figs-boundaries"
  },
  {
    text: "Estimate √150 by finding the two perfect squares it lies between, then rounding to the nearest whole number.",
    answers: ["12", "12.2", "12.25", "12.3"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimating-roots"
  },
  {
    text: "A number is rounded to 7,800,000 to two significant figures. What is the smallest possible value it could have been?",
    answers: ["7,750,000", "7,750,000", "7,800,000", "7,750,000.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-range"
  },
  {
    text: "Estimate 4,987 ÷ 48 by rounding both numbers to one significant figure before dividing.",
    answers: ["100", "125", "103.9", "104"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimation-division"
  },
  {
    text: "Which measurement has been incorrectly rounded? 2.346 → 2.35 (to 3 sig fig), 0.005678 → 0.00568 (to 3 sig fig), 12,345 → 12,300 (to 3 sig fig)",
    answers: ["Only the first", "Only the second", "Only the third", "All are correct"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-error-detection"
  },
  {
    text: "Estimate the value of π² by using π ≈ 3.14, then rounding your answer to two significant figures.",
    answers: ["9.8", "9.9", "9.86", "9.8596"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/estimating-pi-squared"
  },
  {
    text: "A number is rounded to 0.00760. How many significant figures does this represent?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-counting"
  },
  {
    text: "Estimate 23% of 4,876 by rounding both numbers appropriately before calculating.",
    answers: ["1,121", "1,120", "1,100", "1,121.48"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/estimating-percentages"
  },
  {
    text: "Which of these is the best estimate for 987 × 0.512? (Round each number to one significant figure first)",
    answers: ["500", "505", "510", "495"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimation-decimals"
  },
  {
    text: "A measurement of 12.34 cm is made with an instrument that measures to the nearest 0.05 cm. How should this be properly rounded?",
    answers: ["12.3 cm", "12.34 cm", "12.35 cm", "12.30 cm"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/measurement-precision"
  },
  {
    text: "Estimate the mean of these numbers: 4,567; 3,892; 5,123; 4,876 by rounding each to the nearest hundred first.",
    answers: ["4,600", "4,614.5", "4,615", "4,610"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimating-means"
  },
  {
    text: "Which number would not round to 6.50 when rounded to three significant figures?",
    answers: ["6.495", "6.504", "6.499", "6.501"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-boundaries"
  },
  {
    text: "Estimate 15³ by calculating 15 × 15 × 15, then rounding to two significant figures.",
    answers: ["3,400", "3,375", "3,380", "3,400"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimating-powers"
  },
  {
    text: "A population is reported as 1,240,000 people. What is the maximum possible error in this rounded figure?",
    answers: ["±500 people", "±5,000 people", "±50,000 people", "±500,000 people"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-error-range"
  },
  {
    text: "Estimate the solution to (123,456 + 87,654) ÷ 321 by rounding appropriately before calculating.",
    answers: ["657", "658", "657.4", "660"],
    correctIndex: 3,
    videoSolution: "https://www.youtube.com/embed/estimation-multi-operations"
  }
], 
    7: [
  {
    text: "A scientific constant is known to be 6.02214076 × 10²³. Round this to five significant figures for a high school textbook.",
    answers: ["6.0221 × 10²³", "6.0220 × 10²³", "6.02214 × 10²³", "6.022 × 10²³"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-avogadro"
  },
  {
    text: "The distance between two cities is 123.456789 km. If you need to express this in meters with appropriate precision for a road sign, what should it be?",
    answers: ["123 km", "123.5 km", "123.46 km", "123.457 km"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-practical-applications"
  },
  {
    text: "A financial report shows a profit of $1,234,567.89. Round this appropriately for a executive summary to the nearest $10,000.",
    answers: ["$1,230,000", "$1,234,600", "$1,235,000", "$1,200,000"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-financial-reports"
  },
  {
    text: "Which rounding approach would be most appropriate for calculating medication dosage: always rounding up, always rounding down, or standard rounding?",
    answers: ["Always round up for safety", "Always round down to avoid overdose", "Standard rounding rules", "It depends on the specific medication"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-medical-context"
  },
  {
    text: "Estimate the value of (√2 + π) by first rounding each irrational number to three decimal places, then adding, then rounding the result to two decimal places.",
    answers: ["4.56", "4.55", "4.56", "4.55"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-irrational-numbers"
  },
  {
    text: "A measurement is 12.3456 cm with an uncertainty of ±0.0123 cm. How should this be properly reported with appropriate rounding?",
    answers: ["12.35 ± 0.01 cm", "12.346 ± 0.012 cm", "12.35 ± 0.012 cm", "12.3 ± 0.0 cm"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-with-uncertainty"
  },
  {
    text: "In statistical analysis, why might researchers sometimes use rounding down instead of standard rounding?",
    answers: ["To be conservative in estimates", "It's mathematically more accurate", "To minimize Type I errors", "There's never a reason to round down in statistics"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-statistical-context"
  },
  {
    text: "Round 9.999999 to the appropriate number of decimal places for a scientific measurement with precision to the nearest 0.001.",
    answers: ["10.000", "9.999", "10.00", "10.0"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-nines-precision"
  },
  {
    text: "A population grows from 1,234,567 to 1,345,678 in one year. Calculate the percentage increase, then round appropriately for a demographic report.",
    answers: ["9.0%", "8.99%", "9%", "8.995%"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-percentage-growth"
  },
  {
    text: "Which of these numbers, when rounded to two significant figures, would give a different result if rounded using the 'round half to even' method versus standard rounding?",
    answers: ["2.35", "1.75", "3.25", "4.65"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/round-half-even-vs-standard"
  },
  {
    text: "Estimate the product of 0.123456 × 789.012 by rounding each number to three significant figures first, then multiplying.",
    answers: ["97.4", "97.3", "97.0", "97.5"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimation-mixed-decimals"
  },
  {
    text: "A physics constant is 6.62607015 × 10⁻³⁴. Round this appropriately for an introductory college textbook.",
    answers: ["6.626 × 10⁻³⁴", "6.63 × 10⁻³⁴", "6.6261 × 10⁻³⁴", "6.62607 × 10⁻³⁴"],
    correctIndex: 1,
    videoSolution: "https://www.youtube.com/embed/rounding-physics-constants"
  },
  {
    text: "In computer science, why is rounding important when working with floating-point numbers?",
    answers: ["To prevent accumulation of rounding errors", "To make calculations faster", "To reduce memory usage", "All mathematical operations require rounding in computing"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-computer-science"
  },
  {
    text: "Round the result of 22/7 to a more accurate approximation of π than 3.14, using appropriate rounding.",
    answers: ["3.142857", "3.1429", "3.143", "3.14286"],
    correctIndex: 2,
    videoSolution: "https://www.youtube.com/embed/rounding-pi-approximation"
  },
  {
    text: "A scientific instrument measures to the nearest 0.0001 units but has a systematic error of ±0.00005 units. How should measurements from this instrument be rounded?",
    answers: ["To the nearest 0.0001", "To the nearest 0.00005", "To the nearest 0.001", "To the nearest 0.0002"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-with-systematic-error"
  },
  {
    text: "Estimate the value of e² (where e ≈ 2.71828) by rounding e to three significant figures first, then squaring, then rounding the result to three significant figures.",
    answers: ["7.39", "7.38", "7.40", "7.389"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/estimating-e-squared"
  },
  {
    text: "In financial calculations, why is it important to understand the difference between rounding intermediate steps versus rounding only the final result?",
    answers: ["Rounding intermediate steps can accumulate errors", "It affects tax calculations differently", "Banks use different rounding rules for intermediate steps", "There is no important difference"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-financial-calculations"
  },
  {
    text: "A measurement is recorded as 123.456 ± 0.789 units. What is the appropriate way to round both the measurement and uncertainty?",
    answers: ["123.5 ± 0.8", "123.46 ± 0.79", "123 ± 1", "123.456 ± 0.789"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-with-large-uncertainty"
  },
  {
    text: "Which of these demonstrates proper use of significant figures in a calculation: (12.34 × 5.6) or (12.34 × 5.60)?",
    answers: ["The first, as it reflects the precision of the least precise measurement", "The second, as it maintains more precision", "Both are equally valid", "It depends on the context of the measurement"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/sig-figs-multiplication"
  },
  {
    text: "A mathematical constant is known to be 1.6180339887... (the golden ratio). Round this appropriately for an architectural design where precision to 0.001 is sufficient.",
    answers: ["1.618", "1.6180", "1.62", "1.61803"],
    correctIndex: 0,
    videoSolution: "https://www.youtube.com/embed/rounding-golden-ratio"
  }
]
  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
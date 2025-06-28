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
        text: "Kofi sold 5,432 eggs in January and 6,789 eggs in February. How many eggs did he sell in total?",
        answers: ["12,121", "12,221", "12,311", "12,321"],
        correctIndex: 3,
        // videoSolution: ""
    },
    {
        text: "A company produced 78,450 bags of cement last year and plans to produce 80,000 this year. How many more bags will they produce?",
        answers: ["1,550", "1,450", "1,500", "1,600"],
        correctIndex: 0
    },
    {
        text: "Round 345,678 to the nearest thousand.",
        answers: ["346,000", "345,000", "344,000", "350,000"],
        correctIndex: 0
    },
    {
        text: "Ama saved Gh₵9,745. How much more does she need to reach Gh₵10,000?",
        answers: ["Gh₵245", "Gh₵255", "Gh₵275", "Gh₵215"],
        correctIndex: 0
    },
    {
        text: "Which of these numbers is the greatest?",
        answers: ["789,654", "798,645", "786,954", "789,645"],
        correctIndex: 1
    },
    {
        text: "What is the value of the digit 7 in 47,385?",
        answers: ["7,000", "700", "70", "70,000"],
        correctIndex: 0
    },
    {
        text: "Round 8,476 to the nearest hundred.",
        answers: ["8,500", "8,400", "8,450", "8,600"],
        correctIndex: 0
    },
    {
        text: "A farmer harvested 125,600 tubers of yam in 2023. If he plans to increase it by 10,000 this year, how many tubers will he harvest?",
        answers: ["135,600", "136,000", "134,600", "133,600"],
        correctIndex: 0
    },
    {
        text: "Write 506,000 in words.",
        answers: ["Five hundred six thousand", "Five hundred and six thousand", "Fifty-six thousand", "Five thousand sixty"],
        correctIndex: 1
    },
    {
        text: "Round 15,689 to the nearest ten thousand.",
        answers: ["20,000", "10,000", "15,000", "16,000"],
        correctIndex: 0
    },
    {
        text: "Which digit is in the ten thousand place of 63,247?",
        answers: ["6", "3", "2", "4"],
        correctIndex: 0
    },
    {
        text: "Compare: 905,000 ___ 950,000.",
        answers: ["<", ">", "=", "≥"],
        correctIndex: 0
    },
    {
        text: "A shop had 48,350 biscuits. It sold 25,450. How many are left?",
        answers: ["22,900", "23,000", "24,900", "25,000"],
        correctIndex: 0
    },
    {
        text: "Increase 99,999 by 1.",
        answers: ["100,000", "100,001", "99,999", "99,998"],
        correctIndex: 0
    },
    {
        text: "Which of these numbers is closest to 1 million?",
        answers: ["950,000", "990,000", "1,100,000", "900,000"],
        correctIndex: 1
    },
    {
        text: "Round 72,549 to the nearest thousand.",
        answers: ["73,000", "72,000", "70,000", "75,000"],
        correctIndex: 0
    },
    {
        text: "What is the difference between 600,000 and 475,000?",
        answers: ["125,000", "115,000", "135,000", "145,000"],
        correctIndex: 0
    },
    {
        text: "If a school has 2,345 boys and 2,789 girls, how many students are there in total?",
        answers: ["5,134", "5,124", "5,144", "5,154"],
        correctIndex: 0
    },
    {
        text: "Which is smaller: 305,670 or 350,670?",
        answers: ["305,670", "350,670", "They are equal", "Cannot be compared"],
        correctIndex: 0
    },
    {
        text: "The value of the digit 4 in 84,652 is:",
        answers: ["4,000", "400", "40,000", "400,000"],
        correctIndex: 0
    }
],
    2: [
    {
        text: "A shopkeeper recorded sales of Gh₵23,450 on Monday and Gh₵37,890 on Tuesday. How much did he earn over the two days?",
        answers: ["Gh₵61,340", "Gh₵60,340", "Gh₵62,340", "Gh₵61,440"],
        correctIndex: 0
    },
    {
        text: "A truck carried 18,760 bricks in the morning and 21,240 in the afternoon. How many bricks were delivered that day?",
        answers: ["40,200", "40,100", "40,000", "39,900"],
        correctIndex: 2
    },
    {
        text: "Round 487,563 to the nearest ten thousand.",
        answers: ["480,000", "485,000", "500,000", "490,000"],
        correctIndex: 3
    },
    {
        text: "What is the value of the digit 6 in 46,782?",
        answers: ["6,000", "600", "60", "60,000"],
        correctIndex: 0
    },
    {
        text: "A company makes 125,000 bottles in January and plans to triple production in February. How many bottles in February?",
        answers: ["375,000", "360,000", "350,000", "400,000"],
        correctIndex: 0
    },
    {
        text: "Estimate the sum of 48,635 and 53,472 by rounding both numbers to the nearest thousand before adding.",
        answers: ["103,000", "101,000", "104,000", "102,000"],
        correctIndex: 3
    },
    {
        text: "Which number is greatest?",
        answers: ["576,890", "567,890", "567,980", "567,899"],
        correctIndex: 0
    },
    {
        text: "Find the difference between 900,000 and 875,400.",
        answers: ["24,600", "34,600", "25,600", "35,600"],
        correctIndex: 0
    },
    {
        text: "Round 9,745 to the nearest hundred.",
        answers: ["9,700", "9,600", "9,800", "9,900"],
        correctIndex: 2
    },
    {
        text: "If a man saves Gh₵3,500 every month, how much does he save in a year?",
        answers: ["Gh₵48,000", "Gh₵40,000", "Gh₵42,000", "Gh₵36,000"],
        correctIndex: 2
    },
    {
        text: "A school has 12 classes with 45 pupils each. How many pupils in total?",
        answers: ["540", "550", "530", "560"],
        correctIndex: 0
    },
    {
        text: "Which digit is in the thousands place of 84,356?",
        answers: ["4", "8", "3", "5"],
        correctIndex: 0
    },
    {
        text: "Round 675,984 to the nearest hundred thousand.",
        answers: ["650,000", "600,000", "700,000", "680,000"],
        correctIndex: 2
    },
    {
        text: "A farmer harvested 234,580 coconuts. If he sells 120,000, how many are left?",
        answers: ["124,580", "114,580", "104,580", "110,580"],
        correctIndex: 1
    },
    {
        text: "Which of these numbers is closest to 500,000?",
        answers: ["498,000", "505,000", "499,500", "495,000"],
        correctIndex: 2
    },
    {
        text: "What is the value of the digit 9 in 9,876?",
        answers: ["9,000", "900", "90", "9"],
        correctIndex: 0
    },
    {
        text: "Round 45,378 to the nearest thousand.",
        answers: ["44,000", "46,000", "45,000", "47,000"],
        correctIndex: 1
    },
    {
        text: "Add: 345,000 + 456,000.",
        answers: ["801,500", "811,000", "801,000", "791,000"],
        correctIndex: 2
    },
    {
        text: "Compare: 745,321 ___ 754,123.",
        answers: ["<", ">", "=", "≥"],
        correctIndex: 0
    },
    {
        text: "A stadium holds 78,650 people. If 54,275 attended a match, how many seats were empty?",
        answers: ["25,375", "23,375", "24,375", "26,375"],
        correctIndex: 2
    }
],
    3:[
    {
        text: "A factory produced 456,789 bags of rice last year. This year, it produced 578,234 bags. How many bags were produced in the two years combined?",
        answers: ["1,035,023", "1,034,923", "1,035,033", "1,036,023"],
        correctIndex: 0
    },
    {
        text: "Round 2,456,789 to the nearest hundred thousand.",
        answers: ["2,500,000", "2,400,000", "2,460,000", "2,450,000"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 8 in the number 5,487,632?",
        answers: ["80,000", "800,000", "8,000", "8"],
        correctIndex: 1
    },
    {
        text: "Which number is the greatest?",
        answers: ["3,456,789", "3,654,789", "3,546,789", "3,465,789"],
        correctIndex: 1
    },
    {
        text: "A company bought two machines costing Gh₵345,600 and Gh₵789,400 respectively. What was the total cost?",
        answers: ["Gh₵1,135,000", "Gh₵1,125,000", "Gh₵1,134,000", "Gh₵1,124,000"],
        correctIndex: 0
    },
    {
        text: "Round 987,654 to the nearest ten thousand.",
        answers: ["990,000", "980,000", "985,000", "995,000"],
        correctIndex: 0
    },
    {
        text: "Find the difference between 1,500,000 and 1,234,567.",
        answers: ["265,433", "266,433", "265,343", "266,343"],
        correctIndex: 0
    },
    {
        text: "Estimate 456,789 + 789,321 by rounding both to the nearest hundred thousand before adding.",
        answers: ["1,200,000", "1,300,000", "1,400,000", "1,250,000"],
        correctIndex: 0
    },
    {
        text: "Which digit is in the hundred thousands place of 3,245,678?",
        answers: ["2", "4", "3", "5"],
        correctIndex: 0
    },
    {
        text: "A school library has 234,567 books. If 45,678 books are damaged, how many are left?",
        answers: ["188,889", "188,889", "189,889", "190,889"],
        correctIndex: 0
    },
    {
        text: "Round 3,456,789 to the nearest million.",
        answers: ["3,000,000", "4,000,000", "3,500,000", "3,600,000"],
        correctIndex: 2
    },
    {
        text: "A farmer harvested 678,345 mangoes this season. Next season, he expects to harvest 700,000. What is the expected increase?",
        answers: ["21,655", "22,655", "23,655", "24,655"],
        correctIndex: 0
    },
    {
        text: "Which number is smallest?",
        answers: ["908,765", "980,765", "890,765", "809,765"],
        correctIndex: 3
    },
    {
        text: "The value of the digit 7 in 7,654,321 is:",
        answers: ["7,000,000", "700,000", "70,000", "7,000"],
        correctIndex: 0
    },
    {
        text: "Add: 1,234,000 + 2,345,000.",
        answers: ["3,579,000", "3,578,000", "3,589,000", "3,588,000"],
        correctIndex: 0
    },
    {
        text: "Compare: 4,567,890 ___ 4,576,890.",
        answers: ["<", ">", "=", "≤"],
        correctIndex: 0
    },
    {
        text: "Round 678,901 to the nearest thousand.",
        answers: ["679,000", "678,000", "680,000", "675,000"],
        correctIndex: 0
    },
    {
        text: "A stadium holds 95,000 people. If 87,654 people attended a concert, how many seats were empty?",
        answers: ["7,346", "7,256", "7,454", "7,556"],
        correctIndex: 0
    },
    {
        text: "If each of 25 schools has 1,240 students, how many students are there in all?",
        answers: ["31,000", "30,000", "31,200", "32,000"],
        correctIndex: 2
    },
    {
        text: "What is the difference between 2,000,000 and 1,876,543?",
        answers: ["123,457", "124,457", "125,457", "126,457"],
        correctIndex: 0
    }
], 
    4:[
    {
        text: "A mining company extracted 7,456,789 tonnes of ore in 2022 and 8,345,678 tonnes in 2023. What was the total extraction over the two years?",
        answers: ["15,801,467", "15,802,567", "15,802,467", "15,801,567"],
        correctIndex: 2
    },
    {
        text: "Round 23,456,789 to the nearest million.",
        answers: ["23,500,000", "23,000,000", "22,000,000", "24,000,000"],
        correctIndex: 3
    },
    {
        text: "What is the value of the digit 4 in 54,678,912?",
        answers: ["40,000,000", "400,000", "4,000,000", "4,000"],
        correctIndex: 2
    },
    {
        text: "Estimate the sum of 15,678,900 and 24,345,600 by rounding each to the nearest million before adding.",
        answers: ["39,000,000", "41,000,000", "40,000,000", "42,000,000"],
        correctIndex: 2
    },
    {
        text: "Which number is smallest?",
        answers: ["65,789,012", "75,789,012", "85,789,012", "56,789,012"],
        correctIndex: 3
    },
    {
        text: "Round 6,789,123 to the nearest ten thousand.",
        answers: ["6,800,000", "6,770,000", "6,790,000", "6,780,000"],
        correctIndex: 2
    },
    {
        text: "If a town’s population increased from 1,234,567 to 1,789,654 in 10 years, what was the increase?",
        answers: ["555,097", "554,087", "555,087", "554,097"],
        correctIndex: 2
    },
    {
        text: "What is the value of the digit 9 in 92,345,678?",
        answers: ["9,000,000", "900,000", "9,000", "90,000,000"],
        correctIndex: 3
    },
    {
        text: "Round 87,654,321 to the nearest ten million.",
        answers: ["89,000,000", "80,000,000", "90,000,000", "88,000,000"],
        correctIndex: 2
    },
    {
        text: "Which digit is in the millions place of 24,567,890?",
        answers: ["4", "5", "6", "7"],
        correctIndex: 0
    },
    {
        text: "A company earned Gh₵12,345,000 last year and Gh₵15,678,000 this year. How much more did they earn this year?",
        answers: ["3,344,000", "3,343,000", "3,333,000", "3,334,000"],
        correctIndex: 2
    },
    {
        text: "Estimate the difference between 48,765,432 and 37,654,321 by rounding both to the nearest million first.",
        answers: ["10,000,000", "11,000,000", "12,000,000", "13,000,000"],
        correctIndex: 1
    },
    {
        text: "Compare: 89,765,432 ___ 98,765,432",
        answers: ["<", ">", "=", "≥"],
        correctIndex: 0
    },
    {
        text: "Round 54,321,987 to the nearest hundred thousand.",
        answers: ["54,500,000", "54,400,000", "54,000,000", "54,300,000"],
        correctIndex: 3
    },
    {
        text: "Find the difference between 100,000,000 and 87,654,321.",
        answers: ["12,345,669", "12,345,659", "12,345,679", "12,345,689"],
        correctIndex: 2
    },
    {
        text: "Which digit is in the hundred millions place of 234,567,890?",
        answers: ["3", "2", "5", "4"],
        correctIndex: 1
    },
    {
        text: "A school expects to receive 3,456,789 textbooks over 4 years. About how many textbooks is this each year, rounded to the nearest thousand?",
        answers: ["865,000", "866,000", "864,000", "867,000"],
        correctIndex: 0
    },
    {
        text: "Round 76,543,210 to the nearest million.",
        answers: ["75,000,000", "77,000,000", "76,000,000", "78,000,000"],
        correctIndex: 1
    },
    {
        text: "Which is closest to 100 million?",
        answers: ["101,000,000", "90,000,000", "95,000,000", "99,500,000"],
        correctIndex: 3
    },
    {
        text: "What is the value of the digit 7 in 7,654,321?",
        answers: ["700,000", "7,000,000", "70,000", "7,000"],
        correctIndex: 1
    }
], 
    5: [
    {
        text: "A city had a population of 98,765,432 in 2020. By 2025, it grew by 12,345,678. What is the population in 2025?",
        answers: ["111,111,130", "111,111,110", "111,111,100", "111,111,120"],
        correctIndex: 1
    },
    {
        text: "Round 456,789,123 to the nearest ten million.",
        answers: ["455,000,000", "460,000,000", "465,000,000", "450,000,000"],
        correctIndex: 1
    },
    {
        text: "What is the value of the digit 6 in 674,321,987?",
        answers: ["600,000,000", "60,000,000", "6,000,000", "600,000"],
        correctIndex: 0
    },
    {
        text: "Estimate the sum of 345,678,901 and 254,321,098 by rounding each to the nearest million before adding.",
        answers: ["600,000,000", "590,000,000", "580,000,000", "610,000,000"],
        correctIndex: 0
    },
    {
        text: "Which number is smallest?",
        answers: ["768,123,456", "678,123,456", "687,123,456", "876,123,456"],
        correctIndex: 1
    },
    {
        text: "Round 98,765,432 to the nearest million.",
        answers: ["99,000,000", "98,000,000", "97,000,000", "100,000,000"],
        correctIndex: 0
    },
    {
        text: "If a country’s budget increased from Gh₵345,678,000 to Gh₵456,789,000, what was the increase?",
        answers: ["111,113,000", "111,112,000", "111,111,000", "111,110,000"],
        correctIndex: 2
    },
    {
        text: "What is the value of the digit 8 in 84,567,321?",
        answers: ["8,000,000", "80,000,000", "800,000", "8,000"],
        correctIndex: 1
    },
    {
        text: "Round 234,567,890 to the nearest hundred million.",
        answers: ["250,000,000", "230,000,000", "200,000,000", "300,000,000"],
        correctIndex: 2
    },
    {
        text: "Which digit is in the ten million place of 54,321,987?",
        answers: ["4", "5", "3", "2"],
        correctIndex: 0
    },
    {
        text: "A company shipped 765,432,100 cartons in January and 876,543,200 in February. How many cartons altogether?",
        answers: ["1,641,975,100", "1,641,975,200", "1,641,975,300", "1,641,975,400"],
        correctIndex: 2
    },
    {
        text: "Estimate the difference between 987,654,321 and 876,543,210 by rounding both to the nearest million first.",
        answers: ["110,000,000", "111,000,000", "112,000,000", "113,000,000"],
        correctIndex: 1
    },
    {
        text: "Compare: 654,321,987 ___ 654,312,987",
        answers: ["<", ">", "=", "≤"],
        correctIndex: 1
    },
    {
        text: "Round 543,219,876 to the nearest million.",
        answers: ["545,000,000", "543,000,000", "544,000,000", "546,000,000"],
        correctIndex: 1
    },
    {
        text: "Find the difference between 1,000,000,000 and 987,654,321.",
        answers: ["12,345,689", "12,345,679", "12,345,669", "12,345,659"],
        correctIndex: 1
    },
    {
        text: "Which digit is in the hundred million place of 987,654,321?",
        answers: ["8", "7", "9", "6"],
        correctIndex: 2
    },
    {
        text: "A school will receive 456,789,000 pencils over 3 years. About how many pencils per year is this, rounded to the nearest thousand?",
        answers: ["152,263,000", "152,260,000", "152,265,000", "152,250,000"],
        correctIndex: 1
    },
    {
        text: "Round 678,901,234 to the nearest ten million.",
        answers: ["680,000,000", "670,000,000", "675,000,000", "685,000,000"],
        correctIndex: 0
    },
    {
        text: "Which is closest to 1 billion?",
        answers: ["999,000,000", "950,000,000", "1,050,000,000", "900,000,000"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 5 in 5,432,109,876?",
        answers: ["5,000,000,000", "50,000,000", "5,000,000", "500,000,000"],
        correctIndex: 0
    }
], 
    6: [
     {
        text: "A country’s population increased from 432,109,876 to 543,210,987. What was the increase?",
        answers: ["111,101,121", "111,101,111", "111,101,101", "111,101,131"],
        correctIndex: 1
    },
    {
        text: "Round 765,432,198 to the nearest ten million.",
        answers: ["760,000,000", "770,000,000", "780,000,000", "750,000,000"],
        correctIndex: 1
    },
    {
        text: "What is the value of the digit 4 in 94,567,321?",
        answers: ["4,000,000", "400,000", "40,000,000", "4,000"],
        correctIndex: 2
    },
    {
        text: "Estimate 345,678,901 + 654,321,098 by rounding to the nearest hundred million first.",
        answers: ["1,000,000,000", "1,100,000,000", "900,000,000", "1,200,000,000"],
        correctIndex: 1
    },
    {
        text: "Which is the smallest?",
        answers: ["765,432,100", "876,543,200", "654,321,000", "543,210,000"],
        correctIndex: 3
    },
    {
        text: "Round 987,654,321 to the nearest hundred thousand.",
        answers: ["987,600,000", "987,700,000", "987,500,000", "987,650,000"],
        correctIndex: 0
    },
    {
        text: "A company earned Gh₵654,321,987 last year and Gh₵765,432,198 this year. How much more did it earn this year?",
        answers: ["111,110,211", "111,110,101", "111,110,121", "111,110,111"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 8 in 876,543,210?",
        answers: ["8,000,000", "800,000,000", "80,000,000", "8,000,000,000"],
        correctIndex: 1
    },
    {
        text: "Round 123,456,789 to the nearest million.",
        answers: ["123,000,000", "124,000,000", "122,000,000", "125,000,000"],
        correctIndex: 0
    },
    {
        text: "Which digit is in the ten million place of 345,678,901?",
        answers: ["4", "5", "6", "3"],
        correctIndex: 1
    },
    {
        text: "A stadium seats 87,654,321 people. If 75,432,198 attended, how many seats were empty?",
        answers: ["12,222,123", "12,222,133", "12,222,113", "12,222,103"],
        correctIndex: 0
    },
    {
        text: "Estimate the difference between 654,321,987 and 543,210,876 by rounding to the nearest million.",
        answers: ["111,000,000", "110,000,000", "112,000,000", "113,000,000"],
        correctIndex: 0
    },
    {
        text: "Compare: 876,543,210 ___ 765,432,198",
        answers: [">", "<", "=", "≤"],
        correctIndex: 0
    },
    {
        text: "Round 234,567,890 to the nearest hundred million.",
        answers: ["200,000,000", "250,000,000", "230,000,000", "300,000,000"],
        correctIndex: 0
    },
    {
        text: "Find the difference between 1,000,000,000 and 876,543,210.",
        answers: ["123,456,790", "123,456,780", "123,456,770", "123,456,760"],
        correctIndex: 0
    },
    {
        text: "Which digit is in the hundred million place of 987,654,321?",
        answers: ["9", "8", "7", "6"],
        correctIndex: 0
    },
    {
        text: "A school will receive 345,678,900 pencils over 3 years. How many per year, rounded to the nearest thousand?",
        answers: ["115,226,000", "115,227,000", "115,225,000", "115,224,000"],
        correctIndex: 0
    },
    {
        text: "Round 654,321,987 to the nearest ten million.",
        answers: ["650,000,000", "660,000,000", "670,000,000", "640,000,000"],
        correctIndex: 1
    },
    {
        text: "Which is closest to 1 billion?",
        answers: ["999,000,000", "950,000,000", "1,050,000,000", "900,000,000"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 5 in 5,432,109,876?",
        answers: ["5,000,000,000", "50,000,000", "500,000,000", "5,000,000"],
        correctIndex: 0
    }
], 
    7: [
     {
        text: "A country increased its revenue from 876,543,210 to 987,654,321. By how much did it increase?",
        answers: ["111,111,101", "111,111,100", "111,111,110", "111,111,120"],
        correctIndex: 1
    },
    {
        text: "Round 1,234,567,890 to the nearest hundred million.",
        answers: ["1,200,000,000", "1,300,000,000", "1,250,000,000", "1,100,000,000"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 2 in 2,345,678,901?",
        answers: ["2,000,000,000", "200,000,000", "20,000,000", "200,000"],
        correctIndex: 0
    },
    {
        text: "Estimate 654,321,098 + 345,678,901 by rounding each to the nearest hundred million first.",
        answers: ["1,000,000,000", "900,000,000", "1,100,000,000", "1,200,000,000"],
        correctIndex: 2
    },
    {
        text: "Which is the largest?",
        answers: ["876,543,210", "765,432,109", "987,654,321", "654,321,098"],
        correctIndex: 2
    },
    {
        text: "Round 543,219,876 to the nearest million.",
        answers: ["544,000,000", "543,000,000", "545,000,000", "542,000,000"],
        correctIndex: 1
    },
    {
        text: "A company's profit dropped from Gh₵1,234,567,890 to Gh₵987,654,321. What was the decrease?",
        answers: ["246,913,579", "246,913,569", "246,913,589", "246,913,599"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 9 in 987,654,321?",
        answers: ["900,000,000", "90,000,000", "9,000,000", "900,000"],
        correctIndex: 0
    },
    {
        text: "Round 876,543,210 to the nearest ten million.",
        answers: ["880,000,000", "870,000,000", "890,000,000", "860,000,000"],
        correctIndex: 1
    },
    {
        text: "Which digit is in the hundred million place of 654,321,987?",
        answers: ["6", "5", "4", "3"],
        correctIndex: 0
    },
    {
        text: "If a city has 1,234,567,890 people and another city has 987,654,321, how many people altogether?",
        answers: ["2,222,222,211", "2,222,222,221", "2,222,222,231", "2,222,222,241"],
        correctIndex: 1
    },
    {
        text: "Estimate the difference between 1,000,000,000 and 876,543,210 by rounding both to the nearest hundred million.",
        answers: ["100,000,000", "200,000,000", "300,000,000", "150,000,000"],
        correctIndex: 0
    },
    {
        text: "Compare: 1,234,567,890 ___ 987,654,321",
        answers: [">", "<", "=", "≤"],
        correctIndex: 0
    },
    {
        text: "Round 765,432,109 to the nearest million.",
        answers: ["765,000,000", "766,000,000", "764,000,000", "767,000,000"],
        correctIndex: 0
    },
    {
        text: "Find the difference between 2,000,000,000 and 1,876,543,210.",
        answers: ["123,456,790", "123,456,780", "123,456,770", "123,456,760"],
        correctIndex: 0
    },
    {
        text: "Which digit is in the ten million place of 987,654,321?",
        answers: ["8", "7", "6", "5"],
        correctIndex: 1
    },
    {
        text: "A government plans to distribute 987,654,321 masks equally over 9 months. About how many per month (nearest thousand)?",
        answers: ["109,739,000", "109,739", "109,739,000,000", "110,000,000"],
        correctIndex: 0
    },
    {
        text: "Round 654,321,987 to the nearest hundred million.",
        answers: ["600,000,000", "700,000,000", "650,000,000", "750,000,000"],
        correctIndex: 1
    },
    {
        text: "Which is closest to 2 billion?",
        answers: ["1,950,000,000", "2,050,000,000", "2,100,000,000", "1,900,000,000"],
        correctIndex: 0
    },
    {
        text: "What is the value of the digit 4 in 4,321,098,765?",
        answers: ["4,000,000,000", "400,000,000", "40,000,000", "4,000,000"],
        correctIndex: 0
    }
]
  };

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu code (keep your existing code here)
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    //--------The Game----------------
    const questions = [
        // Add at least 140 unique questions (20 per level × 7 levels)
        {
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        {
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        {
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        // Add more questions here...
    ];

    // Game Variables
    let currentLevel = 1;
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questionCount = 0;
    let score = 0;
    const questionsPerLevel = 20;
    const requiredCorrect = 15;
    const totalLevels = 7;
    let timer;
    let timeLeft = 60; // Set timer to 1 minute (60 seconds)
    let usedQuestions = []; // Track used questions to avoid repetition

    // DOM Elements
    const startButton = document.getElementById("start-btn");
    const gameContent = document.getElementById("game-content");
    const levelDisplay = document.getElementById("level");
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-btn");
    const videoContainer = document.getElementById("video-container");
    const scoreDisplay = document.getElementById("score-value");
    const timerDisplay = document.getElementById("time");

    // Start Game Button
    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        gameContent.style.display = "block";
        shuffleArray(questions);
        loadQuestion();
    });

    // Shuffle Questions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Load Question
    function loadQuestion() {
        stopTimer();
        feedbackElement.innerHTML = "";
        nextButton.style.display = "none";
        videoContainer.innerHTML = "";

        if (questionCount >= questionsPerLevel) {
            checkLevelProgress();
            return;
        }

        const questionData = questions[currentQuestionIndex];
        questionElement.innerHTML = questionData.question; // Use innerHTML for LaTeX
        MathJax.typeset(); // Render LaTeX in the question

        choicesElement.innerHTML = "";
        questionData.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.innerHTML = choice; // Use innerHTML for LaTeX in choices
            button.onclick = () => checkAnswer(index, questionData.correct, questionData.video);
            choicesElement.appendChild(button);
        });

        questionCount++;
        startTimer();

        // Update progress bar
        const progress = (questionCount / questionsPerLevel) * 100;
        document.getElementById("progress-bar").style.width = `${progress}%`;

        // Render LaTeX in choices
        MathJax.typeset();
    }

    // Check Answer
    function checkAnswer(selectedIndex, correctIndex, videoUrl) {
        if (selectedIndex === correctIndex) {
            feedbackElement.innerText = "Correct!";
            feedbackElement.className = "correct";
            correctAnswers++;
            score += 10;
            scoreDisplay.innerText = score;
            nextButton.style.display = "block";
        } else {
            feedbackElement.innerText = "Wrong! Watch the video below before continuing.";
            feedbackElement.className = "wrong";
            videoContainer.innerHTML = `<iframe width="100%" height="200" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
            nextButton.style.display = "block";
        }
    }

    // Check Level Progress
    function checkLevelProgress() {
        if (correctAnswers >= requiredCorrect) {
            if (currentLevel < totalLevels) {
                alert(`🎉 Congratulations! You've passed Level ${currentLevel}. Moving to Level ${currentLevel + 1}`);
                currentLevel++;
                correctAnswers = 0;
                questionCount = 0;
                usedQuestions = [];
                levelDisplay.innerText = `Level: ${currentLevel}`;
                shuffleArray(questions);
                loadQuestion();
            } else {
                alert("🏆 You are the Champion of this Topic!");
                resetGame();
            }
        } else {
            alert(`😢 You did not pass Level ${currentLevel}. Try again.`);
            correctAnswers = 0;
            questionCount = 0;
            usedQuestions = [];
            loadQuestion();
        }
    }

    // Reset Game
    function resetGame() {
        currentLevel = 1;
        correctAnswers = 0;
        questionCount = 0;
        score = 0;
        scoreDisplay.innerText = score;
        levelDisplay.innerText = `Level: ${currentLevel}`;
        usedQuestions = [];
        shuffleArray(questions);
        loadQuestion();
    }

    // Next Button
    nextButton.addEventListener("click", () => {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        loadQuestion();
    });

    // Restart Button
    document.getElementById("restart-btn").addEventListener("click", resetGame);

    // Timer Functions
    function startTimer() {
        timeLeft = 60; // Reset timer to 1 minute
        timerDisplay.innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackElement.innerText = "Time's up!";
                feedbackElement.className = "wrong";
                videoContainer.innerHTML = `<iframe width="100%" height="200" src="${questions[currentQuestionIndex].video}" frameborder="0" allowfullscreen></iframe>`;
                nextButton.style.display = "block";
            }
        }, 1000); // Update every second
    }

    function stopTimer() {
        clearInterval(timer);
    }
});
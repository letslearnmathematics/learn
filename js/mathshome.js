document.addEventListener("DOMContentLoaded", () => {
    // Hamburger Menu Code
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

    // DOM Elements for Quiz
    const nameInputSection = document.getElementById("name-input-section");
    const quizContent = document.getElementById("quiz-content");
    const championSection = document.getElementById("champion-section");
    const startQuizButton = document.getElementById("start-quiz-btn");
    const nameInput = document.getElementById("name");
    const levelDisplay = document.getElementById("level");
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-btn");
    const videoContainer = document.getElementById("video-container");
    const scoreDisplay = document.getElementById("score-value");
    const timerDisplay = document.getElementById("time");
    const restartLevelButton = document.getElementById("restart-level-btn");
    const restartGameButton = document.getElementById("restart-game-btn");
    const playAgainButton = document.getElementById("play-again-btn");
    const championName = document.getElementById("champion-name");

    // Game Variables
    let studentName = "";
    let currentLevel = 1;
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let score = 0;
    const questionsPerLevel = 20;
    const requiredCorrect = 15;
    const totalLevels = 7;
    let timer;
    let timeLeft = 60;
    let questions = [];

    // Start Quiz Button
    startQuizButton.addEventListener("click", () => {
        studentName = nameInput.value.trim();
        if (studentName === "") {
            alert("Please enter your name.");
            return;
        }
        nameInputSection.style.display = "none";
        quizContent.style.display = "block";
        loadQuestions();
    });

    // Load Questions
    function loadQuestions() {
        // Simulate loading 700 questions (100 per level)
        questions = Array.from({ length: 700 }, (_, i) => ({
            question: `Question ${i + 1}`,
            choices: ["A", "B", "C", "D"],
            correct: Math.floor(Math.random() * 4),
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        }));
        startLevel();
    }

    // Start Level
    function startLevel() {
        currentQuestionIndex = 0;
        correctAnswers = 0;
        score = 0;
        scoreDisplay.innerText = score;
        levelDisplay.innerText = `Level: ${currentLevel}`;
        loadQuestion();
    }

    // Load Question
    function loadQuestion() {
        stopTimer();
        feedbackElement.innerHTML = "";
        nextButton.style.display = "none";
        videoContainer.innerHTML = "";
        restartLevelButton.style.display = "none";

        if (currentQuestionIndex >= questionsPerLevel) {
            checkLevelProgress();
            return;
        }

        const questionData = questions[(currentLevel - 1) * 100 + currentQuestionIndex];
        questionElement.innerHTML = questionData.question;
        MathJax.typeset();

        choicesElement.innerHTML = "";
        questionData.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.innerHTML = choice;
            button.onclick = () => checkAnswer(index, questionData.correct, questionData.video);
            choicesElement.appendChild(button);
        });

        currentQuestionIndex++;
        startTimer();
        document.getElementById("progress-bar").style.width = `${(currentQuestionIndex / questionsPerLevel) * 100}%`;
    }

    // Check Answer
    function checkAnswer(selectedIndex, correctIndex, videoUrl) {
        stopTimer();
        if (selectedIndex === correctIndex) {
            feedbackElement.innerText = "Correct!";
            feedbackElement.className = "correct";
            correctAnswers++;
            score++;
            scoreDisplay.innerText = score;
            nextButton.style.display = "block";
        } else {
            feedbackElement.innerHTML = "Wrong! Watch the video below for the solution.";
            feedbackElement.className = "wrong";
            videoContainer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
            nextButton.style.display = "block";
        }
    }

    // Check Level Progress
    function checkLevelProgress() {
        if (correctAnswers >= requiredCorrect) {
            if (currentLevel < totalLevels) {
                alert(`🎉 Congratulations! You've passed Level ${currentLevel}. Moving to Level ${currentLevel + 1}`);
                currentLevel++;
                startLevel();
            } else {
                quizContent.style.display = "none";
                championSection.style.display = "block";
                championName.innerText = studentName;
            }
        } else {
            alert(`😢 You did not pass Level ${currentLevel}. Try again.`);
            restartLevelButton.style.display = "block";
        }
    }

    // Restart Level Button
    restartLevelButton.addEventListener("click", startLevel);

    // Restart Game Button
    restartGameButton.addEventListener("click", () => {
        currentLevel = 1;
        quizContent.style.display = "block";
        championSection.style.display = "none";
        startLevel();
    });

    // Play Again Button
    playAgainButton.addEventListener("click", () => {
        currentLevel = 1;
        quizContent.style.display = "block";
        championSection.style.display = "none";
        startLevel();
    });

    // Timer Functions
    function startTimer() {
        timeLeft = 60;
        timerDisplay.innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackElement.innerText = "Time's up!";
                feedbackElement.className = "wrong";
                videoContainer.innerHTML = `<iframe src="${questions[(currentLevel - 1) * 100 + currentQuestionIndex - 1].video}" frameborder="0" allowfullscreen></iframe>`;
                nextButton.style.display = "block";
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
});
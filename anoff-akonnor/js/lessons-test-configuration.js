// BECE Test General JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize test variables
    const questionBank = [];
    const questionElements = document.querySelectorAll('#question-bank .question');
    
    // Convert HTML questions to question bank format
    questionElements.forEach(questionEl => {
        const question = {
            question: questionEl.querySelector('.question-text').innerHTML,
            options: [],
            solutionVideo: questionEl.dataset.solution
        };
        
        const options = questionEl.querySelectorAll('.option');
        options.forEach(optionEl => {
            question.options.push({
                text: optionEl.innerHTML,
                correct: optionEl.dataset.correct === 'true'
            });
        });
        
        questionBank.push(question);
    });

    const totalQuestions = questionBank.length;
    const testDuration = 60 * 60; // 60 minutes in seconds
    let timeLeft = testDuration;
    let timerInterval;
    let currentQuestion = 0;
    let userAnswers = new Array(totalQuestions).fill(null);
    let testSubmitted = false;

    // DOM Elements
    const testContent = document.getElementById('test-content');
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const reviewBtn = document.getElementById('review-btn');
    const questionCounter = document.getElementById('question-counter');
    const timerDisplay = document.getElementById('timer-display');
    const testWarning = document.getElementById('test-warning');
    const scoreDisplay = document.getElementById('score-display');
    const progressFill = document.querySelector('.progress-fill');
    const testContainer = document.querySelector('.test-container');

    // Wait for MathJax to be ready before showing content
    function waitForMathJax() {
        if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
            // MathJax is ready, show welcome screen
            showWelcomeScreen();
        } else {
            // MathJax not ready yet, try again after a short delay
            setTimeout(waitForMathJax, 100);
        }
    }

    // Show welcome screen initially
    function showWelcomeScreen() {
        testContent.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-card">
                    <h2><i class="fas fa-graduation-cap"></i> 100 Questions/hr Challenge.</h2>
                    <div class="test-info">
                        <p><i class="fas fa-list-ol"></i> <strong>${totalQuestions} questions</strong> in total.</p>
                        <p><i class="fas fa-clock"></i> <strong>60 minutes</strong> time limit</p>
                        <p><i class="fas fa-check-circle"></i> Multiple choice format</p>
                    </div>
                    <div class="instructions">
                        <h3>Instructions:</h3>
                        <ol>
                            <li>Read each question carefully before answering</li>
                            <li>You can navigate between questions using Previous/Next buttons</li>
                            <li>The timer will automatically submit your test when time is up</li>
                            <li>You can submit at any time using the Submit button</li>
                        </ol>
                    </div>
                    <button id="start-test-btn" class="start-test-btn">
                        <i class="fas fa-play"></i> Begin Test
                    </button>
                </div>
            </div>
        `;

        // Render MathJax for any static content in welcome screen
        if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise().catch(err => console.log('MathJax welcome screen typeset error:', err));
        }

        document.getElementById('start-test-btn').addEventListener('click', initTest);
    }

    function initTest() {
        testContent.innerHTML = '';
        loadQuestion(currentQuestion);
        startTimer();

        // Set up event listeners
        prevBtn.addEventListener('click', goToPreviousQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);
        submitBtn.addEventListener('click', submitTest);
        reviewBtn.addEventListener('click', restartTest);
    }

    function loadQuestion(index) {
        if (index < 0 || index >= questionBank.length) return;

        currentQuestion = index;
        updateQuestionCounter();
        
        const question = questionBank[index];
        let optionsHTML = '';

        question.options.forEach((option, i) => {
            const optionLetter = String.fromCharCode(65 + i);
            const isSelected = userAnswers[index] === i;
            const selectedClass = isSelected ? 'selected' : '';
            optionsHTML += `
                <div class="option ${selectedClass}" data-index="${i}">
                    <span class="option-letter">${optionLetter}.</span>
                    <span class="option-text">${option.text}</span>
                </div>
            `;
        });

        testContent.innerHTML = `
            <div class="question-card active">
                <div class="question-text">${question.question}</div>
                <div class="options-container">${optionsHTML}</div>
            </div>
        `;

        // Add click event to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                if (testSubmitted) return;
                const selectedIndex = parseInt(this.dataset.index);
                userAnswers[currentQuestion] = selectedIndex;
                document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Update MathJax rendering with error handling
        renderMathJax();
    }

    function renderMathJax() {
        if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise()
                .then(() => console.log('MathJax rendering complete for question', currentQuestion + 1))
                .catch(err => console.error('MathJax rendering error:', err));
        } else {
            console.warn('MathJax not loaded yet, retrying...');
            // If MathJax isn't loaded, try again after a short delay
            setTimeout(renderMathJax, 100);
        }
    }

    function updateQuestionCounter() {
        questionCounter.textContent = `Question ${currentQuestion + 1} of ${totalQuestions}`;
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.disabled = currentQuestion === totalQuestions - 1;
    }

    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            loadQuestion(currentQuestion - 1);
        }
    }

    function goToNextQuestion() {
        if (currentQuestion < totalQuestions - 1) {
            loadQuestion(currentQuestion + 1);
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 300 && timeLeft > 60) { // 5 minutes left
            timerDisplay.classList.add('timer-warning');
            testWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Time is running out! Only 5 minutes remaining.';
            testWarning.style.display = 'block';
        }
        
        if (timeLeft <= 60) { // 1 minute left
            timerDisplay.classList.add('timer-critical');
            testWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Hurry! Less than 1 minute remaining!';
            testWarning.style.display = 'block';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const progressPercentage = (timeLeft / testDuration) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update progress bar color based on time left
        if (progressPercentage <= 20) {
            progressFill.style.backgroundColor = '#ff4444';
        } else if (progressPercentage <= 50) {
            progressFill.style.backgroundColor = '#ffbb33';
        } else {
            progressFill.style.backgroundColor = '#00C851';
        }
    }

    function submitTest() {
        if (testSubmitted) return;
        clearInterval(timerInterval);
        testSubmitted = true;

        // Calculate score
        let score = 0;
        for (let i = 0; i < totalQuestions; i++) {
            if (userAnswers[i] !== null && questionBank[i].options[userAnswers[i]].correct) {
                score++;
            }
        }

        // Display results
        scoreDisplay.textContent = `You scored ${score} out of ${totalQuestions}`;
        showResults(score);
        testContainer.style.display = 'none';
        resultsSection.style.display = 'block';
    }

    function showResults(score) {
        let resultsHTML = '<div class="results-grid">';

        for (let i = 0; i < totalQuestions; i++) {
            const question = questionBank[i];
            const userAnswer = userAnswers[i];
            const isCorrect = userAnswer !== null && question.options[userAnswer].correct;
            const correctAnswerIndex = question.options.findIndex(opt => opt.correct);
            const correctAnswerLetter = String.fromCharCode(65 + correctAnswerIndex);

            resultsHTML += `
                <div class="result-card ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-preview">${question.question}</div>
                    <div class="user-answer">Your answer: ${userAnswer !== null ? String.fromCharCode(65 + userAnswer) : 'Not answered'}</div>
                    <div class="correct-answer">Correct answer: ${correctAnswerLetter}</div>
                    <button class="view-solution">View Solution</button>
                    <div class="solution-video" style="display: none;">
                        <iframe width="100%" height="315" src="${question.solutionVideo}" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            `;
        }

        resultsHTML += '</div>';
        resultsContent.innerHTML = resultsHTML;

        // Add click event to solution buttons
        document.querySelectorAll('.view-solution').forEach(button => {
            button.addEventListener('click', function() {
                const video = this.nextElementSibling;
                video.style.display = video.style.display === 'none' ? 'block' : 'none';
                renderMathJax();
            });
        });

        // Update MathJax after results are loaded
        renderMathJax();
    }

    function restartTest() {
        // Reset test variables
        timeLeft = testDuration;
        currentQuestion = 0;
        userAnswers = new Array(totalQuestions).fill(null);
        testSubmitted = false;

        // Reset UI elements
        timerDisplay.textContent = '60:00';
        timerDisplay.className = '';
        progressFill.style.width = '100%';
        progressFill.style.backgroundColor = '#00C851';
        testWarning.style.display = 'none';

        // Show test container and hide results
        testContainer.style.display = 'block';
        resultsSection.style.display = 'none';

        // Reload first question and start timer
        loadQuestion(0);
        startTimer();
    }

    // Start by waiting for MathJax to be ready
    waitForMathJax();
});
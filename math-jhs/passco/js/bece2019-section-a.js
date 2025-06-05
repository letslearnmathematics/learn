// BECE 2019 Section A JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize test variables
    const questionBank = [
        {
            question: "Question 1: <br><br> Given that $A = \\{2, 4, 6, 8, 10\\}$ and $B = \\{4, 8, 12\\}$, find $A \\cup B$?",
            options: [
                { text: "$\\{4, 8\\}$", correct: false },
                { text: "$\\{2, 8, 12\\}$", correct: false },
                { text: "$\\{4, 6, 8, 12\\}$", correct: false },
                { text: "$\\{2, 4, 6, 8, 10, 12\\}$", correct: true }
            ],
            solutionVideo: "https://www.youtube.com/embed/example1"
        },
        {
            question: "Question 2: <br><br> Express 0.000344 in standard form.",
            options: [
                { text: "$3.44 \\times 10^{-6}$", correct: false },
                { text: "$3.44 \\times 10^{-5}$", correct: true },
                { text: "$3.44 \\times 10^{-4}$", correct: false },
                { text: "$34.4 \\times 10^{-3}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example2"
        },
        {
            question: "Question 3: <br><br> Which of the following numbers is the largest?",
            options: [
                { text: "$-70$", correct: false },
                { text: "$-50$", correct: true },
                { text: "$-3$", correct: false },
                { text: "$-2$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example3"
        },
        {
            question: "Question 4: <br><br> Correct 0.024561 to three significant figures.",
            options: [
                { text: "$0.03$", correct: true },
                { text: "$0.025$", correct: false },
                { text: "$0.0245$", correct: false },
                { text: "$0.0246$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example4"
        },
        {
            question: "Question 5: <br><br> Simplify: $ (7^5 \\times 7^3) \\div 7^6. $",
            options: [
                { text: "$7^9$", correct: true },
                { text: "$7^4$", correct: false },
                { text: "$7^3$", correct: false },
                { text: "$7^2$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example4"
        },
        {
            question: "Question 6: <br><br> How many lines of symmetry has a square?",
            options: [
                { text: "$0$", correct: true },
                { text: "$1$", correct: false },
                { text: "$2$", correct: false },
                { text: "$4$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example6"
        },
        {
            question: "Question 7: <br><br> Solve the equation $10 - \\dfrac{x + 3}{2} = 8$.",
            options: [
                { text: "$-9$", correct: true },
                { text: "$-3$", correct: false },
                { text: "$1$", correct: false },
                { text: "$15$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example7"
        },
        {
            question: "Question 8: <br><br> Factorize: $ kx + 2xt - 4k - 8t $.",
            options: [
                { text: "$(k - 2t)(x + 4)$", correct: true },
                { text: "$(k + 2t)(x + 4)$", correct: false },
                { text: "$(k + t)(x - 4)$", correct: false },
                { text: "$(k + 2t)(x - 4)$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example8"
        },
        {
            question: "Question 9: <br><br> There are 12 boys and 18 girls in a class. Find the fraction of boys in the class.",
            options: [
                { text: "$\\frac{2}{5}$", correct: true },
                { text: "$\\frac{3}{5}$", correct: false },
                { text: "$\\frac{2}{3}$", correct: false },
                { text: "$\\frac{3}{4}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example9"
        },
        {
            question: "Question 10: <br><br> Express 30$\\%$ as a  fraction in its lowest term.",
            options: [
                { text: "$\\frac{7}{10}$", correct: true },
                { text: "$\\frac{3}{20}$", correct: false },
                { text: "$\\frac{7}{20}$", correct: false },
                { text: "$\\frac{3}{10}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example10"
        },
        {
            question: "Question 11: <br><br> Make $k$ the subject of the relation, $ky - k = y^2$",
            options: [
                { text: "$k = \\dfrac{y^2}{y - 1}$", correct: true },
                { text: "$k = \\dfrac{y^2}{y + 1}$", correct: false },
                { text: "$k = -\\dfrac{y^2}{y + 1}$", correct: false },
                { text: "$k = \\dfrac{y^2 + 1}{y - 1}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example11"
        },
        {
            question: "Question 12: <br><br> The mean of the numbers 5, 2$x$, 4 and 3 is 5. Find the value of $x$.",
            options: [
                { text: "$3$", correct: true },
                { text: "$4$", correct: false },
                { text: "$5$", correct: false },
                { text: "$8$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example12"
        },
        {
            question: "Question 13: <br><br> Find the rule of the mapping: \\[\\begin{array}{cccccc}x & 1 & 2 & 3 & 4 & 5 \\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\ y & 3 & 1 & -1 & -3 & -5 \\ \\end{array} \\]",
            options: [
                { text: "$10x - 15$", correct: true },
                { text: "$10x - 3$", correct: false },
                { text: "$7x - 3$", correct: false },
                { text: "$10x + 15$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example13"
        },
        {
            question: "Question 14: <br><br> What is the value of $\\sqrt{81}$?",
            options: [
                { text: "$9$", correct: true },
                { text: "$8$", correct: false },
                { text: "$7$", correct: false },
                { text: "$6$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example14"
        },
        {
            question: "Question 15: <br><br> Find the value of $3^3$.",
            options: [
                { text: "$27$", correct: true },
                { text: "$9$", correct: false },
                { text: "$6$", correct: false },
                { text: "$18$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example15"
        },
        {
            question: "Question 16: <br><br> What is $15\\%$ of 200?",
            options: [
                { text: "$30$", correct: true },
                { text: "$20$", correct: false },
                { text: "$15$", correct: false },
                { text: "$25$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example16"
        },
        {
            question: "Question 17: <br><br> Simplify $12 - [3 + 2(4)]$.",
            options: [
                { text: "$3$", correct: true },
                { text: "$5$", correct: false },
                { text: "$1$", correct: false },
                { text: "$7$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example17"
        },
        {
            question: "Question 18: <br><br> What is the mean of 2, 4, 6, 8, 10?",
            options: [
                { text: "$6$", correct: true },
                { text: "$5$", correct: false },
                { text: "$7$", correct: false },
                { text: "$8$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example18"
        },
        {
            question: "Question 19: <br><br> Find the value of $x$ if $x/3 = 7$.",
            options: [
                { text: "$21$", correct: true },
                { text: "$10$", correct: false },
                { text: "$4$", correct: false },
                { text: "$24$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example19"
        },
        {
            question: "Question 20: <br><br> What is the value of $2^5$?",
            options: [
                { text: "$32$", correct: true },
                { text: "$16$", correct: false },
                { text: "$64$", correct: false },
                { text: "$25$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example20"
        },
        {
            question: "Question 21: <br><br> Find the HCF of 18 and 24.",
            options: [
                { text: "$6$", correct: true },
                { text: "$12$", correct: false },
                { text: "$3$", correct: false },
                { text: "$9$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example21"
        },
        {
            question: "Question 22: <br><br> What is the value of $0.25 \\times 0.4$?",
            options: [
                { text: "$0.1$", correct: true },
                { text: "$0.01$", correct: false },
                { text: "$1$", correct: false },
                { text: "$0.4$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example22"
        },
        {
            question: "Question 23: <br><br> Express $\\frac{7}{20}$ as a decimal.",
            options: [
                { text: "$0.35$", correct: true },
                { text: "$0.7$", correct: false },
                { text: "$0.14$", correct: false },
                { text: "$0.28$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example23"
        },
        {
            question: "Question 24: <br><br> What is the additive inverse of $-9$?",
            options: [
                { text: "$9$", correct: true },
                { text: "$-9$", correct: false },
                { text: "$0$", correct: false },
                { text: "$-1$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example24"
        },
        {
            question: "Question 25: <br><br> Find the value of $5^0$.",
            options: [
                { text: "$1$", correct: true },
                { text: "$0$", correct: false },
                { text: "$5$", correct: false },
                { text: "$10$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example25"
        },
        {
            question: "Question 26: <br><br> What is the perimeter of a square of side 6 cm?",
            options: [
                { text: "$24\\ \\text{cm}$", correct: true },
                { text: "$12\\ \\text{cm}$", correct: false },
                { text: "$36\\ \\text{cm}$", correct: false },
                { text: "$18\\ \\text{cm}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example26"
        },
        {
            question: "Question 27: <br><br> Simplify $8 - 2 \\times 3$.",
            options: [
                { text: "$2$", correct: true },
                { text: "$14$", correct: false },
                { text: "$18$", correct: false },
                { text: "$6$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example27"
        },
        {
            question: "Question 28: <br><br> What is the value of $\\frac{1}{2} + \\frac{1}{3}$?",
            options: [
                { text: "$\\frac{5}{6}$", correct: true },
                { text: "$\\frac{2}{5}$", correct: false },
                { text: "$\\frac{1}{5}$", correct: false },
                { text: "$\\frac{2}{3}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example28"
        },
        {
            question: "Question 29: <br><br> Find the value of $x$ if $x - 7 = 10$.",
            options: [
                { text: "$17$", correct: true },
                { text: "$3$", correct: false },
                { text: "$7$", correct: false },
                { text: "$-3$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example29"
        },
        {
            question: "Question 30: <br><br> What is the value of $0.6 \\div 0.2$?",
            options: [
                { text: "$3$", correct: true },
                { text: "$0.3$", correct: false },
                { text: "$1.2$", correct: false },
                { text: "$0.12$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example30"
        },
        {
            question: "Question 31: <br><br> What is the value of $2^4$?",
            options: [
                { text: "$16$", correct: true },
                { text: "$8$", correct: false },
                { text: "$12$", correct: false },
                { text: "$14$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example31"
        },
        {
            question: "Question 32: <br><br> Find the value of $\\sqrt{49}$.",
            options: [
                { text: "$7$", correct: true },
                { text: "$6$", correct: false },
                { text: "$8$", correct: false },
                { text: "$9$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example32"
        },
        {
            question: "Question 33: <br><br> What is $20\\%$ of 150?",
            options: [
                { text: "$30$", correct: true },
                { text: "$20$", correct: false },
                { text: "$15$", correct: false },
                { text: "$25$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example33"
        },
        {
            question: "Question 34: <br><br> Simplify $3x + 2x$.",
            options: [
                { text: "$5x$", correct: true },
                { text: "$6x$", correct: false },
                { text: "$3x^2$", correct: false },
                { text: "$2x$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example34"
        },
        {
            question: "Question 35: <br><br> What is the value of $0.7 \\times 0.5$?",
            options: [
                { text: "$0.35$", correct: true },
                { text: "$0.12$", correct: false },
                { text: "$0.25$", correct: false },
                { text: "$0.7$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example35"
        },
        {
            question: "Question 36: <br><br> Express $0.08$ as a fraction in its lowest terms.",
            options: [
                { text: "$\\frac{2}{25}$", correct: true },
                { text: "$\\frac{1}{8}$", correct: false },
                { text: "$\\frac{8}{100}$", correct: false },
                { text: "$\\frac{4}{25}$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example36"
        },
        {
            question: "Question 37: <br><br> What is the value of $6^2$?",
            options: [
                { text: "$36$", correct: true },
                { text: "$12$", correct: false },
                { text: "$18$", correct: false },
                { text: "$24$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example37"
        },
        {
            question: "Question 38: <br><br> Find the value of $x$ if $2x = 18$.",
            options: [
                { text: "$9$", correct: true },
                { text: "$8$", correct: false },
                { text: "$10$", correct: false },
                { text: "$6$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example38"
        },
        {
            question: "Question 39: <br><br> What is the value of $0.5 + 0.25$?",
            options: [
                { text: "$0.75$", correct: true },
                { text: "$0.5$", correct: false },
                { text: "$0.25$", correct: false },
                { text: "$1$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example39"
        },
        {
            question: "Question 40: <br><br> What is the value of $10^2$?",
            options: [
                { text: "$100$", correct: true },
                { text: "$20$", correct: false },
                { text: "$10$", correct: false },
                { text: "$200$", correct: false }
            ],
            solutionVideo: "https://www.youtube.com/embed/example40"
        }
    ];

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
                    <h2><i class="fas fa-graduation-cap"></i> BECE 2019 Mathematics Test</h2>
                    <div class="test-info">
                        <p><i class="fas fa-list-ol"></i> <strong>${totalQuestions} questions</strong> in Section A</p>
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
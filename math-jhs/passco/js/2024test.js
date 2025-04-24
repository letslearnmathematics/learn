// tests.js - Complete Test Management System
document.addEventListener('DOMContentLoaded', function() {
    // Global flag to track if any test is active
    let testInProgress = false;
    
    // Test data - 40 questions with options and correct answers
    const testQuestions = [
        {
            id: 1,
            question: "Find the image of the point (-3, 5) when it is rotated through 360&deg; about the origin.",
            options: ["(5, -3)", "(-3, -5)", "(-3, 5)", "(-5, 3)"],
            correctAnswer: 1 // index of correct option (0-based)
        },
        {
            id: 2,
            question: "There are 15 white and 25 black identical balls in a box. If a ball is selected",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 4,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 6,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 7,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 8,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 9,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 10,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 11,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 12,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 13,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 14,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 15,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 16,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 17,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 18,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 19,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 20,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 21,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 22,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 23,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 24,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 25,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 26,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 27,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 28,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 29,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 30,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 31,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 32,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 33,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 34,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 35,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 36,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 37,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 38,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 39,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        {
            id: 40,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        }
    ];

    // Initialize Free Range Test
    const freeRangeTest = new TestManager(
        'free-range',
        testQuestions,
        false // not timed
    );

    // Initialize Timed Test
    const timedTest = new TestManager(
        'timed',
        testQuestions,
        true, // timed
        60 * 60 // 60 minutes in seconds
    );

    // Start button for timed test
    document.getElementById('start-timed-test').addEventListener('click', function() {
        if (testInProgress) {
            alert('Please finish or submit your current test before starting another one.');
            return;
        }
        testInProgress = true;
        timedTest.startTest();
        this.disabled = true;
        document.getElementById('submit-timed-test').disabled = false;
        
        // Disable free-range test navigation
        document.getElementById('free-range-prev').disabled = true;
        document.getElementById('free-range-next').disabled = true;
        
        // Visual indication
        document.getElementById('section-a-free-range').classList.add('test-disabled');
    });

    // Submit button for timed test
    document.getElementById('submit-timed-test').addEventListener('click', function() {
        timedTest.submitTest();
        testInProgress = false;
        
        // Re-enable free-range test navigation
        document.getElementById('free-range-prev').disabled = false;
        document.getElementById('free-range-next').disabled = false;
        
        // Remove visual indication
        document.getElementById('section-a-free-range').classList.remove('test-disabled');
    });

    // Free-range navigation with test state check
    document.getElementById('free-range-prev').addEventListener('click', function() {
        if (testInProgress) {
            alert('Please finish or submit your timed test before continuing with free-range questions.');
            return;
        }
        freeRangeTest.navigate(-1);
    });

    document.getElementById('free-range-next').addEventListener('click', function() {
        if (testInProgress) {
            alert('Please finish or submit your timed test before continuing with free-range questions.');
            return;
        }
        freeRangeTest.navigate(1);
    });
});

class TestManager {
    constructor(prefix, questions, isTimed, timeLimit = 0) {
        this.prefix = prefix;
        this.questions = questions;
        this.isTimed = isTimed;
        this.timeLimit = timeLimit;
        this.currentQuestionIndex = 0;
        this.userAnswers = Array(questions.length).fill(null);
        this.testStarted = false;
        this.timerInterval = null;
        this.timeRemaining = timeLimit;

        this.initElements();
        this.renderQuestion();
        this.setupEventListeners();
        
        // Initialize timer display if timed test
        if (this.isTimed) {
            this.updateTimerDisplay();
        }
    }

    initElements() {
        this.container = document.getElementById(`${this.prefix}-test-container`);
        this.prevBtn = document.getElementById(`${this.prefix}-prev`);
        this.nextBtn = document.getElementById(`${this.prefix}-next`);
        this.pageInfo = document.getElementById(`${this.prefix}-page-info`);
        
        if (this.isTimed) {
            this.timerDisplay = document.getElementById('timer-display');
        }
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            if (!this.validateTestState()) return;
            this.navigate(-1);
        });
        
        this.nextBtn.addEventListener('click', () => {
            if (!this.validateTestState()) return;
            this.navigate(1);
        });
    }

    validateTestState() {
        if (this.isTimed && !this.testStarted) {
            alert('Please start the test first.');
            return false;
        }
        return true;
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Visual warnings when time is running low
        if (this.timeRemaining <= 300) { // 5 minutes
            this.timerDisplay.classList.add('timer-warning');
        }
        if (this.timeRemaining <= 60) { // 1 minute
            this.timerDisplay.classList.add('timer-critical');
        }
    }

    renderQuestion() {
        // Clear previous question
        this.container.innerHTML = '';

        const question = this.questions[this.currentQuestionIndex];
        
        // Create question card
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card active';
        questionCard.innerHTML = `
            <div class="question-text">${question.id}. ${question.question}</div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <label class="option ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}">
                        <input type="radio" name="question-${question.id}" value="${index}" 
                            ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
                        ${String.fromCharCode(65 + index)}. ${option}
                    </label>
                `).join('')}
            </div>
        `;

        this.container.appendChild(questionCard);

        // Update radio button event listeners
        const radioButtons = questionCard.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.userAnswers[this.currentQuestionIndex] = parseInt(e.target.value);
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.target.parentElement.classList.add('selected');
            });
        });

        // Update page info
        this.pageInfo.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;

        // Update button states
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
    }

    navigate(direction) {
        // Save current answer before navigating
        this.saveCurrentAnswer();

        // Update question index
        this.currentQuestionIndex += direction;
        
        // Ensure index stays within bounds
        this.currentQuestionIndex = Math.max(0, Math.min(this.currentQuestionIndex, this.questions.length - 1));

        this.renderQuestion();
    }

    saveCurrentAnswer() {
        const selectedOption = this.container.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            this.userAnswers[this.currentQuestionIndex] = parseInt(selectedOption.value);
        }
    }

    startTest() {
        if (this.isTimed && !this.testStarted) {
            this.testStarted = true;
            this.startTimer();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            // Time's up
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.submitTest();
                alert("Time's up! Your test has been submitted automatically.");
            }
        }, 1000);
    }

    submitTest() {
        if (this.isTimed) {
            clearInterval(this.timerInterval);
            this.timerDisplay.classList.remove('timer-warning', 'timer-critical');
        }
        
        // Calculate score
        let score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.questions[index].correctAnswer) {
                score++;
            }
        });
        
        // Show results
        const percentage = Math.round((score / this.questions.length) * 100);
        alert(`You scored ${score} out of ${this.questions.length} (${percentage}%)`);
        
        // Reset test if needed
        if (this.isTimed) {
            this.resetTest();
        }
    }

    resetTest() {
        this.currentQuestionIndex = 0;
        this.userAnswers = Array(this.questions.length).fill(null);
        this.testStarted = false;
        this.timeRemaining = this.timeLimit;
        this.updateTimerDisplay();
        this.renderQuestion();
        
        document.getElementById('start-timed-test').disabled = false;
        document.getElementById('submit-timed-test').disabled = true;
    }
}
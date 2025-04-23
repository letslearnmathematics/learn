// tests.js - Handles both free-range and timed tests

document.addEventListener('DOMContentLoaded', function() {
    // Test data - 40 questions with options and correct answers
    const testQuestions = [
        {
            id: 1,
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1 // index of correct option (0-based)
        },
        {
            id: 2,
            question: "What is the capital of Ghana?",
            options: ["Kumasi", "Accra", "Tamale", "Takoradi"],
            correctAnswer: 1
        },
        // Add 38 more questions in the same format
        // ...
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
        timedTest.startTest();
        this.disabled = true;
        document.getElementById('submit-timed-test').disabled = false;
    });

    // Submit button for timed test
    document.getElementById('submit-timed-test').addEventListener('click', function() {
        timedTest.submitTest();
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
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
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
        if (this.currentQuestionIndex < 0) {
            this.currentQuestionIndex = 0;
        } else if (this.currentQuestionIndex >= this.questions.length) {
            this.currentQuestionIndex = this.questions.length - 1;
        }

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
            
            // Update display
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
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
        }
        
        // Calculate score
        let score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.questions[index].correctAnswer) {
                score++;
            }
        });
        
        // Show results
        alert(`You scored ${score} out of ${this.questions.length} (${Math.round((score / this.questions.length) * 100)}%)`);
        
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
        this.timerDisplay.textContent = `${Math.floor(this.timeLimit / 60)}:${(this.timeLimit % 60).toString().padStart(2, '0')}`;
        this.renderQuestion();
        
        document.getElementById('start-timed-test').disabled = false;
        document.getElementById('submit-timed-test').disabled = true;
    }
}
// Linear Programming Game Initialization
const lpQuestions = [
    {
        type: "graph",
        question: "Which graph represents y ≥ 2x - 1?",
        options: ["Graph A", "Graph B", "Graph C", "Graph D"],
        answer: 1
    },
    {
        type: "calculation",
        question: "What is the maximum value of P = 3x + 2y given x + y ≤ 5, x ≥ 0, y ≥ 0?",
        options: ["0", "10", "15", "6"],
        answer: 2
    }
    // More questions would be added here
];

// Initialize game with LP questions
if (window.initMathGame) {
    initMathGame(lpQuestions, "Linear Programming Challenge");
}
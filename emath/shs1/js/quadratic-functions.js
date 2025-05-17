// Interactive Graph Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update graph points when examples are shown
    const solutionToggles = document.querySelectorAll('.solution-toggle');
    solutionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const solution = this.nextElementSibling;
            solution.style.display = solution.style.display === 'block' ? 'none' : 'block';
        });
    });
    
    // Simple parabola plotting function (for demonstration)
    function plotParabola(a, b, c, graphElement) {
        // This would be replaced with actual canvas/SVG drawing in production
        console.log(`Plotting parabola: ${a}x² + ${b}x + ${c}`);
    }
    
    // Initialize any interactive graphs
    const graphs = document.querySelectorAll('.graph');
    graphs.forEach(graph => {
        // Add event listeners for interactive elements if needed
    });
});
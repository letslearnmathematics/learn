// Hamburger menu functionality
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

// Dropdown selection redirect
const selectElement = document.getElementById('basics');
if (selectElement) {
    selectElement.addEventListener('change', function () {
        const selectedValue = this.value;
        if (selectedValue) {
            window.location.href = selectedValue;
        }
    });
}

// Blog article accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.querySelector('.page-narative');
    if (blogContainer) {
        const toggleButtons = blogContainer.querySelectorAll('.toggle-btn');
        toggleButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const content = button.previousElementSibling; // Selects the '.blog-content' div
                const isExpanded = content.style.display === 'block';

                // Toggle display
                if (isExpanded) {
                    content.style.display = 'none';
                    button.textContent = 'Read More';
                } else {
                    content.style.display = 'block';
                    button.textContent = 'Show Less';
                }
            });
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    // Select all blog articles
    document.querySelectorAll('.blog-article').forEach((article) => {
        const title = article.querySelector('.maintopic').textContent.trim();
        const summary = article.querySelector('.blog-summary').textContent.trim();
        const url = window.location.href; // Use current page URL (or fetch specific URL for each blog)

        // Create share links dynamically
        const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        const linkedinLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
        const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + summary + ' ' + url)}`;

        // Update the anchor tags with the dynamic links
        article.querySelector('.twitter').setAttribute('href', twitterLink);
        article.querySelector('.facebook').setAttribute('href', facebookLink);
        article.querySelector('.linkedin').setAttribute('href', linkedinLink);
        article.querySelector('.whatsapp').setAttribute('href', whatsappLink);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.querySelector('.page-narative');
    const toggleButtons = blogContainer.querySelectorAll('.toggle-btn');

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const content = button.previousElementSibling; // Selects the '.blog-content' div
            const isExpanded = content.style.display === 'block';

            // Toggle display
            if (isExpanded) {
                content.style.display = 'none';
                button.textContent = 'Read More';
            } else {
                content.style.display = 'block';
                button.textContent = 'Show Less';
            }

            // Now update the Open Graph meta tags dynamically for the current blog post
            const blogPost = button.closest('.blog-article'); // The entire blog post container
            const title = blogPost.querySelector('.maintopic').textContent; // Blog title
            const description = blogPost.querySelector('.blog-summary').textContent; // Blog summary
            const imageUrl = blogPost.querySelector('.blog-content img') ? blogPost.querySelector('.blog-content img').src : 'https://letslearnmathematics.github.io/learn/images/default-image.png'; // Default image if none

            // Update Open Graph meta tags
            document.getElementById('og-title').setAttribute('content', title);
            document.getElementById('og-description').setAttribute('content', description);
            document.getElementById('og-image').setAttribute('content', imageUrl);
            document.getElementById('og-url').setAttribute('content', window.location.href); // Current page URL

            // You can also update the browser history if needed (for SPA-like behavior)
            window.history.pushState({}, "", window.location.pathname + '#/' + title.toLowerCase().replace(/\s+/g, '-'));
        });
    });
});


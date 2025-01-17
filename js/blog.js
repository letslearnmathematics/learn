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

document.addEventListener('DOMContentLoaded', () => {
    // Ensure each blog article has functional toggle buttons
    document.querySelectorAll('.blog-article').forEach((article) => {
        const toggleButton = article.querySelector('.toggle-btn');
        const blogContent = article.querySelector('.blog-content');

        // Add a single click listener to each button
        toggleButton.addEventListener('click', () => {
            const isExpanded = blogContent.style.display === 'block';

            // Toggle content visibility
            if (isExpanded) {
                blogContent.style.display = 'none';
                toggleButton.textContent = 'Read More';
            } else {
                blogContent.style.display = 'block';
                toggleButton.textContent = 'Show Less';
            }

            // Update Open Graph meta tags dynamically
            const title = article.querySelector('.maintopic').textContent;
            const description = article.querySelector('.blog-summary').textContent;
            const imageUrl = article.querySelector('.blog-content img')
                ? article.querySelector('.blog-content img').src
                : 'https://letslearnmathematics.github.io/learn/images/default-image.png';

            document.getElementById('og-title').setAttribute('content', title);
            document.getElementById('og-description').setAttribute('content', description);
            document.getElementById('og-image').setAttribute('content', imageUrl);
            document.getElementById('og-url').setAttribute('content', window.location.href);

            // Optional: Update URL for better sharing
            const newPath = window.location.pathname + '#' + title.toLowerCase().replace(/\s+/g, '-');
            window.history.pushState({}, title, newPath);
        });
    });

    // Social media links
    document.querySelectorAll('.blog-article').forEach((article) => {
        const title = article.querySelector('.maintopic').textContent.trim();
        const summary = article.querySelector('.blog-summary').textContent.trim();
        const url = window.location.href; // Use current page URL or generate unique URL for each blog

        // Create dynamic share links
        article.querySelector('.twitter').setAttribute(
            'href',
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        );
        article.querySelector('.facebook').setAttribute(
            'href',
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        );
        article.querySelector('.linkedin').setAttribute(
            'href',
            `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(
                title
            )}&summary=${encodeURIComponent(summary)}`
        );
        article.querySelector('.whatsapp').setAttribute(
            'href',
            `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + summary + ' ' + url)}`
        );
    });
});


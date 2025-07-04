document.addEventListener('DOMContentLoaded', function() {
  // ======================
    // Blog Post Category Highlighting
    // ======================
    function highlightCurrentCategory() {
        // Get current category from URL or post meta
        const urlParams = new URLSearchParams(window.location.search);
        let currentCategory = urlParams.get('category');
        
        // If no category in URL, get from post category element
        if (!currentCategory) {
            const postCategoryElement = document.querySelector('.post-category');
            if (postCategoryElement) {
                currentCategory = postCategoryElement.textContent
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z-]/g, '');
            }
        }
        
        if (currentCategory) {
            // Remove active class from all buttons
            document.querySelectorAll('.category-filter').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Find and activate matching category button
            const activeButton = document.querySelector(`.category-filter[data-category="${currentCategory}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
            
            // If no exact match, activate "All Posts"
            if (!activeButton && currentCategory !== 'all') {
                const allButton = document.querySelector('.category-filter[data-category="all"]');
                if (allButton) allButton.classList.add('active');
            }
        }
    }
    
    // Initialize category highlighting
    highlightCurrentCategory();

    // ======================
    // Newsletter Handling
    // ======================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Simple validation
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                // In a real implementation, you would send to your backend/Mailchimp
                console.log('Subscribing email:', email);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showToast('Thank you for subscribing!', 'success');
                this.reset();
            } catch (error) {
                showToast('Subscription failed. Please try again.', 'error');
                console.error('Subscription error:', error);
            }
        });
    });

    // ======================
    // Lazy Loading Images
    // ======================
    if ('IntersectionObserver' in window) {
        const lazyLoadImages = (images) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px 0px' // Load images 200px before they're visible
            });

            images.forEach(img => {
                if (img.dataset.src) {
                    observer.observe(img);
                }
            });
        };

        lazyLoadImages(document.querySelectorAll('img[loading="lazy"]'));
    }

    // ======================
    // Table of Contents Generator
    // ======================
    const generateTOC = () => {
        const postContent = document.querySelector('.post-content');
        if (!postContent) return;
        
        const headings = postContent.querySelectorAll('h2, h3');
        if (headings.length < 3) return;
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = `
            <div class="toc-header">
                <h4>Table of Contents</h4>
                <button class="toc-toggle" aria-expanded="true">Toggle</button>
            </div>
            <ul></ul>
        `;
        
        const tocList = toc.querySelector('ul');
        let currentH2 = null;
        
        headings.forEach(heading => {
            if (!heading.id) {
                heading.id = heading.textContent
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
            }
            
            if (heading.tagName === 'H2') {
                currentH2 = document.createElement('li');
                currentH2.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
                tocList.appendChild(currentH2);
            } else if (heading.tagName === 'H3' && currentH2) {
                if (!currentH2.querySelector('ul')) {
                    currentH2.innerHTML += '<ul></ul>';
                }
                const subItem = document.createElement('li');
                subItem.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
                currentH2.querySelector('ul').appendChild(subItem);
            }
        });
        
        // Add toggle functionality
        const tocToggle = toc.querySelector('.toc-toggle');
        tocToggle.addEventListener('click', () => {
            const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
            tocToggle.setAttribute('aria-expanded', !isExpanded);
            tocList.style.display = isExpanded ? 'none' : 'block';
        });
        
        postContent.insertBefore(toc, postContent.firstChild);
    };
    
    generateTOC();

    // ======================
    // Helper Functions
    // ======================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Mobile Navigation
    // ======================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    /*if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
            
            // Toggle aria-expanded for accessibility
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-hidden', isExpanded);
        });

        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }*/

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
    // Category Filtering
    // ======================
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const category = this.value;
            const posts = document.querySelectorAll('.post-card');
            let visibleCount = 0;
            
            posts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = 'block';
                    visibleCount++;
                } else {
                    post.style.display = 'none';
                }
            });
            
            // Show message if no posts match filter
            const noResults = document.getElementById('noResults');
            if (visibleCount === 0) {
                if (!noResults) {
                    const grid = document.querySelector('.posts-grid');
                    const message = document.createElement('p');
                    message.id = 'noResults';
                    message.textContent = 'No posts found in this category.';
                    message.style.gridColumn = '1 / -1';
                    message.style.textAlign = 'center';
                    grid.appendChild(message);
                }
            } else if (noResults) {
                noResults.remove();
            }
        });
    }

    // ======================
    // Comment System
    // ======================
    const commentForms = document.querySelectorAll('#commentForm');
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#commentName').value.trim();
            const email = this.querySelector('#commentEmail').value.trim();
            const text = this.querySelector('#commentText').value.trim();
            
            if (!name || !text) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // In production: Send to your backend
            console.log('New comment:', { name, email, text });
            
            // Simulate comment display
            const commentList = document.querySelector('.comment-list');
            if (commentList) {
                const comment = document.createElement('div');
                comment.className = 'comment';
                comment.innerHTML = `
                    <div class="comment-author">
                        <img src="../images/avatars/default.jpg" alt="${name}">
                        <div>
                            <h5>${name}</h5>
                            <span class="comment-date">Just now</span>
                        </div>
                    </div>
                    <div class="comment-content">
                        <p>${text}</p>
                    </div>
                `;
                commentList.prepend(comment);
            }
            
            showToast('Comment submitted for moderation', 'success');
            this.reset();
        });
    });

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
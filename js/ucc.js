// social-jhs.js - Complete Integrated Solution
document.addEventListener("DOMContentLoaded", function() {
    // ========== RECENTLY VIEWED SYSTEM ==========
    const RECENT_ITEMS_KEY = 'recentlyViewedSubtopic';
    const MAX_RECENT_ITEMS = 5;
    
    function saveRecentlyViewed(subtopic) {
        let recentItems = JSON.parse(localStorage.getItem(RECENT_ITEMS_KEY)) || [];
        
        // Remove if already exists
        recentItems = recentItems.filter(item => 
            item.url !== subtopic.url || item.topic !== subtopic.topic
        );
        
        // Add to beginning
        recentItems.unshift({
            name: subtopic.name,
            url: subtopic.url,
            topic: subtopic.topic,
            level: subtopic.level,
            timestamp: new Date().getTime()
        });
        
        // Limit to max items
        if (recentItems.length > MAX_RECENT_ITEMS) {
            recentItems = recentItems.slice(0, MAX_RECENT_ITEMS);
        }
        
        localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(recentItems));
    }
    
    function getRecentlyViewed() {
        return JSON.parse(localStorage.getItem(RECENT_ITEMS_KEY)) || [];
    }

    // ========== TAB SYSTEM FUNCTIONALITY ==========
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Show first tab by default
    if (tabContents.length > 0) {
        tabContents[0].style.display = 'block';
        tabButtons[0].classList.add('active');
    }

    function openClass(evt, classId) {
        // Hide all tab content
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Remove active class from all buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Show the current tab and mark button as active
        document.getElementById(classId).style.display = 'block';
        evt.currentTarget.classList.add('active');

        // Save the active tab to localStorage
        localStorage.setItem('lastActiveTab', classId);
    }

    // Add click event to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const classId = this.getAttribute('data-tab');
            openClass(e, classId);
        });
    });

    // Check for saved tab preference
    const lastActiveTab = localStorage.getItem('lastActiveTab');
    if (lastActiveTab) {
        const tabToActivate = document.getElementById(lastActiveTab);
        const buttonToActivate = Array.from(tabButtons).find(button => 
            button.getAttribute('data-tab') === lastActiveTab
        );
        
        if (tabToActivate && buttonToActivate) {
            tabContents.forEach(content => content.style.display = 'none');
            tabButtons.forEach(button => button.classList.remove('active'));
            
            tabToActivate.style.display = 'block';
            buttonToActivate.classList.add('active');
        }
    }

    const subtopicsData = {
        "courses": {
            "B.Ed(Math) - Switch": [
                { name: "Psychological Basis", url: "./b-ed-math-switch/psychological-basis" },
                { name: "Algebraic Thinking", url: "./b-ed-math-switch/algebraic-thinking" },
                { name: "Nature of Mathematics", url: "./b-ed-math-switch/nature-of-math" }
            ]/*,
            
            "Socio-Economic Development": [
                { name: "Family Life", url: "" },
                { name: "Adolescency", url: "" },
                { name: "Socialization", url: "" },
                { name: "Self-Identity", url: "" },
                { name: "Citizenship & Human Rights", url: "" },
                { name: "Finance & Investment", url: "" },
                { name: "Tourism", url: "" },
                { name: "Science & Technology", url: "" },
                { name: "Pensions Act 766 & PNDC Law 247", url: "" },
                { name: "Culture", url: "" },
                { name: "Assesment Task", url: "" }
            ],
            "Government, Politics & Stability": [
                { name: "Government & Society", url: "" },
                { name: "Ghana's Co-operation with other Nations", url: "" },
                { name: "Law & Order", url: "" },
                { name: "Independence", url: "" },
                { name: "Nationhood", url: "" },
                { name: "The Republics", url: "" },
                { name: "Conflicts", url: "" }
            ]*/ 
        }
    };

    // Get modal elements
    const subtopicModal = document.getElementById('subtopicModal');
    const modalTopicTitle = document.getElementById('modalTopicTitle');
    const subtopicList = document.getElementById('subtopicList');
    const recentSubtopicList = document.getElementById('recentSubtopicList');
    const modalLevelIndicator = document.getElementById('modalLevelIndicator');
    const recentListContainer = document.querySelector('.recently-viewed-container');

    function openSubtopicModal(topicName) {
        const activeTab = document.querySelector('.tab-button.active');
        const currentLevel = activeTab ? activeTab.getAttribute('data-tab') : 'courses';
        
        const levelSubtopics = subtopicsData[currentLevel] || {};
        const subtopics = levelSubtopics[topicName] || [];
        
        if (subtopics.length === 0) {
            window.location.href = `./${currentLevel}/${encodeURIComponent(topicName.toLowerCase().replace(/ /g, '-'))}`;
            return;
        }
        
        // Set modal title with level context
        modalTopicTitle.innerHTML = `${currentLevel.toUpperCase()}: ${topicName} <br><span class="subtopic-subheader">Select Subtopic</span>`;
        modalLevelIndicator.textContent = currentLevel.toUpperCase();
        
        // Clear previous subtopics
        subtopicList.innerHTML = '';
        
        // Add subtopics to modal
        subtopics.forEach(subtopic => {
            const li = document.createElement('li');
            li.className = 'subtopic-item';
            li.innerHTML = `
                <a href="${subtopic.url}" class="subtopic-link" 
                   data-topic="${topicName}" 
                   data-level="${currentLevel}">
                    <i class="fas fa-book-open"></i> ${subtopic.name}
                </a>
            `;
            subtopicList.appendChild(li);
        });
        
        // Load and display recently viewed items
        displayRecentlyViewed();
        
        // Show modal
        subtopicModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function displayRecentlyViewed() {
        const recentItems = getRecentlyViewed();
        
        if (recentItems.length === 0) {
            recentListContainer.style.display = 'none';
            return;
        }
        
        recentListContainer.style.display = 'block';
        recentSubtopicList.innerHTML = '';
        
        recentItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'subtopic-item recent-item';
            li.style.animationDelay = `${index * 0.1}s`;
            li.innerHTML = `
                <a href="${item.url}" class="subtopic-link" 
                   data-topic="${item.topic}" 
                   data-level="${item.level}">
                    <i class="fas fa-history"></i> 
                    <span class="recent-item-name">${item.name}</span>
                    <span class="recent-item-meta">${item.level.toUpperCase()} • ${item.topic}</span>
                </a>
            `;
            recentSubtopicList.appendChild(li);
        });
    }

    // Track clicks on subtopic links
    document.addEventListener('click', function(e) {
        const subtopicLink = e.target.closest('.subtopic-link');
        if (subtopicLink) {
            const topic = subtopicLink.getAttribute('data-topic');
            const level = subtopicLink.getAttribute('data-level');
            const name = subtopicLink.querySelector('.recent-item-name')?.textContent || 
                         subtopicLink.textContent.trim();
            const url = subtopicLink.getAttribute('href');
            
            if (topic && level) {
                saveRecentlyViewed({ name, url, topic, level });
            }
        }
    });

    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        subtopicModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === subtopicModal) {
            subtopicModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Update all topic links to open modal instead
    document.querySelectorAll('.topic-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const topicName = this.closest('.topic-card').querySelector('.topic-header h3').textContent;
            openSubtopicModal(topicName);
        });
    });

    // ========== ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.topic-card, .resource-card, .exam-card').forEach(card => {
        observer.observe(card);
    });

    // Initialize recently viewed display
    displayRecentlyViewed();
});
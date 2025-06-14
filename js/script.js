document.addEventListener("DOMContentLoaded", () => {
    // Hamburger Menu Functionality
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

    // YouTube Video Slider with API Integration
    const videoSlider = document.querySelector('.video-slider');
    if (videoSlider) {
        // Configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
        const YOUTUBE_CHANNEL_ID = 'UCO5IGU0g6WQONZF5Wq2VpvQ'; // Your YouTube channel ID
        const YOUTUBE_API_KEY = 'AIzaSyChoa4VNDkG1yHt-0yOrRfiOB7_3rJvFeU'; // Your YouTube API key
        const MAX_VIDEOS = 6; // Number of videos to display

        // Fetch and display videos
        fetchLatestVideos();

        // Handle window resize
        window.addEventListener('resize', debounce(updateSliderDots, 200));

        // Slider navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => navigateSlider(-1));
            nextBtn.addEventListener('click', () => navigateSlider(1));
        }

        async function fetchLatestVideos() {
            try {
                // Fetch videos directly using the search endpoint
                const videosResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=${MAX_VIDEOS}&order=date&type=video&key=${YOUTUBE_API_KEY}`
                );
                const videosData = await videosResponse.json();
                
                if (!videosData.items || videosData.items.length === 0) {
                    throw new Error('No videos found');
                }

                // Get video IDs for statistics
                const videoIds = videosData.items.map(item => item.id.videoId).join(',');
                const statsResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
                );
                const statsData = await statsResponse.json();
                
                // Combine the data and render videos
                renderVideos(videosData.items, statsData.items);
            } catch (error) {
                console.error('Error fetching YouTube videos:', error);
                // Fallback to manual videos if API fails
                renderManualFallback();
            }
        }

        function renderVideos(videos, stats) {
            videoSlider.innerHTML = '';
            const sliderDots = document.querySelector('.slider-dots');
            sliderDots.innerHTML = '';
            
            videos.forEach((video, index) => {
                const videoId = video.id.videoId;
                const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default;
                const videoStats = stats.find(stat => stat.id === videoId);
                const viewCount = videoStats ? formatNumber(videoStats.statistics.viewCount) : 'N/A';
                const publishedAt = formatDate(video.snippet.publishedAt);
                
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <a href="https://youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="${thumbnail.url}" alt="${video.snippet.title}" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">${video.snippet.title}</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> ${viewCount} views</span>
                                <span>${publishedAt}</span>
                            </div>
                        </div>
                    </a>
                `;
                videoSlider.appendChild(videoCard);
            });
            
            // Initialize slider functionality
            initSlider();
        }

        function renderManualFallback() {
            // Fallback content (your original hardcoded videos)
            videoSlider.innerHTML = `
                <!-- Video Card 1 -->
                <div class="video-card">
                    <a href="https://youtu.be/6YzeRmEr3IU?si=v2e8Rnt8Y46nctrh" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="./images/s1ss1-lesson1a-modelling-multibase.png" alt="Modelling: Multi-base Blocks" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">Modelling: Multi-base Blocks - Basic 7 Mathematics</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> 1.2K views</span>
                                <span>2 days ago</span>
                            </div>
                        </div>
                    </a>
                </div>
                
                <!-- Video Card 2 -->
                <div class="video-card">
                    <a href="https://youtu.be/eLHZSpJxwp8?si=IunsPtxHI2ByaEy5" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="./images/2024q1a.png" alt="BECE 2024: Question 1a" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">BECE 2024: Question 1a</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> 1K views</span>
                                <span>5 days ago</span>
                            </div>
                        </div>
                    </a>
                </div>
                
                <!-- Video Card 3 -->
                <div class="video-card">
                    <a href="https://youtu.be/etjDUDHlhEQ?si=DUyzkJalkYT9dhbi" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="./images/2000q1c.png" alt="BECE 2000: Question 1c" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">BECE 2000: Question 1c</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> 1.5K views</span>
                                <span>8 days ago</span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Video Card 4 -->
                <div class="video-card">
                    <a href="https://youtu.be/wj-jDHt8jpk?si=sNGTWxhi3ZCKSNBy" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="./images/2000q1b.png" alt="BECE 2000: Question 1b" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">BECE 2000: Question 1b</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> 1.2K views</span>
                                <span>11 days ago</span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Video Card 5 -->
                <div class="video-card">
                    <a href="https://youtu.be/DqtjytOS5N4?si=kHkn0wzAzvNPqFUn" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="./images/2024q1b.png" alt="BECE 2024: Question 1b" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">BECE 2024: Question 1b</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> 1.2K views</span>
                                <span>2 weeks ago</span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Video Card 6 -->
                <div class="video-card">
                    <a href="https://youtu.be/X6LFrHQ2EPk?si=DVZG0WaElYqeOJO0" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="./images/1991q1a.png" alt="BECE 1991: Question 1a" loading="lazy">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">BECE 1991: Question 1a</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> 1.2K views</span>
                                <span>2 days ago</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            
            initSlider();
        }

        function initSlider() {
            const cards = document.querySelectorAll('.video-card');
            const sliderDots = document.querySelector('.slider-dots');
            
            if (cards.length === 0) return;
            
            // Remove existing dots
            sliderDots.innerHTML = '';
            
            // Calculate number of dots needed based on visible cards
            const cardWidth = cards[0].offsetWidth + 20; // card width + gap
            const visibleCards = Math.floor(videoSlider.offsetWidth / cardWidth);
            const dotCount = Math.ceil(cards.length / visibleCards);
            
            // Create dots
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    scrollToCard(i * visibleCards);
                });
                sliderDots.appendChild(dot);
            }
            
            // Initialize scroll tracking
            videoSlider.addEventListener('scroll', debounce(handleScroll, 100));
        }

        function scrollToCard(index) {
            const cards = document.querySelectorAll('.video-card');
            if (index >= cards.length) return;
            
            const card = cards[index];
            const scrollPosition = card.offsetLeft - videoSlider.offsetLeft;
            
            videoSlider.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }

        function handleScroll() {
            const cards = document.querySelectorAll('.video-card');
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].offsetWidth + 20;
            const scrollPosition = videoSlider.scrollLeft;
            const activeIndex = Math.round(scrollPosition / cardWidth);
            
            // Update active dot
            const dots = document.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }

        function navigateSlider(direction) {
            const cards = document.querySelectorAll('.video-card');
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].offsetWidth + 20;
            const visibleCards = Math.floor(videoSlider.offsetWidth / cardWidth);
            const currentScroll = videoSlider.scrollLeft;
            const maxScroll = videoSlider.scrollWidth - videoSlider.clientWidth;
            
            let newScroll;
            
            if (direction === -1) { // Previous
                newScroll = Math.max(0, currentScroll - (visibleCards * cardWidth));
            } else { // Next
                newScroll = Math.min(maxScroll, currentScroll + (visibleCards * cardWidth));
            }
            
            videoSlider.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }

        function updateSliderDots() {
            initSlider(); // Reinitialize dots on resize
        }

        // Utility functions
        function formatNumber(num) {
            if (!num) return '0';
            num = parseInt(num);
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toLocaleString();
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            
            if (diffInDays === 0) return 'Today';
            if (diffInDays === 1) return 'Yesterday';
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) === 1 ? '' : 's'} ago`;
            return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) === 1 ? '' : 's'} ago`;
        }

        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(context, args);
                }, wait);
            };
        }
    }
});

// Modal functionality
document.addEventListener("DOMContentLoaded", function() {
    // Get modal elements
    const modal = document.getElementById('yearModal');
    const yearGrid = document.querySelector('.year-grid');
    const closeModal = document.querySelector('.close-modal');
    
    // Define your test links by year
    const testLinks = {
        "2025": { url: "./math-jhs/passco/bece-2025", type: "web" },
        "2024": { url: "./math-jhs/passco/bece-2024", type: "web" },
        "2023": { url: "./math-jhs/passco/bece-2023", type: "web" },
        "2022": { url: "./math-jhs/passco/bece-2022", type: "web" },
        "2021": { url: "./math-jhs/passco/bece-2021", type: "web" },
        "2020": { url: "./math-jhs/passco/bece-2020", type: "web" },
        "2019": { url: "./math-jhs/passco/bece-2019", type: "web" },
        "2018": { url: "./math-jhs/passco/bece-2018", type: "web" },
        "2017": { url: "./math-jhs/passco/bece-2017", type: "web" },
        "2016": { url: "./math-jhs/passco/bece-2016", type: "web" },
        "2015": { url: "./math-jhs/passco/bece-2015", type: "web" },
        "2014": { url: "./math-jhs/passco/bece-2014", type: "web" },
        "2013": { url: "./math-jhs/passco/bece-2013", type: "web" },
        "2012": { url: "./math-jhs/passco/bece-2012", type: "web" },
        "2011": { url: "./math-jhs/passco/bece-2011", type: "web" },
        "2010": { url: "./math-jhs/passco/bece-2010", type: "web" },
        "2009": { url: "./math-jhs/passco/bece-2009", type: "web" },
        "2008": { url: "./math-jhs/passco/bece-2008", type: "web" },
        "2007": { url: "./math-jhs/passco/bece-2007", type: "web" },
        "2006": { url: "./math-jhs/passco/bece-2006", type: "web" },
        "2005": { url: "./math-jhs/passco/bece-2005", type: "web" },
        "2004": { url: "./math-jhs/passco/bece-2004", type: "web" },
        "2003": { url: "./math-jhs/passco/bece-2003", type: "web" },
        "2002b": { url: "./math-jhs/passco/bece-2002b", type: "web" },
        "2002a": { url: "./math-jhs/passco/bece-2002a", type: "web" },
        "2001": { url: "./math-jhs/passco/bece-2001", type: "web" },
        "2000": { url: "./math-jhs/passco/bece-2000", type: "web" },
        "1999": { url: "./math-jhs/passco/bece-1999", type: "web" },
        "1998": { url: "./math-jhs/passco/bece-1998", type: "web" },
        "1997": { url: "./math-jhs/passco/bece-1997", type: "web" },
        "1996": { url: "./math-jhs/passco/bece-1996", type: "web" },
        "1995": { url: "./math-jhs/passco/bece-1995", type: "web" },
        "1994": { url: "./math-jhs/passco/bece-1994", type: "web" },
        "1993": { url: "./math-jhs/passco/bece-1993", type: "web" },
        "1992": { url: "./math-jhs/passco/bece-1992", type: "web" },
        "1991": { url: "./math-jhs/passco/bece-1991", type: "web" },
        "1990": { url: "./math-jhs/passco/bece-1990.html", type: "web" }
    };
    
    // Generate year buttons
    const currentYear = new Date().getFullYear();
    yearGrid.innerHTML = '';
    
    Object.keys(testLinks).sort((a, b) => b - a).forEach(year => {
        const yearBtn = document.createElement('a');
        yearBtn.className = 'year-btn';
        yearBtn.href = testLinks[year].url;
        
        if (parseInt(year) >= currentYear - 5) {
            yearBtn.classList.add('recent');
        }
        
        yearBtn.innerHTML = year;
        
        const formatBadge = document.createElement('span');
        formatBadge.className = `format-badge ${testLinks[year].type}-badge`;
        formatBadge.textContent = testLinks[year].type === 'pdf' ? 'PDF' : 'WEB';
        yearBtn.appendChild(formatBadge);
        
        if (testLinks[year].type === 'pdf') {
            yearBtn.target = '_blank';
            yearBtn.rel = 'noopener noreferrer';
        }
        
        yearGrid.appendChild(yearBtn);
    });
    
    // Set up modal toggle for all passco links
    document.querySelectorAll('[data-passco-modal]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when clicking X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
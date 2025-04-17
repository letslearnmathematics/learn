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
    const youtubeSlider = document.querySelector('.youtube-slider');
    if (youtubeSlider) {
        // Configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
        const YOUTUBE_CHANNEL_ID = 'UCO5IGU0g6WQONZF5Wq2VpvQ'; // Your YouTube channel ID
        const YOUTUBE_API_KEY = 'AIzaSyChoa4VNDkG1yHt-0yOrRfiOB7_3rJvFeU'; // Your YouTube API key
        const MAX_VIDEOS = 6; // Number of videos to display

        // Fetch and display videos
        fetchLatestVideos();

        // Handle window resize
        window.addEventListener('resize', debounce(updateSliderDots, 200));

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
            youtubeSlider.innerHTML = '';
            const sliderNav = document.querySelector('.slider-nav');
            sliderNav.innerHTML = '';
            
            videos.forEach((video, index) => {
                const videoId = video.id.videoId;
                const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default;
                const videoStats = stats.items.find(stat => stat.id === videoId);
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
                youtubeSlider.appendChild(videoCard);
            });
            
            // Initialize slider functionality
            initSlider();
        }

        function renderManualFallback() {
            // Fallback content (your original hardcoded videos)
            youtubeSlider.innerHTML = `
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
            const sliderNav = document.querySelector('.slider-nav');
            
            if (cards.length === 0) return;
            
            // Remove existing dots
            sliderNav.innerHTML = '';
            
            // Calculate number of dots needed based on visible cards
            const cardWidth = cards[0].offsetWidth + 20; // card width + gap
            const visibleCards = Math.floor(youtubeSlider.offsetWidth / cardWidth);
            const dotCount = Math.ceil(cards.length / visibleCards);
            
            // Create dots
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    scrollToCard(i * visibleCards);
                });
                sliderNav.appendChild(dot);
            }
            
            // Initialize scroll tracking
            youtubeSlider.addEventListener('scroll', debounce(handleScroll, 100));
        }

        function scrollToCard(index) {
            const cards = document.querySelectorAll('.video-card');
            if (index >= cards.length) return;
            
            const card = cards[index];
            const scrollPosition = card.offsetLeft - youtubeSlider.offsetLeft;
            
            youtubeSlider.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }

        function handleScroll() {
            const cards = document.querySelectorAll('.video-card');
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].offsetWidth + 20;
            const scrollPosition = youtubeSlider.scrollLeft;
            const activeIndex = Math.round(scrollPosition / cardWidth);
            
            // Update active dot
            const dots = document.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
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
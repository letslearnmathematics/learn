/* ================================================================
   ANOFF AKONNOR — PROFILE PAGE JAVASCRIPT
   Handles: Nav, Scroll Reveal, Stat Counters, Video Slider,
            Scroll-to-Top, Header Scroll State, Modal
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. HAMBURGER MENU
       ============================================================ */
    const hamburger = document.getElementById("hamburger");
    const navMenu   = document.getElementById("navMenu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isActive = hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", String(isActive));
        });

        // Close on nav-link click (smooth-scroll or page nav)
        navMenu.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* ============================================================
       2. HEADER — SCROLL STATE
       ============================================================ */
    const mainHeader = document.getElementById("mainHeader");

    if (mainHeader) {
        const onHeaderScroll = () => {
            mainHeader.classList.toggle("scrolled", window.scrollY > 40);
        };
        window.addEventListener("scroll", onHeaderScroll, { passive: true });
        onHeaderScroll(); // run once on load
    }


    /* ============================================================
       3. SCROLL REVEAL — IntersectionObserver
       ============================================================ */
    const revealElements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right"
    );

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        revealElements.forEach(el => revealObserver.observe(el));
    }


    /* ============================================================
       4. STAT COUNTER ANIMATION
       ============================================================ */
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");

    if (statNumbers.length) {
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        const animateCounter = (el) => {
            const target   = parseInt(el.dataset.target, 10);
            const duration = 1800; // ms
            const start    = performance.now();

            const step = (now) => {
                const elapsed  = now - start;
                const progress = Math.min(elapsed / duration, 1);
                el.textContent = Math.floor(easeOut(progress) * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };

            requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.6 }
        );

        statNumbers.forEach(el => counterObserver.observe(el));
    }


    /* ============================================================
       5. SCROLL-TO-TOP BUTTON
       ============================================================ */
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.addEventListener(
            "scroll",
            debounce(() => {
                scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
            }, 80),
            { passive: true }
        );

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* ============================================================
       6. VIDEO SLIDER
       ============================================================ */
    const videoSlider = document.getElementById("videoSlider");

    if (videoSlider) {

        /* -- Config -- */
        const YOUTUBE_CHANNEL_ID = "UCO5IGU0g6WQONZF5Wq2VpvQ";
        const YOUTUBE_API_KEY    = "AIzaSyChoa4VNDkG1yHt-0yOrRfiOB7_3rJvFeU";
        const MAX_VIDEOS         = 6;

        /* -- Wire up prev / next buttons -- */
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");

        if (prevBtn) prevBtn.addEventListener("click", () => navigateSlider(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => navigateSlider(1));

        /* -- Wire up resize -- */
        window.addEventListener("resize", debounce(initSlider, 220));

        /* -- Bootstrap -- */
        fetchLatestVideos();

        /* ---- Utility Functions ---- */
        function escapeHtml(text) {
            const div = document.createElement("div");
            div.textContent = text;
            return div.innerHTML;
        }


        /* ---- Fetch from YouTube API ---- */
        async function fetchLatestVideos() {
            try {
                const searchRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/search` +
                    `?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}` +
                    `&maxResults=${MAX_VIDEOS}&order=date&type=video&key=${YOUTUBE_API_KEY}`
                );

                if (!searchRes.ok) throw new Error(`Search HTTP ${searchRes.status}`);
                const searchData = await searchRes.json();

                if (!searchData.items || searchData.items.length === 0) {
                    throw new Error("No videos returned");
                }

                const videoIds   = searchData.items.map(v => v.id.videoId).join(",");
                const statsRes   = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos` +
                    `?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
                );

                if (!statsRes.ok) throw new Error(`Stats HTTP ${statsRes.status}`);
                const statsData = await statsRes.json();

                renderVideos(searchData.items, statsData.items || []);

            } catch (err) {
                console.warn("YouTube API unavailable — loading fallback.", err.message);
                renderManualFallback();
            }
        }


        /* ---- Render API-fetched cards ---- */
        function renderVideos(videos, stats) {
            videoSlider.innerHTML = "";
            videos.forEach(video => {
                const videoId = video.id.videoId;
                const thumb = video.snippet.thumbnails.medium || video.snippet.thumbnails.default;
                const statEntry = stats.find(s => s.id === videoId);
                const viewCount = statEntry ? formatNumber(statEntry.statistics.viewCount) : "N/A";
                const published = formatDate(video.snippet.publishedAt);
                const safeTitle = escapeHtml(video.snippet.title);

                const card = document.createElement("div");
                card.className = "video-card";
                card.setAttribute("role", "listitem");
                card.innerHTML = `
                    <a href="https://youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" aria-label="Watch: ${safeTitle}">
                        <div class="video-thumbnail">
                            <img src="${thumb.url}" alt="${safeTitle}" loading="lazy">
                            <div class="play-button" aria-hidden="true">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">${safeTitle}</h3>
                            <div class="video-meta">
                                <span>
                                    <i class="fas fa-eye" aria-hidden="true"></i> ${viewCount} views
                                </span>
                                <span>${published}</span>
                            </div>
                        </div>
                    </a>
                `;
                videoSlider.appendChild(card);
            });
            initSlider();
        }

        /* ---- Manual fallback cards ---- */
        function renderManualFallback() {
            const fallbackVideos = [
                { 
                    id: "6YzeRmEr3IU", 
                    url: "https://youtu.be/6YzeRmEr3IU?si=v2e8Rnt8Y46nctrh", 
                    img: "../images/s1ss1-lesson1a-modelling-multibase.png", 
                    title: "Multi-base Blocks - Basic 7 Mathematics", 
                    views: "1.2K", 
                    date: "2 days ago" 
                },
                { 
                    id: "eLHZSpJxwp8", 
                    url: "https://youtu.be/eLHZSpJxwp8?si=IunsPtxHI2ByaEy5", 
                    img: "../images/2024q1a.png", 
                    title: "BECE Mathematics Past Questions Breakdown",
                    views: "1K", 
                    date: "5 days ago" 
                },
                { 
                    id: "eLHZSpJxwp8", 
                    url: "https://youtu.be/etjDUDHlhEQ?si=DUyzkJalkYT9dhbi", 
                    img: "../images/2000q1c.png", 
                    title: "BECE Mathematics Past Questions Breakdown",
                    views: "1K", 
                    date: "5 days ago" 
                },
                { 
                    id: "eLHZSpJxwp8", 
                    url: "https://youtu.be/wj-jDHt8jpk?si=sNGTWxhi3ZCKSNBy", 
                    img: "../images/2000q1b.png", 
                    title: "BECE Mathematics Past Questions Breakdown",
                    views: "1K", 
                    date: "5 days ago" 
                },
                { 
                    id: "eLHZSpJxwp8", 
                    url: "https://youtu.be/DqtjytOS5N4?si=kHkn0wzAzvNPqFUn", 
                    img: "../images/2024q1b.png", 
                    title: "BECE Mathematics Past Questions Breakdown",
                    views: "1K", 
                    date: "5 days ago" 
                },
                { 
                    id: "eLHZSpJxwp8", 
                    url: "https://youtu.be/X6LFrHQ2EPk?si=DVZG0WaElYqeOJO0", 
                    img: "../images/1991q1a.png", 
                    title: "BECE Mathematics Past Questions Breakdown",
                    views: "1K", 
                    date: "5 days ago" 
                }
            ];

            videoSlider.innerHTML = "";
            fallbackVideos.forEach(video => {
                const card = document.createElement("div");
                card.className = "video-card";
                card.innerHTML = `
                    <a href="${video.url}" target="_blank" rel="noopener noreferrer">
                        <div class="video-thumbnail">
                            <img src="${video.img}" alt="${video.title}">
                            <div class="play-button"><i class="fas fa-play"></i></div>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title">${video.title}</h3>
                            <div class="video-meta">
                                <span><i class="fas fa-eye"></i> ${video.views} views</span>
                                <span>${video.date}</span>
                            </div>
                        </div>
                    </a>
                `;
                videoSlider.appendChild(card);
            });
            initSlider();
        }

        function initSlider() {

            const dotsContainer = document.querySelector(".slider-dots");

            if (!dotsContainer) return;

            dotsContainer.innerHTML = "";

            const cards = document.querySelectorAll(".video-card");

            if (cards.length === 0) return;

            const visibleCards = Math.max(
                1,
                Math.floor(videoSlider.clientWidth / cards[0].offsetWidth)
            );

            const pages = Math.ceil(cards.length / visibleCards);

            for (let i = 0; i < pages; i++) {

                const dot = document.createElement("span");
                dot.classList.add("slider-dot");

                if (i === 0) {
                    dot.classList.add("active");
                }

                dot.addEventListener("click", () => {

                    videoSlider.scrollTo({
                        left: i * videoSlider.clientWidth,
                        behavior: "smooth"
                    });

                    updateActiveDot(i);

                });

                dotsContainer.appendChild(dot);
            }

            videoSlider.addEventListener("scroll", () => {

                const activePage = Math.round(
                    videoSlider.scrollLeft / videoSlider.clientWidth
                );

                updateActiveDot(activePage);

            });

        }

        function updateActiveDot(index) {

            document.querySelectorAll(".slider-dot").forEach((dot, i) => {

                dot.classList.toggle("active", i === index);

            });

        }

        function navigateSlider(direction) {
            const scrollAmount = videoSlider.clientWidth * 0.8;
            videoSlider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        }
    }

    /* ============================================================
       7. UTILS / HELPERS
       ============================================================ */
    function debounce(fn, wait) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function formatNumber(num) {
        if (!num) return "0";
        const n = parseInt(num, 10);
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000)     return (n / 1000).toFixed(1) + "K";
        return n.toLocaleString();
    }

    function formatDate(dateString) {
        const date       = new Date(dateString);
        const now        = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0)  return "Today";
        if (diffInDays === 1)  return "Yesterday";
        if (diffInDays < 7)    return `${diffInDays} days ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
});
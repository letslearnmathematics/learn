/*************************************************
 * UNIVERSAL PAYWALL SYSTEM
 * Works on ALL lesson pages
 * Place in: /js/paywall-system.js
 *************************************************/

class PaywallSystem {
    constructor(config = {}) {
        // Firebase configuration
        this.firebaseConfig = {
            apiKey: "AIzaSyDXIHT3ICulcRMJpflowoPiQo-EJGcmces",
            authDomain: "mathjhs-paywall.firebaseapp.com",
            projectId: "mathjhs-paywall",
            storageBucket: "mathjhs-paywall.firebasestorage.app",
            messagingSenderId: "385737252880",
            appId: "1:385737252880:web:20ced5872fe3771a50ea95"
        };
        
        // Paystack public key (test mode)
        this.paystackKey = "pk_live_2940231cf4fa2089e18d89939c4b008472bbdf93";
        
        // Initialize Firebase
        this.initFirebase();
    }
    
    initFirebase() {
        // Check if Firebase is already initialized
        if (!firebase.apps.length) {
            this.app = firebase.initializeApp(this.firebaseConfig);
        } else {
            this.app = firebase.app();
        }
        
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        
        // Set up authentication
        this.setupAuth();
    }
    
    setupAuth() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Paywall: User authenticated:", user.uid);
                this.initPaywalls();
            } else {
                this.auth.signInAnonymously()
                    .then(() => console.log("Paywall: User signed in anonymously"))
                    .catch(error => console.error("Paywall: Auth error:", error));
            }
        });
    }
    
    initPaywalls() {
        // Find ALL paywall boxes on the page
        const paywallBoxes = document.querySelectorAll(".paywall-box");
        
        console.log(`Paywall: Found ${paywallBoxes.length} video lessons`);
        
        paywallBoxes.forEach((box, index) => {
            this.setupPaywallBox(box, index);
        });
    }
    
    setupPaywallBox(box, index) {
        const lessonId = box.dataset.lesson;
        const price = parseInt(box.dataset.price);
        const videoUrl = box.dataset.video;
        
        console.log(`Paywall: Setting up lesson ${index + 1}: ${lessonId}, Gh₵${price}`);
        
        // Get video container (must be next sibling)
        const videoContainer = box.nextElementSibling;
        if (!videoContainer || !videoContainer.classList.contains("video-container")) {
            console.error(`Paywall: Video container not found for ${lessonId}`);
            return;
        }
        
        const iframe = videoContainer.querySelector("iframe");
        const button = box.querySelector(".payBtn");
        
        if (!button) {
            console.error(`Paywall: Pay button not found for ${lessonId}`);
            return;
        }
        
        // Check access
        this.checkAccess(lessonId, box, videoContainer, iframe, videoUrl);
        
        // Setup click event
        button.addEventListener("click", () => {
            this.startPayment(lessonId, price, box, videoContainer, iframe, videoUrl);
        });
    }
    
    checkAccess(lessonId, paywallBox, videoBox, iframe, videoUrl) {
        const user = this.auth.currentUser;
        if (!user) return;
        
        this.db.collection("payments")
            .where("userId", "==", user.uid)
            .where("lessonId", "==", lessonId)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    this.unlockVideo(paywallBox, videoBox, iframe, videoUrl);
                }
            })
            .catch(error => console.error(`Paywall: Access check error for ${lessonId}:`, error));
    }
    
    unlockVideo(paywallBox, videoBox, iframe, videoUrl) {
        paywallBox.style.display = "none";
        videoBox.style.display = "block";
        iframe.src = videoUrl;
        console.log(`Paywall: Video unlocked: ${videoUrl}`);
    }
    
    startPayment(lessonId, price, paywallBox, videoBox, iframe, videoUrl) {
        const user = this.auth.currentUser;
        if (!user) {
            alert("Please refresh the page");
            return;
        }
        
        // Create unique reference
        const transactionRef = `lesson_${lessonId}_${Date.now()}_${user.uid.substring(0, 8)}`;
        const amountInPesewas = price * 100;
        const paymentEmail = `${user.uid.replace(/\W/g, '')}_${lessonId}@mathjhs.letslearn.com`;
        
        // Configure Paystack
        const handler = PaystackPop.setup({
            key: this.paystackKey,
            email: paymentEmail,
            amount: amountInPesewas,
            currency: "GHS",
            ref: transactionRef,
            metadata: { lessonId, userId: user.uid, price },
            callback: (response) => {
                this.savePayment(user.uid, lessonId, response.reference, price)
                    .then(() => {
                        this.unlockVideo(paywallBox, videoBox, iframe, videoUrl);
                        this.showSuccess(lessonId, price);
                    })
                    .catch(error => {
                        console.error("Paywall: Payment save error:", error);
                        alert("Payment successful but recording failed. Contact support with reference: " + response.reference);
                    });
            },
            onClose: () => alert("Payment was cancelled")
        });
        
        handler.openIframe();
    }
    
    savePayment(userId, lessonId, reference, price) {
        return this.db.collection("payments").add({
            userId,
            lessonId,
            reference,
            amount: price,
            currency: "GHS",
            paidAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: "completed"
        });
    }
    
    showSuccess(lessonId, price) {
        // Simple success alert
        alert(`Payment successful! You've purchased "${lessonId}" for Gh₵${price}.00. The video is now unlocked.`);
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.paywallSystem = new PaywallSystem();
});
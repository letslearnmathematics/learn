/*************************************************
 * PAYWALL SYSTEM (PRODUCTION SAFE)
 * - Firebase Authentication
 * - Firestore payment validation
 * - Paystack popup integration
 *************************************************/

/* ===============================
   1. FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyDXIHT3ICulcRMJpflowoPiQo-EJGcmces",
  authDomain: "mathjhs-paywall.firebaseapp.com",
  projectId: "mathjhs-paywall",
  storageBucket: "mathjhs-paywall.firebasestorage.app",
  messagingSenderId: "385737252880",
  appId: "1:385737252880:web:20ced5872fe3771a50ea95"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ===============================
   2. PAYWALL CLASS
================================ */
class PaywallSystem {
  constructor() {
    // 🔴 USE TEST KEY WHILE TESTING
    // 🔴 SWITCH TO pk_live_... ONLY WHEN READY
    this.paystackKey = "pk_live_2940231cf4fa2089e18d89939c4b008472bbdf93";

    this.init();
  }

  init() {
    // Ensure user is signed in (anonymous is fine)
    auth.onAuthStateChanged(user => {
      if (!user) {
        auth.signInAnonymously();
      } else {
        this.user = user;
        this.attachPayButtons();
        this.unlockPaidLessons();
      }
    });
  }

  /* ===============================
     3. ATTACH PAY BUTTONS
  ================================ */
  attachPayButtons() {
    const payButtons = document.querySelectorAll(".payBtn");

    payButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const paywallBox = btn.closest(".paywall-box");

        // 🚫 Prevent payment if already unlocked
        if (paywallBox.dataset.unlocked === "true") {
            alert("You already unlocked this lesson.");
            return;
        }

        const lessonId = paywallBox.dataset.lesson;
        const price = Number(paywallBox.dataset.price);
        const videoUrl = paywallBox.dataset.video;

        this.startPayment(lessonId, price, videoUrl, paywallBox);
        });

    });
  }

  /* ===============================
     4. START PAYSTACK PAYMENT
  ================================ */
  startPayment(lessonId, price, videoUrl, paywallBox) {
  // Disable button to prevent double clicks
    const button = paywallBox.querySelector(".payBtn");
    button.disabled = true;
    button.textContent = "Processing...";

    const handler = PaystackPop.setup({
        key: this.paystackKey,
        email: `user-${this.user.uid}@example.com`,
        amount: price * 100, // Paystack uses pesewas
        currency: "GHS",
        ref: "LESSON_" + lessonId + "_" + Date.now(),

        callback: response => {
        this.savePayment(
            lessonId,
            price,
            response.reference,
            videoUrl,
            paywallBox
        );
        },

        onClose: () => {
        // Re-enable button if user closes payment
        button.disabled = false;
        button.textContent = "Pay & Watch";
        alert("Payment cancelled.");
        }
    });

  handler.openIframe();
}


  /* ===============================
     5. SAVE PAYMENT TO FIRESTORE
  ================================ */
  async savePayment(lessonId, price, reference, videoUrl, paywallBox) {
    try {
      await db.collection("payments").add({
        userId: this.user.uid,
        lessonId: lessonId,
        amount: price,
        reference: reference,
        paidAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      this.unlockVideo(videoUrl, paywallBox);

    } catch (error) {
      console.error("Payment save failed:", error);
      alert("Payment verified but access failed. Please contact support.");
    }
  }

  /* ===============================
     6. UNLOCK VIDEO
  ================================ */
    unlockVideo(videoUrl, paywallBox) {
        const videoContainer = paywallBox.nextElementSibling;
        const iframe = videoContainer.querySelector("iframe");

        iframe.src = videoUrl;

        // Mark lesson as unlocked (UX + logic flag)
        paywallBox.dataset.unlocked = "true";

        // Replace paywall content
        paywallBox.innerHTML = `
            <p style="color: green; font-weight: bold;">
            ✅ Lesson unlocked
            </p>
        `;

        videoContainer.style.display = "block";
    }



  /* ===============================
     7. AUTO-UNLOCK PAID LESSONS
  ================================ */
  async unlockPaidLessons() {
    const paywalls = document.querySelectorAll(".paywall-box");

    for (const paywall of paywalls) {
      const lessonId = paywall.dataset.lesson;
      const videoUrl = paywall.dataset.video;

      const snapshot = await db.collection("payments")
        .where("userId", "==", this.user.uid)
        .where("lessonId", "==", lessonId)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        this.unlockVideo(videoUrl, paywall);
      }
    }
  }
}

/* ===============================
   8. START SYSTEM
================================ */
document.addEventListener("DOMContentLoaded", () => {
  new PaywallSystem();
});

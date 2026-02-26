/* ==========================================================
   VOXHIRE AI - Advanced Neural Core
   Jarvis-style system boot + voice intelligence engine
   Retains existing HTML & CSS
   ========================================================== */

class VoxHireAI {
  constructor() {
    this.recognition = null;
    this.voices = [];
    this.isListening = false;
    this.isBooted = false;
    this.init();
  }

  /* ================================
     INITIALIZATION SEQUENCE
  ================================== */

  async init() {
    await this.waitForVoices();
    this.initializeSpeechRecognition();
    this.bindUI();
    await this.bootSequence();
  }

  waitForVoices() {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;

      const loadVoices = () => {
        this.voices = synth.getVoices();
        if (this.voices.length !== 0) {
          resolve();
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    });
  }

  initializeSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.updateStatus("Speech Recognition not supported", "error");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = true;
    this.recognition.continuous = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateStatus("Listening...", "listening");
      document.querySelector(".mic")?.classList.add("listening");
    };

    this.recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      document.getElementById("answerBox").value = transcript;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      document.querySelector(".mic")?.classList.remove("listening");
      this.updateStatus("Speech captured", "success");
    };

    this.recognition.onerror = () => {
      this.updateStatus("Microphone error detected", "error");
    };
  }

  bindUI() {
    window.startListening = () => {
      if (!this.recognition) return;
      if (!this.isListening) this.recognition.start();
    };

    window.speakQuestion = () => {
      const text = document.getElementById("questionBox").innerText;
      this.speak(text, { rate: 0.95, pitch: 0.9 });
    };

    window.submitAnswer = () => {
      const answer = document.getElementById("answerBox").value.trim();
      if (!answer) {
        alert("Please answer first!");
        return;
      }

      this.analyzeAnswer(answer);
    };
  }

  /* ================================
     BOOT SEQUENCE (Jarvis Mode)
  ================================== */

  async bootSequence() {
    if (this.isBooted) return;
    this.updateStatus("Initializing neural core...");
    await this.delay(800);

    this.updateStatus("Calibrating voice systems...");
    await this.delay(900);

    this.updateStatus("Establishing interview protocol...");
    await this.delay(1000);

    this.updateStatus("System ready.", "success");
    await this.delay(400);

    this.greetUser();
    this.isBooted = true;
  }

  greetUser() {
    const hour = new Date().getHours();
    let greeting =
      hour < 12
        ? "Good morning."
        : hour < 18
        ? "Good afternoon."
        : "Good evening.";

    const message = `${greeting} VoxHire artificial intelligence system online. Your interview session has begun.`;

    this.speak(message, {
      rate: 0.9,
      pitch: 0.85
    });
  }

  /* ================================
     INTELLIGENT VOICE ENGINE
  ================================== */

  speak(text, options = {}) {
    const utterance = new SpeechSynthesisUtterance(text);

    const preferredVoice =
      this.voices.find(v =>
        v.name.toLowerCase().includes("david")
      ) ||
      this.voices.find(v =>
        v.lang.includes("en")
      );

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.updateStatus("AI speaking...");
    };

    utterance.onend = () => {
      this.updateStatus("Idle");
    };

    speechSynthesis.speak(utterance);
  }

  /* ================================
     BASIC ANSWER ANALYSIS ENGINE
  ================================== */

  analyzeAnswer(answer) {
    this.updateStatus("Analyzing response...");

    const wordCount = answer.split(/\s+/).length;
    const complexityScore =
      (answer.match(/class|method|object|inheritance|polymorphism|override|runtime|compile/gi) || []).length;

    let feedback;

    if (wordCount < 10) {
      feedback = "Your answer is too brief. Consider elaborating further.";
    } else if (complexityScore >= 2) {
      feedback =
        "Strong conceptual explanation detected. Good technical depth.";
    } else {
      feedback =
        "Basic explanation captured. You may include more technical terminology.";
    }

    setTimeout(() => {
      this.updateStatus("Analysis complete.", "success");
      this.speak(feedback, { rate: 0.95, pitch: 0.9 });
    }, 1500);
  }

  /* ================================
     STATUS CONTROL SYSTEM
  ================================== */

  updateStatus(message, type = "") {
    const statusElement = document.getElementById("status");

    statusElement.className = "status";
    if (type) statusElement.classList.add(type);

    statusElement.innerHTML = `<span class="dot"></span> ${message}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ==========================================================
   START VOXHIRE CORE
========================================================== */

window.addEventListener("load", () => {
  new VoxHireAI();
});
// ==============================
// 🎙️ Speech Recognition Setup
// ==============================

const statusEl = document.getElementById("status");
const answerBox = document.getElementById("answerBox");
const questionBox = document.getElementById("questionBox");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
} else {
  statusEl.innerText = "❌ Speech Recognition not supported";
}

// ==============================
// 🎤 Start Listening
// ==============================

function startListening() {
  if (!recognition) return;

  statusEl.innerText = "🎤 Listening...";
  recognition.start();
}

// When speech captured
recognition && (recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  answerBox.value = transcript;
  statusEl.innerText = "✅ Speech captured";
});

// Error handling
recognition && (recognition.onerror = () => {
  statusEl.innerText = "❌ Mic error";
});

// ==============================
// 🔊 Speak Question
// ==============================

function speakQuestion() {
  const text = questionBox.innerText;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}

// ==============================
// 🧠 Submit Answer (placeholder)
// ==============================

function submitAnswer() {
  const answer = answerBox.value.trim();

  if (!answer) {
    alert("Please answer first!");
    return;
  }

  statusEl.innerText =
    "🚀 Ready to send to AI (connect ElevenLabs + Featherless next)";
}
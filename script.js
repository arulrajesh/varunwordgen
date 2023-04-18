document.addEventListener('DOMContentLoaded', () => {
    const wordList = document.getElementById('wordList');
    const interval = document.getElementById('interval');
    const voiceSelect = document.getElementById('voiceSelect');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const countdownElement = document.getElementById('countdown');
    const lastWordElement = document.getElementById('lastWord');

    let speechSynthesisInstance;
    let voices = [];
    let countdownTimer;

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();

        if (voices.length === 0) {
            setTimeout(populateVoiceList, 50);
            return;
        }

        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
        });
    }

    populateVoiceList();

    function updateCountdown(secondsRemaining) {
        countdownElement.textContent = secondsRemaining > 0 ? `(${secondsRemaining}s)` : '';
    }

    function startCountdown(seconds) {
        let remainingTime = seconds;
        updateCountdown(remainingTime);

        countdownTimer = setInterval(() => {
            remainingTime--;
            updateCountdown(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(countdownTimer);
            }
        }, 1000);
    }

    function updateLastWord(word) {
        lastWordElement.textContent = word ? `| ${word} ` : '';
    }

    startButton.addEventListener('click', () => {
        const words = wordList.value.split('\n');
        const selectedInterval = parseInt(interval.value, 10) * 1000;
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);

        clearInterval(speechSynthesisInstance);
        clearInterval(countdownTimer);

        const speakWord = () => {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.voice = selectedVoice;
            speechSynthesis.speak(utterance);
            updateLastWord(word);
            startCountdown(selectedInterval / 1000);
        };

        speakWord();
        speechSynthesisInstance = setInterval(speakWord, selectedInterval);
        stopButton.disabled = false;
        startButton.classList.add('btn-start-running');
    });

    stopButton.addEventListener('click', () => {
        clearInterval(speechSynthesisInstance);
        clearInterval(countdownTimer);
        stopButton.disabled = true;
        updateCountdown(0);
        startButton.classList.remove('btn-start-running');
    });

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
});

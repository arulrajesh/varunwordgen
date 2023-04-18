document.addEventListener('DOMContentLoaded', () => {
    const wordList = document.getElementById('wordList');
    const interval = document.getElementById('interval');
    const voiceSelect = document.getElementById('voiceSelect');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');

    let speechSynthesisInstance;
    let voices = [];

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();

        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
        });
    }

    if (typeof speechSynthesis !== 'undefined') {
        if (speechSynthesis.onvoiceschanged !== undefined) {          speechSynthesis.onvoiceschanged = populateVoiceList;
            populateVoiceList();
        }
    }

    startButton.addEventListener('click', () => {
        const words = wordList.value.split('\n');
        const selectedInterval = parseInt(interval.value, 10) * 1000;
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);

        clearInterval(speechSynthesisInstance);

        const speakWord = () => {
            const randomIndex = Math.floor(Math.random() * words.length);
            const utterance = new SpeechSynthesisUtterance(words[randomIndex]);
            utterance.voice = selectedVoice;
            speechSynthesis.speak(utterance);
        };

        speakWord();
        speechSynthesisInstance = setInterval(speakWord, selectedInterval);
        stopButton.disabled = false;
    });

    stopButton.addEventListener('click', () => {
        clearInterval(speechSynthesisInstance);
        stopButton.disabled = true;
    });
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
});

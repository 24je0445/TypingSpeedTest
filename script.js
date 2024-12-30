const sentences = [
    "The cat runs under the tree.",
    "A quick brown fox jumps over the lazy dog.",
    "She sells seashells by the seashore.",
    "An apple a day keeps the doctor away.",
    "The rain in Spain falls mainly on the plain.",
    "I scream, you scream, we all scream for ice cream."
];

const sentenceElement = document.getElementById("sentence");
const textbox = document.getElementById("textbox");
const actionButton = document.getElementById("actionButton");
const resultElement = document.getElementById("result");
const timerElement = document.getElementById("timer");
const progressElement = document.getElementById("progress");

let currentSentenceIndex = 0;
let shuffledSentences = [];
let typedWordsCount = 0;
let correctWordsCount = 0;
let timeLeft = 60;
let timer;
let testStarted = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTest() {
    shuffledSentences = [...sentences];
    shuffleArray(shuffledSentences);
    shuffledSentences = shuffledSentences.slice(0, 5);

    currentSentenceIndex = 0;
    typedWordsCount = 0;
    correctWordsCount = 0;
    timeLeft = 60;
    testStarted = true;

    updateProgress();
    showNextSentence();

    textbox.value = "";
    textbox.disabled = false;
    textbox.focus();
    resultElement.textContent = "";

    actionButton.textContent = "Next";
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endTest();
        }
    }, 1000);
}

function updateProgress() {
    progressElement.textContent = `Sentence: ${currentSentenceIndex + 1}/${shuffledSentences.length}`;
}

function showNextSentence() {
    if (currentSentenceIndex < shuffledSentences.length) {
        sentenceElement.textContent = shuffledSentences[currentSentenceIndex];
        textbox.value = "";
    } else {
        endTest();
    }
}

function endTest() {
    textbox.disabled = true;
    clearInterval(timer);

    const totalTime = 60 - timeLeft;
    const wordsPerMinute = totalTime > 0 ? ((typedWordsCount / totalTime) * 60).toFixed(2) : 0;
    const charactersPerMinute = textbox.value.length;
    const accuracy = typedWordsCount > 0 ? ((correctWordsCount / typedWordsCount) * 100).toFixed(2) : 0;

    resultElement.textContent = `Great! You type with the speed of ${wordsPerMinute} WPM (${charactersPerMinute} CPM). Your accuracy was ${accuracy}%. Keep practicing!`;

    actionButton.textContent = "Start Again";
    testStarted = false;
}

textbox.addEventListener("input", () => {
    const typedText = textbox.value.trim();
    const typedWords = typedText.split(" ");
    const correctWords = shuffledSentences[currentSentenceIndex].split(" ");

    typedWordsCount = typedWords.length;
    correctWordsCount = 0;

    typedWords.forEach((word, index) => {
        if (word === correctWords[index]) {
            correctWordsCount++;
        }
    });

    if (typedText === shuffledSentences[currentSentenceIndex]) {
        currentSentenceIndex++;
        updateProgress();
        if (currentSentenceIndex < shuffledSentences.length) {
            showNextSentence();
        } else {
            endTest();
        }
    }
});

textbox.addEventListener("paste", (e) => {
    e.preventDefault();
    alert("Pasting is disabled for this test. Please type the sentence.");
});

actionButton.addEventListener("click", () => {
    if (!testStarted) {
        startTest();
    } else {
        currentSentenceIndex++;
        updateProgress();
        if (currentSentenceIndex < shuffledSentences.length) {
            showNextSentence();
        } else {
            endTest();
        }
    }
});

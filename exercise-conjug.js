// exercise-conjug.js

function initConjug() {
    // --- SÉLECTEURS DOM ---
    const verbEl = document.getElementById('conjug-verb');
    const tenseEl = document.getElementById('conjug-tense');
    const inputEl = document.getElementById('conjug-input');
    const feedbackEl = document.getElementById('conjug-feedback');
    const checkButton = document.getElementById('conjug-check-button');
    const nextButton = document.getElementById('conjug-next-button');
    const form = document.getElementById('conjug-form');
    const answerContainer = document.getElementById('conjug-answer-container');
    const answerEl = document.getElementById('conjug-answer');

    // --- LOGIQUE DU JEU ---
    let sessionList = [...STRONG_VERBS]; 
    let retryList = []; 
    let currentQuestionData = {}; 
    let wasRetryQuestion = false; 

    // --- FONCTIONS ---
    function normalize(str) {
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }
    function checkAnswer(userInput, correctAnswers) {
        const userNorm = normalize(userInput);
        const options = correctAnswers.split('/').map(opt => normalize(opt));
        return options.includes(userNorm);
    }

    // --- CHARGEMENT DE QUESTION ---
    function loadQuestion() {
        // 1. Réinitialiser l'interface
        inputEl.value = '';
        inputEl.disabled = false;
        inputEl.classList.remove('correct-border', 'incorrect-border');
        feedbackEl.textContent = '';
        checkButton.style.display = 'block';
        nextButton.style.display = 'none';
        answerContainer.style.display = 'none';

        // 2. Choisir une question
        wasRetryQuestion = false;
        if (retryList.length > 0 && Math.random() < 0.4) {
            currentQuestionData = retryList.shift();
            wasRetryQuestion = true;
        } else {
            if (sessionList.length === 0) {
                sessionList = [...STRONG_VERBS]; 
            }
            const randomIndex = Math.floor(Math.random() * sessionList.length);
            const verb = sessionList.splice(randomIndex, 1)[0]; 
            
            const tense = (Math.random() > 0.5) ? "Präsens" : "Präteritum";
            const answer = (tense === "Präsens") ? verb.praesens : verb.praeteritum;
            
            currentQuestionData = { verb, tense, answer };
        }
        
        // 3. Mettre à jour l'interface
        verbEl.textContent = currentQuestionData.verb.infinitive;
        tenseEl.textContent = currentQuestionData.tense;
    }

    // --- VÉRIFICATION ---
    function handleCheck(e) {
        e.preventDefault();
        inputEl.disabled = true;
        checkButton.style.display = 'none';
        nextButton.style.display = 'block';

        const userAnswer = inputEl.value;
        const correctAnswer = currentQuestionData.answer;
        const isCorrect = checkAnswer(userAnswer, correctAnswer);

        if (isCorrect) {
            feedbackEl.textContent = "Correct !";
            feedbackEl.className = 'feedback correct';
            inputEl.classList.add('correct-border');
        } else {
            feedbackEl.textContent = "Incorrect.";
            feedbackEl.className = 'feedback incorrect';
            inputEl.classList.add('incorrect-border');
            
            answerEl.textContent = correctAnswer;
            answerContainer.style.display = 'block';
            
            retryList.push(currentQuestionData);
        }
    }

    form.addEventListener('submit', handleCheck);
    nextButton.addEventListener('click', loadQuestion);

    // Charger la première question
    loadQuestion();
}

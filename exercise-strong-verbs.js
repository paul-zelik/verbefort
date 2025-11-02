// exercise-strong-verbs.js

function initStrongVerbs() {
    // --- SÉLECTEURS DOM ---
    const exerciseContainer = document.getElementById('strong-verb-exercise');
    if (!exerciseContainer) return; 
    const translationEl = exerciseContainer.querySelector('#verb-translation');
    const infinitiveInput = exerciseContainer.querySelector('#infinitive-input');
    const praesensInput = exerciseContainer.querySelector('#praesens-input');
    const praeteritumInput = exerciseContainer.querySelector('#praeteritum-input');
    const perfektInput = exerciseContainer.querySelector('#perfekt-input');
    const infinitiveFeedback = exerciseContainer.querySelector('#infinitive-feedback');
    const praesensFeedback = exerciseContainer.querySelector('#praesens-feedback');
    const praeteritumFeedback = exerciseContainer.querySelector('#praeteritum-feedback');
    const perfektFeedback = exerciseContainer.querySelector('#perfekt-feedback');
    const checkButton = exerciseContainer.querySelector('#check-button');
    const nextButton = exerciseContainer.querySelector('#next-button');
    const quizForm = exerciseContainer.querySelector('#quiz-form');
    const answerContainer = exerciseContainer.querySelector('#answer-container');
    const answerInfinitive = exerciseContainer.querySelector('#answer-infinitive');
    const answerPraesens = exerciseContainer.querySelector('#answer-praesens');
    const answerPraeteritum = exerciseContainer.querySelector('#answer-praeteritum');
    const answerPerfekt = exerciseContainer.querySelector('#answer-perfekt');

    // --- LOGIQUE DU JEU ---
    let sessionList = [...STRONG_VERBS]; 
    let retryList = []; 
    let currentVerb = null;
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

    // --- CHARGEMENT DE VERBE ---
    function loadNextVerb() {
        // 1. Réinitialiser l'interface 
        answerContainer.style.display = 'none';
        checkButton.style.display = 'block';
        nextButton.style.display = 'none';
        infinitiveInput.value = ''; praesensInput.value = '';
        praeteritumInput.value = ''; perfektInput.value = '';
        infinitiveInput.disabled = false; praesensInput.disabled = false;
        praeteritumInput.disabled = false; perfektInput.disabled = false;
        infinitiveFeedback.textContent = ''; praesensFeedback.textContent = '';
        praeteritumFeedback.textContent = ''; perfektFeedback.textContent = '';
        infinitiveInput.className = ''; praesensInput.className = '';
        praeteritumInput.className = ''; perfektInput.className = '';

        // 2. Choisir un verbe
        wasRetryQuestion = false;
        if (retryList.length > 0 && Math.random() < 0.4) {
            currentVerb = retryList.shift();
            wasRetryQuestion = true;
        } else {
            if (sessionList.length === 0) {
                sessionList = [...STRONG_VERBS]; // Recharger
            }
            const randomIndex = Math.floor(Math.random() * sessionList.length);
            currentVerb = sessionList.splice(randomIndex, 1)[0];
        }
        
        const retryIndex = retryList.indexOf(currentVerb);
        if (retryIndex > -1) {
            retryList.splice(retryIndex, 1);
        }

        // 3. Mettre à jour l'interface
        translationEl.textContent = currentVerb.translation;
    }

    // --- VÉRIFICATION ---
    function handleCheck(event) {
        event.preventDefault();
        if (!currentVerb) return;

        // 1. Vérifier les réponses
        const infinitiveUser = infinitiveInput.value;
        const praesensUser = praesensInput.value;
        const praeteritumUser = praeteritumInput.value;
        const perfektUser = perfektInput.value;

        const isInfinitiveCorrect = checkAnswer(infinitiveUser, currentVerb.infinitive);
        const isPraesensCorrect = checkAnswer(praesensUser, currentVerb.praesens);
        const isPraeteritumCorrect = checkAnswer(praeteritumUser, currentVerb.praeteritum);
        const isPerfektCorrect = checkAnswer(perfektUser, currentVerb.perfekt);
        
        const isFullyCorrect = isInfinitiveCorrect && isPraesensCorrect && isPraeteritumCorrect && isPerfektCorrect;

        // 2. Donner le feedback
        infinitiveFeedback.textContent = isInfinitiveCorrect ? 'Correct !' : 'Incorrect';
        infinitiveFeedback.className = isInfinitiveCorrect ? 'feedback correct' : 'feedback incorrect';
        infinitiveInput.classList.add(isInfinitiveCorrect ? 'correct-border' : 'incorrect-border');

        praesensFeedback.textContent = isPraesensCorrect ? 'Correct !' : 'Incorrect';
        praesensFeedback.className = isPraesensCorrect ? 'feedback correct' : 'feedback incorrect';
        praesensInput.classList.add(isPraesensCorrect ? 'correct-border' : 'incorrect-border');

        praeteritumFeedback.textContent = isPraeteritumCorrect ? 'Correct !' : 'Incorrect';
        praeteritumFeedback.className = isPraeteritumCorrect ? 'feedback correct' : 'feedback incorrect';
        praeteritumInput.classList.add(isPraeteritumCorrect ? 'correct-border' : 'incorrect-border');

        perfektFeedback.textContent = isPerfektCorrect ? 'Correct !' : 'Incorrect';
        perfektFeedback.className = isPerfektCorrect ? 'feedback correct' : 'feedback incorrect';
        perfektInput.classList.add(isPerfektCorrect ? 'correct-border' : 'incorrect-border');
        
        infinitiveInput.disabled = true; praesensInput.disabled = true;
        praeteritumInput.disabled = true; perfektInput.disabled = true;

        // 3. Gérer la liste de rattrapage
        if (isFullyCorrect) {
            // Correct.
        } else {
            // Incorrect.
            retryList.push(currentVerb); 
            
            // Afficher la réponse correcte si erreur
            answerInfinitive.textContent = currentVerb.infinitive;
            answerPraesens.textContent = currentVerb.praesens;
            answerPraeteritum.textContent = currentVerb.praeteritum; 
            answerPerfekt.textContent = currentVerb.perfekt;
            answerContainer.style.display = 'block';
        }

        checkButton.style.display = 'none';
        nextButton.style.display = 'block';
    }

    quizForm.addEventListener('submit', handleCheck);
    nextButton.addEventListener('click', loadNextVerb);

    loadNextVerb(); 
}

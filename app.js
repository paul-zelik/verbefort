// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const translationEl = document.getElementById('verb-translation');
    
    const infinitiveInput = document.getElementById('infinitive-input');
    const praesensInput = document.getElementById('praesens-input'); // AJOUTÉ
    const praeteritumInput = document.getElementById('praeteritum-input');
    const perfektInput = document.getElementById('perfekt-input');
    
    const infinitiveFeedback = document.getElementById('infinitive-feedback');
    const praesensFeedback = document.getElementById('praesens-feedback'); // AJOUTÉ
    const praeteritumFeedback = document.getElementById('praeteritum-feedback');
    const perfektFeedback = document.getElementById('perfekt-feedback');

    const checkButton = document.getElementById('check-button');
    const nextButton = document.getElementById('next-button');
    const quizForm = document.getElementById('quiz-form');
    
    const answerContainer = document.getElementById('answer-container');
    const answerInfinitive = document.getElementById('answer-infinitive');
    const answerPraesens = document.getElementById('answer-praesens');
    const answerPraeteritum = document.getElementById('answer-praeteritum');
    const answerPerfekt = document.getElementById('answer-perfekt');

    let currentVerb = null;
    let verbList = [...VERBS];

    function normalize(str) {
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function checkAnswer(userInput, correctAnswers) {
        const userNorm = normalize(userInput);
        const options = correctAnswers.split('/').map(opt => normalize(opt));
        return options.includes(userNorm);
    }

    // Fonction pour charger un nouveau verbe (modifiée)
    function loadNextVerb() {
        answerContainer.style.display = 'none';
        checkButton.style.display = 'block';
        nextButton.style.display = 'none';
        
        infinitiveInput.value = '';
        praesensInput.value = ''; // AJOUTÉ
        praeteritumInput.value = '';
        perfektInput.value = '';
        
        infinitiveInput.disabled = false;
        praesensInput.disabled = false; // AJOUTÉ
        praeteritumInput.disabled = false;
        perfektInput.disabled = false;

        infinitiveFeedback.textContent = '';
        praesensFeedback.textContent = ''; // AJOUTÉ
        praeteritumFeedback.textContent = '';
        perfektFeedback.textContent = '';
        
        infinitiveInput.classList.remove('correct-border', 'incorrect-border');
        praesensInput.classList.remove('correct-border', 'incorrect-border'); // AJOUTÉ
        praeteritumInput.classList.remove('correct-border', 'incorrect-border');
        perfektInput.classList.remove('correct-border', 'incorrect-border');

        const randomIndex = Math.floor(Math.random() * verbList.length);
        currentVerb = verbList[randomIndex];
        
        translationEl.textContent = currentVerb.translation;
    }

    // Fonction pour vérifier les réponses (modifiée)
    function handleCheck(event) {
        event.preventDefault();
        if (!currentVerb) return;

        // Récupérer les entrées
        const infinitiveUser = infinitiveInput.value;
        const praesensUser = praesensInput.value; // AJOUTÉ
        const praeteritumUser = praeteritumInput.value;
        const perfektUser = perfektInput.value;

        // Vérifier chaque champ
        const isInfinitiveCorrect = checkAnswer(infinitiveUser, currentVerb.infinitive);
        const isPraesensCorrect = checkAnswer(praesensUser, currentVerb.praesens); // AJOUTÉ
        const isPraeteritumCorrect = checkAnswer(praeteritumUser, currentVerb.praeteritum);
        const isPerfektCorrect = checkAnswer(perfektUser, currentVerb.perfekt);
        
        // Afficher feedback pour Infinitif
        infinitiveFeedback.textContent = isInfinitiveCorrect ? 'Correct !' : 'Incorrect';
        infinitiveFeedback.className = isInfinitiveCorrect ? 'feedback correct' : 'feedback incorrect';
        infinitiveInput.classList.add(isInfinitiveCorrect ? 'correct-border' : 'incorrect-border');

        // Afficher feedback pour Präsens (AJOUTÉ)
        praesensFeedback.textContent = isPraesensCorrect ? 'Correct !' : 'Incorrect';
        praesensFeedback.className = isPraesensCorrect ? 'feedback correct' : 'feedback incorrect';
        praesensInput.classList.add(isPraesensCorrect ? 'correct-border' : 'incorrect-border');

        // Afficher feedback pour Präteritum
        praeteritumFeedback.textContent = isPraeteritumCorrect ? 'Correct !' : 'Incorrect';
        praeteritumFeedback.className = isPraeteritumCorrect ? 'feedback correct' : 'feedback incorrect';
        praeteritumInput.classList.add(isPraeteritumCorrect ? 'correct-border' : 'incorrect-border');

        // Afficher feedback pour Perfekt
        perfektFeedback.textContent = isPerfektCorrect ? 'Correct !' : 'Incorrect';
        perfektFeedback.className = isPerfektCorrect ? 'feedback correct' : 'feedback incorrect';
        perfektInput.classList.add(isPerfektCorrect ? 'correct-border' : 'incorrect-border');
        
        // Désactiver les champs
        infinitiveInput.disabled = true;
        praesensInput.disabled = true; // AJOUTÉ
        praeteritumInput.disabled = true;
        perfektInput.disabled = true;

        // Afficher la réponse correcte
        answerInfinitive.textContent = currentVerb.infinitive;
        answerPraesens.textContent = currentVerb.praesens;
        answerPraeteritum.textContent = currentVerb.praeteritum;
        answerPerfekt.textContent = currentVerb.perfekt;
        answerContainer.style.display = 'block';

        checkButton.style.display = 'none';
        nextButton.style.display = 'block';
    }

    quizForm.addEventListener('submit', handleCheck);
    nextButton.addEventListener('click', loadNextVerb);

    loadNextVerb();
});
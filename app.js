// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const infinitiveEl = document.getElementById('verb-infinitive');
    const translationEl = document.getElementById('verb-translation');
    
    const praesensInput = document.getElementById('praesens-input');
    const praeteritumInput = document.getElementById('praeteritum-input');
    const perfektInput = document.getElementById('perfekt-input');
    
    const praesensFeedback = document.getElementById('praesens-feedback');
    const praeteritumFeedback = document.getElementById('praeteritum-feedback');
    const perfektFeedback = document.getElementById('perfekt-feedback');

    const checkButton = document.getElementById('check-button');
    const nextButton = document.getElementById('next-button');
    const quizForm = document.getElementById('quiz-form');
    
    const answerContainer = document.getElementById('answer-container');
    const answerPraesens = document.getElementById('answer-praesens');
    const answerPraeteritum = document.getElementById('answer-praeteritum');
    const answerPerfekt = document.getElementById('answer-perfekt');

    let currentVerb = null;
    let verbList = [...VERBS]; // Crée une copie de la liste pour la mélanger

    // Fonction pour normaliser une chaîne (ignorer la casse, les espaces)
    function normalize(str) {
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    // Fonction pour vérifier une réponse qui peut avoir des alternatives (ex: "hat/ist")
    function checkAnswer(userInput, correctAnswers) {
        const userNorm = normalize(userInput);
        const options = correctAnswers.split('/').map(opt => normalize(opt));
        return options.includes(userNorm);
    }

    // Fonction pour charger un nouveau verbe
    function loadNextVerb() {
        // Cacher les réponses, réinitialiser les champs
        answerContainer.style.display = 'none';
        checkButton.style.display = 'block';
        nextButton.style.display = 'none';
        
        praesensInput.value = '';
        praeteritumInput.value = '';
        perfektInput.value = '';
        
        praesensInput.disabled = false;
        praeteritumInput.disabled = false;
        perfektInput.disabled = false;

        praesensFeedback.textContent = '';
        praeteritumFeedback.textContent = '';
        perfektFeedback.textContent = '';
        
        praesensInput.classList.remove('correct-border', 'incorrect-border');
        praeteritumInput.classList.remove('correct-border', 'incorrect-border');
        perfektInput.classList.remove('correct-border', 'incorrect-border');

        // Choisir un verbe au hasard
        const randomIndex = Math.floor(Math.random() * verbList.length);
        currentVerb = verbList[randomIndex];
        
        // Afficher la question
        infinitiveEl.textContent = currentVerb.infinitive;
        translationEl.textContent = currentVerb.translation;
    }

    // Fonction pour vérifier les réponses de l'utilisateur
    function handleCheck(event) {
        event.preventDefault(); // Empêche le formulaire de recharger la page
        if (!currentVerb) return;

        // Récupérer les entrées
        const praesensUser = praesensInput.value;
        const praeteritumUser = praeteritumInput.value;
        const perfektUser = perfektInput.value;

        // Vérifier chaque champ
        const isPraesensCorrect = checkAnswer(praesensUser, currentVerb.praesens);
        const isPraeteritumCorrect = checkAnswer(praeteritumUser, currentVerb.praeteritum);
        const isPerfektCorrect = checkAnswer(perfektUser, currentVerb.perfekt);
        
        // Afficher feedback pour Präsens
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
        praesensInput.disabled = true;
        praeteritumInput.disabled = true;
        perfektInput.disabled = true;

        // Afficher la réponse correcte
        answerPraesens.textContent = currentVerb.praesens;
        answerPraeteritum.textContent = currentVerb.praeteritum;
        answerPerfekt.textContent = currentVerb.perfekt;
        answerContainer.style.display = 'block';

        // Changer les boutons
        checkButton.style.display = 'none';
        nextButton.style.display = 'block';
    }

    // Écouteurs d'événements
    quizForm.addEventListener('submit', handleCheck);
    nextButton.addEventListener('click', loadNextVerb);

    // Charger le premier verbe au démarrage
    loadNextVerb();
});
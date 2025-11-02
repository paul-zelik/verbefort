// main.js

document.addEventListener('DOMContentLoaded', () => {
    // navButtons inclura automatiquement le nouveau bouton "Mélange"
    const navButtons = document.querySelectorAll('.nav-button');
    const exercisePages = document.querySelectorAll('.exercise-page');

    // Suivi de l'initialisation pour ne lancer chaque jeu qu'une fois
    const exerciseInitialized = {
        'vocab-exercise': false,
        'conjug-exercise': false,
        'strong-verb-exercise': false
    };

    function showExercise(pageId) {
        // Cacher toutes les pages
        exercisePages.forEach(page => {
            page.classList.remove('active');
        });

        // Désactiver tous les boutons (y compris "Mélange")
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Afficher la page sélectionnée
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
        }

        // Activer le bouton de navigation correspondant au jeu lancé
        // ex: si pageId est 'vocab-exercise', il activera 'nav-vocab'
        const buttonToActivate = document.querySelector(`#nav-${pageId.split('-')[0]}`);
        if (buttonToActivate) {
            buttonToActivate.classList.add('active');
        }

        // Initialiser le jeu si c'est la première fois
        if (!exerciseInitialized[pageId]) {
            switch (pageId) {
                case 'vocab-exercise':
                    if (typeof initVocab === 'function') initVocab();
                    break;
                case 'conjug-exercise':
                    if (typeof initConjug === 'function') initConjug();
                    break;
                case 'strong-verb-exercise':
                    if (typeof initStrongVerbs === 'function') initStrongVerbs();
                    break;
            }
            exerciseInitialized[pageId] = true;
        }
    }

    // Gérer les clics sur la navigation
    document.getElementById('nav-vocab').addEventListener('click', () => {
        showExercise('vocab-exercise');
    });

    document.getElementById('nav-conjug').addEventListener('click', () => {
        showExercise('conjug-exercise');
    });

    document.getElementById('nav-strong-verbs').addEventListener('click', () => {
        showExercise('strong-verb-exercise');
    });

    // ***** NOUVELLE SECTION AJOUTÉE *****
    document.getElementById('nav-mixed').addEventListener('click', () => {
        // 1. Définir la liste des jeux possibles
        const games = ['vocab-exercise', 'conjug-exercise', 'strong-verb-exercise'];
        
        // 2. Choisir un jeu au hasard
        const randomGameId = games[Math.floor(Math.random() * games.length)];
        
        // 3. Lancer cet exercice
        // La fonction showExercise s'occupera d'activer le bon onglet (1, 2 ou 3)
        showExercise(randomGameId);
    });
    // ***********************************

    // Afficher le premier jeu par défaut (Vocabulaire)
    showExercise('vocab-exercise');
});
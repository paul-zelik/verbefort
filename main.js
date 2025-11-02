// main.js

document.addEventListener('DOMContentLoaded', () => {
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

        // Désactiver tous les boutons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Afficher la page sélectionnée
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
        }

        // Activer le bouton de navigation correspondant
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

    // Afficher le premier jeu par défaut (Vocabulaire)
    showExercise('vocab-exercise');
});
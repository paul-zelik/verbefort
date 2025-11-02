// exercise-vocab.js

function initVocab() {
    // --- SÉLECTEURS DOM (inchangés) ---
    const filter = document.getElementById('vocab-type-filter');
    const modeSelect = document.getElementById('vocab-mode');
    const startButton = document.getElementById('vocab-start-button');
    const quizArea = document.getElementById('vocab-quiz-area');
    const settingsArea = document.getElementById('vocab-settings');
    const questionEl = document.getElementById('vocab-question');
    const qcmChoices = document.getElementById('vocab-qcm-choices');
    const qcmButtons = qcmChoices.querySelectorAll('.qcm-choice');
    const inputArea = document.getElementById('vocab-input-area');
    const inputEl = document.getElementById('vocab-input');
    const nounInputArea = document.getElementById('vocab-noun-input-area');
    const determinerInput = document.getElementById('vocab-determiner-input');
    const nounInput = document.getElementById('vocab-noun-input');
    const checkButton = document.getElementById('vocab-check-button');
    const nextButton = document.getElementById('vocab-next-button');
    const feedbackEl = document.getElementById('vocab-feedback');

    // --- LOGIQUE DU JEU (Modifiée) ---
    let currentWord = null;
    let filteredList = []; // C'est notre "sessionList" de nouvelles questions
    let retryList = [];    // NOTRE NOUVELLE LISTE DE RATTRAPAGE
    let wasRetryQuestion = false; // Pour savoir si la question vient de la retryList
    let currentMode = '';

    // --- FONCTIONS UTILITAIRES (shuffleArray est nouveau) ---
    function normalize(str) {
        if (!str) return '';
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function loadQuestion() {
        // --- 1. Réinitialiser l'état (inchangé) ---
        feedbackEl.textContent = '';
        nextButton.style.display = 'none';
        checkButton.style.display = 'none';
        checkButton.disabled = false;
        qcmChoices.style.display = 'none';
        inputArea.style.display = 'none';
        nounInputArea.style.display = 'none';
        qcmButtons.forEach(btn => {
            btn.disabled = false;
            btn.className = 'qcm-choice';
        });
        inputEl.value = ''; inputEl.disabled = false; inputEl.className = '';
        determinerInput.value = ''; determinerInput.disabled = false; determinerInput.className = '';
        nounInput.value = ''; nounInput.disabled = false; nounInput.className = '';

        // --- 2. Choisir un mot (LOGIQUE MODIFIÉE) ---
        wasRetryQuestion = false;
        // 40% de chance de piocher dans la retryList si elle n'est pas vide
        if (retryList.length > 0 && Math.random() < 0.4) {
            currentWord = retryList.shift(); // Prend le 1er mot de la liste (le plus ancien)
            wasRetryQuestion = true;
        } else {
            // Sinon, prendre un nouveau mot dans la liste de la session
            if (filteredList.length === 0) {
                // Si la liste de session est vide, on la recrée
                const type = filter.value;
                if (type === 'all') filteredList = [...VOCAB];
                else filteredList = VOCAB.filter(word => word.type.startsWith(type));
                
                shuffleArray(filteredList);
            }
            currentWord = filteredList.pop(); // Prend le dernier mot de la liste
        }
        
        // Si on pioche le dernier mot et qu'il est aussi dans la retry list, on l'enlève de la retry list
        // pour éviter de le demander 2x d'affilée
        const retryIndex = retryList.indexOf(currentWord);
        if (retryIndex > -1) {
            retryList.splice(retryIndex, 1);
        }

        // --- 3. Déterminer le mode de la question (inchangé) ---
        let selectedMode = modeSelect.value;
        if (selectedMode === 'mixed') {
            currentMode = (Math.random() > 0.5) ? 'de-fr' : 'fr-de';
        } else {
            currentMode = selectedMode;
        }

        // --- 4. Configurer l'interface (inchangé) ---
        if (currentMode === 'de-fr') {
            qcmChoices.style.display = 'grid';
            questionEl.textContent = currentWord.german;
            let wrongAnswers = [];
            let fullListCopy = [...VOCAB];
            while (wrongAnswers.length < 3) {
                const randomWrongWord = fullListCopy[Math.floor(Math.random() * fullListCopy.length)];
                if (randomWrongWord.french !== currentWord.french && !wrongAnswers.includes(randomWrongWord.french)) {
                    wrongAnswers.push(randomWrongWord.french);
                }
            }
            const choices = [currentWord.french, ...wrongAnswers];
            shuffleArray(choices);
            qcmButtons.forEach((button, index) => {
                button.textContent = choices[index];
                button.onclick = () => checkQCMAnswer(button);
            });
        } else {
            questionEl.textContent = currentWord.french;
            checkButton.style.display = 'block';
            const isSingularNoun = currentWord.type === 'nom' && ['m', 'f', 'n'].includes(currentWord.gender);
            if (isSingularNoun) nounInputArea.style.display = 'flex';
            else inputArea.style.display = 'flex';
        }
    }

    function checkQCMAnswer(button) {
        qcmButtons.forEach(btn => btn.disabled = true);
        nextButton.style.display = 'block';
        
        const isCorrect = (normalize(button.textContent) === normalize(currentWord.french));

        if (isCorrect) {
            feedbackEl.textContent = "Correct !";
            feedbackEl.className = 'feedback correct';
            button.classList.add('correct');
            // (La question a déjà été retirée de la retryList par .shift() si elle en venait)
        } else {
            feedbackEl.textContent = `Incorrect. La bonne réponse était : ${currentWord.french}`;
            feedbackEl.className = 'feedback incorrect';
            button.classList.add('incorrect');
            qcmButtons.forEach(btn => {
                if (normalize(btn.textContent) === normalize(currentWord.french)) btn.classList.add('correct');
            });
            // AJOUTÉ : Remettre la question dans la liste de rattrapage
            retryList.push(currentWord);
        }
    }

    function checkInputAction() {
        checkButton.disabled = true;
        nextButton.style.display = 'block';

        const isSingularNoun = currentWord.type === 'nom' && ['m', 'f', 'n'].includes(currentWord.gender);
        let isFullyCorrect = false;

        if (isSingularNoun) {
            determinerInput.disabled = true;
            nounInput.disabled = true;
            const userDeterminer = normalize(determinerInput.value);
            const userNoun = normalize(nounInput.value);
            const correctNoun = normalize(currentWord.german);
            const correctDeterminer = normalize(
                currentWord.gender === 'm' ? 'der' :
                currentWord.gender === 'f' ? 'die' : 'das'
            );
            const isNounCorrect = (userNoun === correctNoun);
            const isDeterminerCorrect = (userDeterminer === correctDeterminer);

            if (isNounCorrect && isDeterminerCorrect) {
                isFullyCorrect = true;
                feedbackEl.textContent = "Correct !";
                feedbackEl.className = 'feedback correct';
                determinerInput.classList.add('correct-border');
                nounInput.classList.add('correct-border');
            } else if (isNounCorrect && !isDeterminerCorrect) {
                feedbackEl.textContent = `Demi-faute ! Le nom est bon, mais l'article est "${correctDeterminer}".`;
                feedbackEl.className = 'feedback warning';
                determinerInput.classList.add('warning-border');
                nounInput.classList.add('correct-border');
            } else {
                feedbackEl.textContent = `Incorrect. La bonne réponse était : ${correctDeterminer} ${correctNoun}`;
                feedbackEl.className = 'feedback incorrect';
                if (!isDeterminerCorrect) determinerInput.classList.add('incorrect-border');
                if (!isNounCorrect) nounInput.classList.add('incorrect-border');
            }
        } else {
            inputEl.disabled = true;
            const userAnswer = normalize(inputEl.value);
            const correctAnswer = normalize(currentWord.german);

            if (userAnswer === correctAnswer) {
                isFullyCorrect = true;
                feedbackEl.textContent = "Correct !";
                feedbackEl.className = 'feedback correct';
                inputEl.classList.add('correct-border');
            } else {
                feedbackEl.textContent = `Incorrect. La bonne réponse était : ${correctAnswer}`;
                feedbackEl.className = 'feedback incorrect';
                inputEl.classList.add('incorrect-border');
            }
        }
        
        // AJOUTÉ : Gérer la retryList
        if (!isFullyCorrect) {
            retryList.push(currentWord);
        }
    }

    startButton.addEventListener('click', () => {
        const type = filter.value;
        if (type === 'all') {
            filteredList = [...VOCAB];
        } else {
            filteredList = VOCAB.filter(word => word.type.startsWith(type));
        }

        if (filteredList.length === 0) {
            alert("Aucun mot ne correspond à ce filtre.");
            return;
        }
        if (filteredList.length < 4 && modeSelect.value === 'de-fr') {
            alert("Pas assez de mots dans cette catégorie pour un QCM (il en faut au moins 4). Changez de filtre.");
            return;
        }
        
        // MODIFIÉ : On mélange la liste de session et on vide la retryList
        shuffleArray(filteredList);
        retryList = [];

        settingsArea.style.display = 'none';
        quizArea.style.display = 'block';
        loadQuestion();
    });

    // Écouteurs d'événements (inchangés)
    checkButton.addEventListener('click', checkInputAction);
    nextButton.addEventListener('click', loadQuestion);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !checkButton.disabled) checkInputAction();
    });
    determinerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !checkButton.disabled) checkInputAction();
    });
    nounInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !checkButton.disabled) checkInputAction();
    });
}
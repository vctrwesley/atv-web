document.addEventListener('DOMContentLoaded', () => {
    let randomNumber;
    let attempts = 3;
    let maxNumber;
    let difficulty;
    let chosenNumbers = [];
    let currentDigitIndex = 0;

    const guessInput = document.getElementById('guessInput');
    const submitGuess = document.getElementById('submitGuess');
    const message = document.getElementById('message');
    const attemptsLeft = document.getElementById('attemptsLeft');
    const kassaNikel = document.getElementById('kassaNikel').children;
    const restartGame = document.getElementById('restartGame');
    const changeDifficulty = document.getElementById('changeDifficulty');
    const difficultySelection = document.getElementById('difficultySelection');
    const gamePlay = document.getElementById('gamePlay');
    const difficultyDisplay = document.getElementById('difficultyDisplay');
    const savePopup = document.getElementById('savePopup');
    const saveNameInput = document.getElementById('saveName');
    const saveGameButton = document.getElementById('saveGame');
    const closePopupButton = document.getElementById('closePopup');
    const historyList = document.getElementById('historyList');

    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', () => {
            maxNumber = parseInt(button.getAttribute('data-max'));
            difficulty = button.getAttribute('data-difficulty');
            startGame();
        });
    });

    function startGame() {
        randomNumber = Math.floor(Math.random() * maxNumber) + 1;
        attempts = 3;
        chosenNumbers = [];
        currentDigitIndex = 0;
        message.textContent = '';
        guessInput.value = '';
        attemptsLeft.textContent = attempts;
        resetDigits();
        submitGuess.style.display = 'inline';
        guessInput.disabled = false;
        restartGame.style.display = 'none';
        changeDifficulty.style.display = 'none';
        difficultyDisplay.textContent = `Dificuldade: ${difficulty}`;

        difficultySelection.style.display = 'none';
        gamePlay.style.display = 'block';
        historyContainer.style.display = 'block';
        clearHistory.style.display = 'inline';
        loadHistory();
    }

    submitGuess.addEventListener('click', () => {
        const userGuess = parseInt(guessInput.value);

        guessInput.value = '';

        if (isNaN(userGuess) || userGuess < 1 || userGuess > maxNumber) {
            message.textContent = `Por favor, insira um número entre 1 e ${maxNumber}.`;
            return;
        }

        if (chosenNumbers.includes(userGuess)) {
            message.textContent = 'Você já escolheu esse número! Tente outro.';
            return;
        }

        chosenNumbers.push(userGuess);
        updateDigit(userGuess);

        attempts--;

        if (userGuess === randomNumber) {
            message.textContent = 'Parabéns! Você acertou o número!';
            message.className = 'correct';
            celebrate();
            endGame(true);
            return;
        }

        const difference = Math.abs(userGuess - randomNumber);

        if (difference >= 5) {
            if (userGuess > randomNumber) {
                message.textContent = 'Muito alto! Tente novamente.';
                message.className = 'high';
            } else {
                message.textContent = 'Muito baixo! Tente novamente.';
                message.className = 'low';
            }
        } else if (difference <= 2) {
            if (userGuess > randomNumber) {
                message.textContent = 'Quase lá! Tente um valor um pouco mais baixo.';
                message.className = 'near high';
            } else {
                message.textContent = 'Quase lá! Tente um valor um pouco mais alto.';
                message.className = 'near low';
            }
        }

        attemptsLeft.textContent = attempts;

        if (attempts === 0) {
            message.textContent = `Você perdeu! O número era ${randomNumber}.`;
            message.className = '';
            endGame(false);
        }
    });

    restartGame.addEventListener('click', () => {
        startGame();
    });

    changeDifficulty.addEventListener('click', () => {
        difficultySelection.style.display = 'block';
        gamePlay.style.display = 'none';
        historyContainer.style.display = 'none';
    });

    saveGameButton.addEventListener('click', () => {
        const saveName = saveNameInput.value.trim();
        if (saveName) {
            saveGameHistory(saveName);
            saveNameInput.value = '';
            savePopup.style.display = 'none';
            gamePlay.style.display = 'block';
        }
    });

    closePopupButton.addEventListener('click', () => {
        savePopup.style.display = 'none';
        gamePlay.style.display = 'block';
    });

    clearHistory.addEventListener('click', () => {
        localStorage.removeItem('gameHistory');
        loadHistory();
    });

    function celebrate() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            shapes: ['circle'],
            colors: ['#FFD700']
        });
    }

    function endGame(won) {
        submitGuess.style.display = 'none';
        guessInput.disabled = true;
        restartGame.style.display = 'inline';
        changeDifficulty.style.display = 'inline';
        savePopup.style.display = 'block';
        gamePlay.style.display = 'none';
        savePopup.querySelector('h2').textContent = won ? 'Parabéns! Salve sua Vitória!' : 'Você perdeu! Salve seu Jogo!';
    }

    function resetDigits() {
        for (let i = 0; i < kassaNikel.length; i++) {
            kassaNikel[i].textContent = '-';
        }
    }

    function updateDigit(number) {
        if (currentDigitIndex < kassaNikel.length) {
            kassaNikel[currentDigitIndex].textContent = number;
            currentDigitIndex++;
        }
    }

    function saveGameHistory(name) {
        const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        history.push({
            name: name,
            difficulty: difficulty,
            won: message.classList.contains('correct'),
            attempts: 3 - attempts
        });
        localStorage.setItem('gameHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        historyList.innerHTML = '';
        history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name} - Dificuldade: ${entry.difficulty} - ${entry.won ? 'Vitória' : 'Derrota'} - Tentativas: ${entry.attempts}`;
            historyList.appendChild(listItem);
        });
    }

    loadHistory();
});

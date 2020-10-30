/*----- constants -----*/
const WORDS = [
    'ARRAY', 'FUNCTION', 'BINARY', 'VARIABLE', 'BOOLEAN', 'REACT', 'COMPUTER SCIENCE',
    'TERMINAL', 'EVENTS'
];

const PANEL_WIDTH = 15;
const MAX_WRONG_COUNT = 6;

/*----- app's state (variables) -----*/
let secretWord;
let guessWord;
let gameStatus; //null = in progress; 👎 = lose; 👍 = win
let wrongLetters;

/*----- cached element references -----*/

const guessEl = document.getElementById('guess');
const replayBtn = document.getElementById('replay');
const gallowsEl = document.getElementById('gallows');
const letterBtns = document.querySelectorAll('section > button');
const msgEl = document.getElementById('msg');

/*----- event listeners -----*/
document.querySelector('section')
    .addEventListener('click', handleLetterClick);

document.getElementById('replay')
    .addEventListener('click', init)


/*----- functions -----*/
init ();

//in response to the user interactions, update state and call render.
function handleLetterClick(evt) {
    //debugger; //this allows you to debug your JS.
    const letter = evt.target.textContent
    //evt.target is equal to the button. The .textContent is going to grab the letter 
    //from the button.

    //this is the exit function if the following conditions are met
    if (evt.target.tagName !== 'BUTTON' || gameStatus) return;
   //if the letter is in the secret word
   //we will need to update our guessWord where all of the instances of that letter is in the secretWord. 
    if (secretWord.includes(letter)) {
        let newGuess = '';
        for (let i = 0; i < secretWord.length; i++) {
            newGuess += secretWord.charAt(i) === letter ? letter : guessWord.charAt(i);
        }
        guessWord = newGuess;

    } else {
   //otherwise add the letter to the wrongLetters 
        wrongLetters.push(letter);
    }
    gameStatus = getGameStatus();
    render();
}

function getGameStatus() {
    if (guessWord === secretWord) {
        return '👍';
    } else if (wrongLetters.length === MAX_WRONG_COUNT) {
        return '👎';
    } else {
        return null;
    }
    //if (guessWord === secretWord) return 'winner';
    //if (wrongLetters.length === MAX_WRONG_COUNT) return 'loser';
    //return null; <-- this block is a more concise way of writing the above if, else statement. 
}

//render transfers all STATE to the DOM
function render() {
    guessEl.textContent = guessWord;
    //we want to hide/show the 'play again' element (the button)
    replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden';
    gallowsEl.style.backgroundPositionX = `-${wrongLetters.length * PANEL_WIDTH}vmin`;
    renderButtons();
    renderMessage();

}

function renderButtons() {
    letterBtns.forEach(function(btn) {
        const letter = btn.textContent
        btn.disabled = guessWord.includes(letter) || wrongLetters.includes(letter);
        if (guessWord.includes(letter)) {
            btn.className = 'valid-letter';
        } else if (wrongLetters.includes(letter)) {
            btn.className = 'wrong-letter';
        } else {
            btn.className = '';
        }

    });
}

function renderMessage() {
    if (gameStatus === '👍') {
        msgEl.textContent = 'Congrats! You won!';
    } else if (gameStatus === '👎'){
        msgEl.textContent = 'RIP';
    } else {
        const numRemaining = MAX_WRONG_COUNT - wrongLetters.length
        msgEl.innerHTML = `Good Luck <br> <span>${numRemaining} Wrong Guess${numRemaining === 1 ? '' : 'es'} remaining</span>`;

    }
}
function init() {
    //This is going to pull up a random number within the length of the WORDS array.
    const rndIdx = Math.floor(Math.random() * WORDS.length);
    //This sets the value of secretWord variable to be a random index value within the WORDS array.
    secretWord = WORDS[rndIdx];
    guessWord = '';
    // init guessWord with underscore for each char in secretWord
    for (let char of secretWord) {
        guessWord += (char === ' ') ? ' ' : '_';
    }
    gameStatus = null;
    wrongLetters = [];
    render();

    
}
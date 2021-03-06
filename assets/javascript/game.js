// Global variables
var displayWC = document.getElementById("win-count");
var displayLC = document.getElementById("loss-count");
var displayRGC = document.getElementById("remaining-guess-count");
var displayUG = document.getElementById("used-guesses");
var displayCW = document.getElementById("current-word");
var displayMT = document.getElementById("model-text");
// Main wordGuessGame Object
var wordGuessGame = {

    init: function () {
        // Set the internal variables
        this.winCount = 0;  // Current Win Count
        this.lossCount = 0; // Current Loss Count
        this.usedGuesses = []; // Array of used guess for current round
        this.currentWord = []; // Array of the current word. @ will replace correctly guessed letters
        this.currentWordStr; // A string of the current word.
        this.displayWord; // A string, spaced seperated, of the current word with a _ for unguessed letters
        this.displayWordArray = []; // A array, spaced seperated, of the current word with a _ for unguessed letters
        this.wordList; // An object of words. Two Parts: 'word' type string and 'used' type Boolean
        this.unSolvedLetterCount; // Count of unsolved letters in the current word
        this.remainingGuesses = 9; // Remaining guess Count
        this.previousWords = []; // Stores the previous words, only used by front end for display purposes
        // Populate the Original Screen
        displayWC.textContent = this.winCount;
        displayLC.textContent = this.lossCount;
        // Run the Initialization Functions
        this.loadWords();
        this.nextWord();

    },

    // This will return "NEXTLETTER" - "USEDLETTER" - "LOSS" - "WIN" - "GAMEOVER-WIN", "GAMEOVER-LOSS"
    // Returns can be ignored or used for formatting the display.
    letterGuess: function (guess) {
        // Take the guess and check it out.
        if (this.usedGuesses.indexOf(guess.toLowerCase()) != -1) {
            return "USEDLETTER";
        }
        // See if it's in the array
        else if (this.currentWord.indexOf(guess.toLowerCase()) != -1) {
           // this.remainingGuesses--;
            this.usedGuesses.push(guess.toLowerCase());
            this.formatWordDisplay(guess);
        }
        // Not in, not guessed, must be a miss.
        else {
            this.remainingGuesses--;
            this.usedGuesses.push(guess.toLowerCase());
        }
        // Update first part of the display
        displayUG.textContent = this.formatUsedGuesses();
        displayRGC.textContent = this.remainingGuesses;
        displayCW.textContent = this.displayWord;

        // Check to see if the word is solved and if any words remain
        if (this.unSolvedLetterCount === 0 && this.wordList.length === 0) {
            this.winCount++;
            displayWC.textContent = this.winCount;
            return "GAMEOVER-WIN";
        }
        // Check to see if the word is solved, request the next question
        else if (this.unSolvedLetterCount === 0) {
            this.winCount++;
            displayWC.textContent = this.winCount;
            this.nextWord();
            return "WIN";
        }
        // Check to see if the word is unsolved, no guesses remain, and if any words remain
        else if (this.unSolvedLetterCount > 0 && this.wordList.length === 0 && this.remainingGuesses === 0 ) {
            this.lossCount++;
            displayLC.textContent = this.lossCount;
            return "GAMEOVER-LOSS";
        }
        // Check to see if the word is unsolved, no guesses remain, and if any words remain
        else if (this.unSolvedLetterCount > 0 && this.remainingGuesses === 0 ) {
            this.lossCount++;
            displayLC.textContent = this.lossCount;
            this.nextWord();
            return "LOSS";
        }
        return "NEXTLETTER";
    },

    nextWord: function () {
        //reset remaining guesses
        this.remainingGuesses = 15;
        // Get a randmon index from the array
        var ranIndex = Math.floor(Math.random() * this.wordList.length);
        // Turn the word into an array and set the display words to _ _ _ _
        this.unSolvedLetterCount = this.wordList[ranIndex].word.length;
        this.currentWordStr = this.wordList[ranIndex].word;
        // Add the word to the list of previous words
        this.previousWords[this.winCount+this.lossCount] = this.wordList[ranIndex].word;
        this.currentWord = this.wordList[ranIndex].word.split('');
        this.displayWord = "";
        this.displayWordArray = [];
        for (var i = 0; i < this.currentWord.length; i++) {
            this.displayWordArray.push("_");
            this.displayWord = this.displayWord + "_ ";
        }
        // remove that extra space from the end of display word
        this.displayWord = this.displayWord.substr(0,this.displayWord.length-1);
        // Remove this word from the array.
        this.wordList.splice(ranIndex, 1);
        //Blank out the guesses
        this.usedGuesses = [];
        // Build the Screen
        displayUG.textContent = this.usedGuesses;
        displayRGC.textContent = this.remainingGuesses;
        displayCW.textContent = this.displayWord;
    },

    formatUsedGuesses: function () {
        var csvString = "";
        var iMax = this.usedGuesses.length;
        for (var i = 0; i < iMax; i++) {
            csvString += this.usedGuesses[i] + ", ";
        }
        // remove the extra ", " from the string's end
        return csvString.substr(0, csvString.length - 2);

    },

    // This goes through and updates the visable word string.
    formatWordDisplay: function (guess) {
        var indexOfGuess;
        while (this.currentWord.indexOf(guess.toLowerCase()) != -1) {
            indexOfGuess = this.currentWord.indexOf(guess.toLowerCase());
            this.displayWordArray[indexOfGuess] = this.currentWord[indexOfGuess];
            this.currentWord[indexOfGuess] = "@";
            this.unSolvedLetterCount--;
        }
        this.displayWord = "";
        for (var i = 0; i < this.displayWordArray.length; i++) {
            this.displayWord = this.displayWord + this.displayWordArray[i] + " ";
        }
        // Remove that extra space from the displayword.
        this.displayWord = this.displayWord.substr(0,this.displayWord.length-1);
    },

    
    loadWords: function () {
        this.wordList = [
            { word: "in west philadelphia born and raised", used: false },
            { word: "there's no crying in baseball", used: false },
            { word: "you're killin me smalls", used: false },
            { word: "keep the change ya filthy animal", used: false },
            { word: "this one time at band camp", used: false },
            { word: "to infinity and beyond", used: false },
            { word: "stop looking at me swan", used: false },
            { word: "i see dead people", used: false },
            { word: "i totally paused", used: false },
            { word: "you are a sad strange little man and you have my pity", used: false },
            { word: "you do not talk about fight club", used: false },
            { word: "what's in the box", used: false },
            { word: "Sell crazy somewhere else we're all stocked up here", used: false }];
    }
};

// Create and Initialize the Game.
var newGame = Object.create(wordGuessGame);

newGame.init();

// "LOSS" - "WIN" - "GAMEOVER-WIN", "GAMEOVER-LOSS"
//Call the letterGuess function.
document.onkeyup = function (event) {
    var returnValue = "";
    var userGuess = event.key;
    returnValue = newGame.letterGuess(userGuess);
    if(returnValue === "USEDLETTER") {
        displayMT.textContent = ("'" + userGuess + "' has already been guessed!");
        $("#myModal").modal();
    }
    else if(returnValue === "LOSS") {
        displayMT.textContent = ("oh Noes!!! You lost...");
        $("#myModal").modal();
    }
    else if(returnValue === "WIN") {
        displayMT.textContent = ("Huzzah!!! You won!");
        $("#myModal").modal();
    }
    else if(returnValue === "GAMEOVER-WIN") {
        displayMT.textContent = ("The game is over but you left a winner! Your final score is " + newGame.winCount + " wins and " + newGame.lossCount+ " losses.");
        $("#myModal").modal();
    }
    else if(returnValue === "GAMEOVER-LOSS") {
        displayMT.textContent = ("You lost the final round! Your final score is " + newGame.winCount + " wins and " + newGame.lossCount+ " losses.");
        $("#myModal").modal();
    }
    //$("#myModal").modal();
    if(returnValue === "GAMEOVER") {
        alert("Game Over. Wins: " + newGame.winCount + ", Losses: " + newGame.lossCount)
    }
};
const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById("final-message-reveal-word");
const figureParts = document.querySelectorAll(".figure-part");
const keyboardContainer = document.getElementById("keyboard");
const winsElement = document.getElementById("wins");
const lossesElement = document.getElementById("losses");

const words = [
  "application", "programming", "interface", "wizard", "element",
  "prototype", "callback", "undefined", "arguments", "settings",
  "selector", "container", "instance", "response", "console",
  "constructor", "token", "function", "return", "length",
  "type", "node", "javascript", "developer", "algorithm",
  "database", "variable", "constant", "iteration", "conditional"
];

let selectedWord = "";
let playable = true;
let wins = 0;
let losses = 0;

const correctLetters = [];
const wrongLetters = [];

// Create keyboard buttons
function createKeyboard() {
  keyboardContainer.innerHTML = "";
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.className = "key";
    button.textContent = letter;
    button.setAttribute("data-letter", letter);
    button.addEventListener("click", () => handleLetterClick(letter));
    keyboardContainer.appendChild(button);
  }
}

// Handle letter click (for keyboard buttons)
function handleLetterClick(letter) {
  if (!playable) return;

  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
      updateWordDisplay();
    } else {
      showNotification();
    }
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter);
      updateWrongLettersDisplay();
    } else {
      showNotification();
    }
  }
  checkGameStatus();
  updateKeyboard();
}

// Update keyboard buttons state
function updateKeyboard() {
  const keys = document.querySelectorAll(".key");
  keys.forEach(key => {
    const letter = key.getAttribute("data-letter");
    if (correctLetters.includes(letter)) {
      key.disabled = true;
      key.style.backgroundColor = "var(--success-color)";
    } else if (wrongLetters.includes(letter)) {
      key.disabled = true;
      key.style.backgroundColor = "var(--error-color)";
    } else {
      key.disabled = false;
      key.style.backgroundColor = "var(--secondary-color)";
    }
  });
}

// Display the word with correct letters filled in
function updateWordDisplay() {
  wordElement.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
      )
      .join("")}
  `;

  // Remove newline characters and check if player won
  const innerWord = wordElement.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    wins++;
    winsElement.textContent = wins;
    finalMessage.textContent = "Congratulations! You won! 🎉";
    finalMessageRevealWord.textContent = "";
    popup.style.display = "flex";
    playable = false;
  }
}

// Update wrong letters display
function updateWrongLettersDisplay() {
  wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong Letters:</p>" : ""}
    ${wrongLetters.map(letter => `<span>${letter}</span>`).join(", ")}
  `;

  // Display hangman parts based on wrong letters count
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    part.style.display = index < errors ? "block" : "none";
  });

  // Check if player lost
  if (wrongLetters.length === figureParts.length) {
    losses++;
    lossesElement.textContent = losses;
    finalMessage.textContent = "Game Over! You lost. 😕";
    finalMessageRevealWord.textContent = `The word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
  }
}

// Show notification for duplicate letters
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Check game status
function checkGameStatus() {
  const innerWord = wordElement.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    wins++;
    winsElement.textContent = wins;
    finalMessage.textContent = "Congratulations! You won! 🎉";
    finalMessageRevealWord.textContent = "";
    popup.style.display = "flex";
    playable = false;
  } else if (wrongLetters.length === figureParts.length) {
    losses++;
    lossesElement.textContent = losses;
    finalMessage.textContent = "Game Over! You lost. 😕";
    finalMessageRevealWord.textContent = `The word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
  }
}

// Reset game
function resetGame() {
  playable = true;
  correctLetters.splice(0);
  wrongLetters.splice(0);
  selectedWord = words[Math.floor(Math.random() * words.length)];
  
  updateWordDisplay();
  updateWrongLettersDisplay();
  updateKeyboard();
  
  popup.style.display = "none";
}

// Initialize game
function init() {
  createKeyboard();
  resetGame();
}

// Event listeners
playAgainButton.addEventListener("click", resetGame);

// Keyboard event listener
window.addEventListener("keydown", e => {
  if (playable) {
    const letter = e.key.toLowerCase();
    if (/^[a-z]$/.test(letter)) {
      handleLetterClick(letter);
    }
  }
});

// Initialize the game
init();
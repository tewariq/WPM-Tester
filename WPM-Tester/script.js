const inputField = document.getElementById("input");
const timeLeft = document.getElementById("time");
const charsTyped = document.getElementById("charsTyped");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const paragraphContainer = document.getElementById("paragraph");

let time = 60;
let typedCharsCount = 0;
let correctCharsCount = 0;
let interval;
let typedText = "";
let typingStarted = false;

const paragraphText = paragraphContainer.innerText;

function startGame() {
  inputField.addEventListener("input", () => {
    if (!typingStarted) {
      typingStarted = true;
      interval = setInterval(updateTimeAndStats, 1000); // Update time and stats every second
      updateStats(); // Display accuracy from the beginning
    }
    checkInput();
  });
}

function updateTimeAndStats() {
  time--;
  timeLeft.innerText = time;
  updateStats();
}

function checkInput(event) {
  // Ignore the shift key
  if (event && event.key === "Shift") {
    event.preventDefault();
    return;
  }

  // Prevent the use of backspace
  if (event && event.key === "Backspace") {
    event.preventDefault();
    return;
  }

  typedText = inputField.value;
  typedCharsCount = typedText.length;

  const typedChars = typedText.split("");
  const paragraphChars = paragraphText.split("");

  correctCharsCount = 0;

  // Check if the current word is typed correctly
  const cursorPosition = inputField.selectionStart;
  const currentWordStartIndex =
    typedText.lastIndexOf(" ", cursorPosition - 1) + 1;
  const currentWordEndIndex = typedText.indexOf(" ", cursorPosition);
  const currentWord = typedText.substring(
    currentWordStartIndex,
    currentWordEndIndex === -1 ? typedCharsCount : currentWordEndIndex
  );

  const paragraphCurrentWord = paragraphText.substring(
    currentWordStartIndex,
    currentWordStartIndex + currentWord.length
  );

  // If the current character in the paragraph is a space, allow spacebar to function normally
  if (paragraphChars[cursorPosition] === " ") {
    return;
  }

  // Automatically fill out the rest of the current word when spacebar is pressed
  if (event && event.key === " ") {
    event.preventDefault(); // Prevent default space behavior

    let index = cursorPosition;
    let filledWord = "";

    // Fill out the current word until a space is reached in the paragraph
    while (paragraphChars[index] !== " ") {
      filledWord += paragraphChars[index];
      index++;
    }

    // Fill out the rest of the current word
    inputField.value =
      typedText.substring(0, cursorPosition) +
      filledWord +
      " " +
      typedText.substring(cursorPosition);
    inputField.setSelectionRange(
      cursorPosition + filledWord.length + 1,
      cursorPosition + filledWord.length + 1
    );
    return;
  }

  // Iterate through each character up to the current input position in the paragraph and compare with user input
  for (let index = 0; index < typedCharsCount; index++) {
    const charSpan = document.getElementById(`char${index}`);
    if (!charSpan) continue; // Skip if no corresponding span found

    if (typedChars[index] === paragraphChars[index]) {
      charSpan.classList.remove("incorrect");
      charSpan.classList.add("correct");
      correctCharsCount++;
    } else {
      charSpan.classList.remove("correct"); // Remove 'correct' class if character is incorrect
      charSpan.classList.add("incorrect");
    }
  }
}

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

function updateStats() {
  charsTyped.innerText = typedCharsCount;
  const charactersTyped = typedCharsCount / 5; // Characters typed divided by 5 (average word length)
  const seconds = 60 - time; // Time remaining in seconds
  const rawWPM = (charactersTyped / seconds) * 60; // Raw WPM calculation
  const adjustedWPM = rawWPM - (typedCharsCount - correctCharsCount); // Adjusted WPM by subtracting incorrect characters
  const calculatedWPM = Math.max(0, Math.round(adjustedWPM)); // Ensure WPM is non-negative
  wpmDisplay.textContent = calculatedWPM; // Update the WPM display on the screen
  const accuracy = (correctCharsCount / typedCharsCount) * 100 || 0;
  accuracyDisplay.innerText = `Accuracy: ${accuracy.toFixed(2)}%`; // Update the accuracy display
}

function endGame() {
  clearInterval(interval);
  inputField.removeEventListener("input", checkInput);
  inputField.disabled = true;
  alert("Time is up! Your WPM is " + wpmDisplay.innerText);
}

document.addEventListener("DOMContentLoaded", () => {
  // Dynamically add span elements to wrap each character in the paragraph
  paragraphContainer.innerHTML = paragraphText
    .split("")
    .map((char, index) => `<span id="char${index}">${char}</span>`)
    .join("");

  startGame();
});

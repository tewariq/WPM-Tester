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
let prevIndex = 0;

const paragraphText = paragraphContainer.innerText;

function startGame() {
  inputField.addEventListener("input", () => {
    if (!typingStarted) {
      typingStarted = true;
      interval = setInterval(updateTimeAndStats, 1000); // Update time and stats every second
    }
    checkInput();
  });
}

function updateTimeAndStats() {
  updateTime();
  updateStats();
}

function updateTime() {
  if (time > 0) {
    time--;
    timeLeft.innerText = time;
  } else {
    endGame();
  }
}

function checkInput(event) {
  // Ignore the shift key
  if (event && event.key === "Shift") {
    event.preventDefault();
    return;
  }

  if (event && event.key === "Enter") {
    event.preventDefault();
    return;
  }

  if (event && event.key === "ArrowLeft") {
    event.preventDefault();
    return;
  }

  if (event && event.key === "ArrowUp") {
    event.preventDefault();
    return;
  }

  if (event && event.key === "ArrowRight") {
    event.preventDefault();
    return;
  }

  if (event && event.key === "ArrowDown") {
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

  // Find the start index of the current word
  let currentWordStartIndex = typedCharsCount - 1;
  while (
    currentWordStartIndex >= 0 &&
    typedText[currentWordStartIndex] !== " "
  ) {
    currentWordStartIndex--;
  }
  currentWordStartIndex++;

  // Find the end index of the current word
  let currentWordEndIndex = typedCharsCount;
  while (
    currentWordEndIndex < paragraphChars.length &&
    paragraphChars[currentWordEndIndex] !== " "
  ) {
    currentWordEndIndex++;
  }

  // Extract the current word
  const currentWord = typedText.substring(
    currentWordStartIndex,
    currentWordEndIndex
  );

  // If the current character in the paragraph is a space and not the first character, allow spacebar to function normally
  if (
    paragraphChars[currentWordStartIndex] === " " &&
    currentWordStartIndex > 0
  ) {
    return;
  }

  // Automatically fill out the rest of the current word when spacebar is pressed
  if (event && event.key === " ") {
    // If the current character is not a space, proceed with autofill
    if (paragraphChars[currentWordStartIndex] !== " ") {
      event.preventDefault(); // Prevent default space behavior

      let index = currentWordStartIndex;
      let filledWord = "";

      // Fill out the current word until a space is reached in the paragraph
      while (index < paragraphChars.length && paragraphChars[index] !== " ") {
        filledWord += paragraphChars[index];
        index++;
      }

      // Fill out the rest of the current word
      inputField.value =
        typedText.substring(0, currentWordStartIndex) +
        filledWord +
        " " +
        typedText.substring(currentWordEndIndex);
      inputField.setSelectionRange(
        currentWordStartIndex + filledWord.length + 1,
        currentWordStartIndex + filledWord.length + 1
      );
      return;
    }
  }

  // Iterate through each character in the current word and compare with the paragraph
  for (let index = 0; index < currentWord.length; index++) {
    const typedChar = currentWord[index];
    const paragraphChar = paragraphChars[currentWordStartIndex + index];

    // If the typed character is a letter or punctuation
    if (/[a-zA-Z.,!?'" ]/.test(typedChar)) {
      const charSpan = document.getElementById(
        `char${currentWordStartIndex + index}`
      );

      if (typedChar === paragraphChar) {
        charSpan.classList.remove("incorrect");
        charSpan.classList.add("correct");
        correctCharsCount++;
      } else {
        charSpan.classList.remove("correct");
        charSpan.classList.add("incorrect");
      }
    }
  }
}

// Add event listener to the input field for keyboard events
inputField.addEventListener("keydown", checkInput);

function updateStats() {
  const currentTime = 60 - time; // Current time in seconds

  // Characters typed divided by 5 (average word length)
  const charactersTyped = typedCharsCount / 5;

  // Raw WPM calculation
  const rawWPM = (charactersTyped / currentTime) * 60;

  // Adjusted WPM by subtracting incorrect characters
  const adjustedWPM = Math.max(
    0,
    rawWPM - (typedCharsCount - correctCharsCount)
  );

  // Ensure WPM is non-negative
  const calculatedWPM = Math.round(adjustedWPM);

  // Update the WPM display on the screen
  wpmDisplay.textContent = calculatedWPM;

  // Calculate accuracy
  const accuracy = (correctCharsCount / typedCharsCount) * 100 || 0;

  // Update the accuracy display
  accuracyDisplay.innerText = `Accuracy: ${accuracy.toFixed(2)}%`;
}

// Initialize the last typed characters count
updateStats.lastTypedCharsCount = 0;

function endGame() {
  clearInterval(interval);
  clearInterval(interval2);
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

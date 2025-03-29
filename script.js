// ********* SAMPLE TEXT DATA *********
// Provides text options for the typing test.
const sampleTexts = {
    1: "The quick brown fox jumps over the lazy dog. This is one of the most famous pangrams used in typing tests. It contains all the letters of the alphabet at least once. Typing tests often use pangrams like this one to ensure that the typist is practicing with every character available.",
    2: "The beauty of nature is a gift we should cherish every day. The blue sky, green grass, and chirping birds make life more enjoyable. A morning walk in the park can refresh your mind and body. Each moment in nature is like a painting come to life. Let us protect this wonderful world for future generations.",
    3: "A good habit can change your life. Brushing your teeth, drinking water, and eating healthy food keep you fit. Reading books can open new ideas and knowledge. Small habits, like being kind and saying thank you, spread happiness. Start today with one positive habit, and you’ll see a difference tomorrow.",
    4: "Creativity is about thinking outside the box, pushing boundaries, and exploring new ideas.Critical thinking and problem-solving are essential skills in the modern era of innovation.",
    5: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where’s the peck of pickled peppers Peter Piper picked?",
    6: "Happiness depends upon ourselves. This quote by Aristotle teaches us that happiness is a state of mind, not determined by external circumstances. Typing this sentence challenges typists to maintain accuracy while typing simpler yet impactful words over a longer period.",
    7: "In the modern world, technology plays a key role in shaping our daily lives. From communication to travel, it makes tasks faster and easier. Social media connects us with friends and family around the globe, but we must use it wisely. Balancing technology and personal connections is the key to a happy life in today’s age of innovation.",
    8:"The concept of time fascinates scientists and philosophers alike. Time is a continuous flow, an invisible thread that ties our past, present, and future. It governs all aspects of life, yet remains a mystery. Managing time wisely is essential for personal growth. Each moment is a chance to create memories, achieve goals, and reflect on our journey.",
    9:"Many people think writing is easy; however, true mastery comes with practice. A misplaced comma, a missing apostrophe, or an incorrectly used semicolon can change the meaning of a sentence entirely. For instance: 'It's her book,' and 'Its cover is blue.' See the difference? Use punctuation carefully.",
    10:"In literature, punctuation influences the rhythm of the text: short sentences convey urgency; long sentences create a sense of flow. Consider this: 'The sky, covered in clouds, seemed endless; it stretched far beyond the horizon, shimmering with faint silver tones, as if holding secrets of the universe.' How does punctuation change the mood of this?",

};

// ********* VARIABLES TO TRACK TEST STATE *********
// Tracks timing and stats during the typing test.
let startTime, timerInterval, testDuration = 30; // Default test duration is 30 seconds.
let typingStarted = false, totalTyped = 0, correctTyped = 0, elapsedTime = 0;
let wrongWordsCount = 0; // Counter for incorrectly typed words.

// ********* AUDIO FEEDBACK REFERENCES *********
// References to HTML audio elements for feedback sounds.
const soundCorrect = document.getElementById("rightLetterSound");
const soundWrong = document.getElementById("wrongLetterSound");
const soundDone = document.getElementById("spacebarSound");

// ********* DOM ELEMENT REFERENCES *********
// Key HTML elements for displaying and interacting with the typing test.
const typingArea = document.getElementById("typingArea");
const sampleTextDisplay = document.getElementById("sampleTextDisplay");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const progressBar = document.getElementById("progressBar");
const timerDisplay = document.getElementById("timer");
const leaderboardTable = document.getElementById("leaderboardTable");
const retakeButton = document.getElementById("retakeTest");
const letterCounterDisplay = document.getElementById("letterCounter");

// ********* EVENT LISTENERS *********
// Triggers whenever sample text or duration is selected/changed.
document.getElementById("sampleTextSelector").addEventListener("change", loadSampleText);
document.getElementById("timeSelector").addEventListener("change", function () {
    testDuration = parseInt(this.value); // Updates the test duration based on user input.
});

// Listens for typing input and starts tracking once the typing begins.
typingArea.addEventListener("input", function () {
    if (!typingStarted) startTest(); // Starts the test if not already started.
    trackTyping(); // Tracks typing progress.
    updateLetterCount(); // Updates the typed letter count.
});

// Resets the test when the "retake" button is clicked.
retakeButton.addEventListener("click", function () {
    resetTest();
});

// ********* FUNCTIONS *********

// 1. Load the selected sample text into the display area.
function loadSampleText() {
    const selectedTextId = document.getElementById("sampleTextSelector").value;
    if (selectedTextId) {
        sampleTextDisplay.innerHTML = `<p>${sampleTexts[selectedTextId]}</p>`;
        typingArea.disabled = false; // Enables the typing area.
        typingArea.value = ""; // Clears any existing input.
        typingStarted = false; // Resets typing state.
    }
}

// 2. Start the typing test and initialize variables.
function startTest() {
    typingStarted = true;
    totalTyped = 0;
    correctTyped = 0;
    wrongWordsCount = 0;
    elapsedTime = 0;
    startTime = Date.now(); // Records the start time.
    timerInterval = setInterval(updateTimer, 1000); // Updates the timer every second.
    setTimeout(endTest, testDuration * 1000); // Ends the test after the specified duration.
}

// 3. Update the letter counter in real-time.
function updateLetterCount() {
    letterCounterDisplay.textContent = `Typed Letters: ${typingArea.value.length}`;
}

// 4. Update the timer and progress bar during the test.
function updateTimer() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculates elapsed time.
    const timeLeft = testDuration - elapsedTime;
    timerDisplay.textContent = `Time Remaining: ${timeLeft}`;

    // Calculate and update progress bar height.
    let progress = (elapsedTime / testDuration) * 100;
    if (progress > 100) progress = 100;
    progressBar.style.height = `${progress}%`;

    // Change progress bar color based on remaining time.
    if (progress >= 75) {
        progressBar.style.backgroundColor = '#FF5733'; // Red for last 25%.
    } else if (progress >= 50) {
        progressBar.style.backgroundColor = '#FFC300'; // Yellow for middle progress.
    } else {
        progressBar.style.backgroundColor = '#28A745'; // Green for first 50%.
    }
}

// 5. Track typing accuracy and provide real-time feedback.
function trackTyping() {
    const typedText = typingArea.value;
    const sampleText = sampleTexts[document.getElementById("sampleTextSelector").value];

    let highlightedText = "";
    totalTyped = typedText.length; // Updates total typed character count.
    correctTyped = 0; // Resets correct count.
    wrongWordsCount = 0; // Resets wrong word count.

    for (let i = 0; i < sampleText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === sampleText[i]) {
                highlightedText += `<span class='correct'>${sampleText[i]}</span>`;
                correctTyped++; // Increments correct character count.
                if (soundCorrect && typedText[i] !== " ") soundCorrect.play(); // Plays sound for correct input.
            } else {
                highlightedText += `<span class='wrong'>${sampleText[i]}</span>`;
                wrongWordsCount++; // Increments wrong character count.
                if (soundWrong && typedText[i] !== " ") soundWrong.play(); // Plays sound for wrong input.
            }
        } else {
            highlightedText += `<span>${sampleText[i]}</span>`; // Displays remaining text normally.
        }
    }

    // Detect spacebar press and play sound for word completion.
    if (typedText.length > 0 && typedText[typedText.length - 1] === " ") {
        if (soundDone) soundDone.play(); // Plays sound for word completion.
    }

    sampleTextDisplay.innerHTML = `<p>${highlightedText}</p>`; // Updates text display with highlights.

    // Calculate and update Words Per Minute (WPM).
    const elapsedMinutes = elapsedTime / 60;
    const wpm = elapsedMinutes > 0 ? Math.round(correctTyped / 5 / elapsedMinutes) : 0;
    wpmDisplay.textContent = wpm;

    // Calculate and update accuracy percentage.
    const accuracy = totalTyped > 0 ? Math.round((correctTyped / sampleText.length) * 100) : 100;
    accuracyDisplay.textContent = accuracy;
}

// 6. End the test, save results, and display suggestions.
function endTest() {
    clearInterval(timerInterval); // Stops the timer.
    typingStarted = false; // Marks test as ended.
    if (soundDone) soundDone.play(); // Plays test completion sound.

    const wpm = parseInt(wpmDisplay.textContent); // Retrieves WPM score.
    const accuracy = parseInt(accuracyDisplay.textContent); // Retrieves accuracy score.

    // Save results to the leaderboard.
    saveToLeaderboard(wpm, accuracy);

    // Generate suggestions based on performance.
    const suggestions = [];
    if (wrongWordsCount > 3) {
        suggestions.push("💡 Careful with your spelling! Review the highlighted words.");
    }
    if (wpm < 20) {
        suggestions.push("⏩ You can type faster! Practice regularly to improve your speed.");
    }
    if (accuracy < 85) {
        suggestions.push("✅ Focus on accuracy! Avoid unnecessary errors by typing carefully.");
    }
    if (accuracy >= 85 && wrongWordsCount === 0) {
        suggestions.push("🎉 Great job! You've demonstrated excellent typing skills!");
    }

    // Display results and suggestions in a modal.
    showSuggestionsAndResults(wpm, accuracy, wrongWordsCount, suggestions);

    retakeButton.style.display = "block"; // Shows the retake button.
}

// Rest of the script gets completed orderly!
// 7. Display results and suggestions in a modal popup.
function showSuggestionsAndResults(wpm, accuracy, wrongWords, suggestions) {
    const resultModal = document.getElementById("resultModal");

    // Update modal content dynamically with results.
    document.getElementById("modalWpm").textContent = wpm;
    document.getElementById("modalAccuracy").textContent = accuracy;
    document.getElementById("modalWrongWords").textContent = wrongWords;

    // Add suggestions to the modal in a list format.
    const suggestionList = suggestions.map(suggestion => `<li>${suggestion}</li>`).join("");
    const suggestionContainer = resultModal.querySelector("ul");
    suggestionContainer.innerHTML = suggestionList;

    // Display the modal by changing its CSS to visible.
    resultModal.style.display = "flex";

    // Close modal on button click.
    const closeModalBtn = document.getElementById("closeModalBtn");
    closeModalBtn.addEventListener("click", function () {
        resultModal.style.animation = "fadeOut 0.3s forwards"; // Fade out animation.
        setTimeout(() => {
            resetTest(); // Resets the test once the modal closes.
            resultModal.style.display = "none"; // Hides the modal.
        }, 300); // Matches the animation duration.
    });
}

// 8. Save the test results to the leaderboard.
function saveToLeaderboard(wpm, accuracy) {
    const row = leaderboardTable.insertRow(); // Inserts a new row in the leaderboard table.

    // Create cells for Date, WPM, and Accuracy.
    const dateCell = row.insertCell(0);
    const wpmCell = row.insertCell(1);
    const accuracyCell = row.insertCell(2);

    // Get the current date and time to display in the leaderboard.
    const currentDate = new Date().toLocaleString();

    // Populate the cells with data.
    dateCell.textContent = currentDate;
    wpmCell.textContent = wpm;
    accuracyCell.textContent = `${accuracy}%`;
}

// 9. Reset the typing test to its initial state.
function resetTest() {
    // Stop the timer if it's running
    clearInterval(timerInterval);

    // Reset typing states
    typingStarted = false;
    totalTyped = 0;
    correctTyped = 0;
    wrongWordsCount = 0;
    elapsedTime = 0;

    // Reset displayed elements
    typingArea.value = ""; // Clear the typing area
    typingArea.disabled = true; // Disable the typing area
    sampleTextDisplay.innerHTML = `<p>Please choose a sample text to begin.</p>`; // Reset sample text display
    wpmDisplay.textContent = "0"; // Reset WPM display
    accuracyDisplay.textContent = "0"; // Reset accuracy display
    letterCounterDisplay.textContent = "Typed Letters: 0"; // Reset letter counter
    timerDisplay.textContent = `Time Remaining: ${testDuration}`; // Reset timer display
    progressBar.style.height = "0%"; // Reset progress bar height

    // Hide the retake button
    retakeButton.style.display = "flex";

    // Clear the highlighted text area if previously populated
    sampleTextDisplay.innerHTML = "";
}


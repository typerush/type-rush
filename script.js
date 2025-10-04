document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const elements = {
        // Screens & Overlays
        startScreen: document.getElementById('startScreen'),
        testScreen: document.getElementById('testScreen'),
        profileModal: document.getElementById('profileModal'),
        resultModal: document.getElementById('resultModal'),
        countdownOverlay: document.getElementById('countdownOverlay'),
        countdownNumber: document.getElementById('countdownNumber'),

        // Buttons
        startButton: document.getElementById('startButton'),
        profileButton: document.getElementById('profileButton'),
        themeToggle: document.getElementById('themeToggle'),
        saveProfileButton: document.getElementById('saveProfileButton'),
        closeProfileButton: document.getElementById('closeProfileButton'),
        retakeButton: document.getElementById('retakeButton'),
        closeModalButton: document.getElementById('closeModalButton'),
        clearHistoryButton: document.getElementById('clearHistoryButton'),
        cancelButton: document.getElementById('cancelButton'),

        // Config Selectors
        languageSelector: document.getElementById('languageSelector'),
        timeSelector: document.getElementById('timeSelector'),
        fontSelector: document.getElementById('fontSelector'),
        soundToggle: document.getElementById('soundToggle'),

        // Test Area
        sampleTextDisplay: document.getElementById('sampleTextDisplay'),
        typingArea: document.getElementById('typingArea'),
        timerDisplay: document.getElementById('timer'),
        progressBar: document.getElementById('progressBar'),

        // Stats
        wpmDisplay: document.getElementById('wpm'),
        accuracyDisplay: document.getElementById('accuracy'),
        streakDisplay: document.getElementById('streak'),

        // Modals Content
        usernameInput: document.getElementById('usernameInput'),
        profileBestWpm: document.getElementById('profileBestWpm'),
        profileAvgWpm: document.getElementById('profileAvgWpm'),
        profileTestsTaken: document.getElementById('profileTestsTaken'),
        profileAvgAccuracy: document.getElementById('profileAvgAccuracy'),
        statsChart: document.getElementById('statsChart'),
        modalWpm: document.getElementById('modalWpm'),
        modalAccuracy: document.getElementById('modalAccuracy'),
        modalRawWpm: document.getElementById('modalRawWpm'),
        suggestionsList: document.getElementById('suggestionsList'),
        leaderboardTableBody: document.querySelector('#leaderboardTable tbody'),
        leaderboardSection: document.querySelector('.leaderboard-section'),
        noHistoryMessage: document.getElementById('noHistoryMessage'),
        
        // Notification
        notificationContainer: document.getElementById('notificationContainer'),
        
        // Sound Effects - Only keeping keystroke and wordDone
        keystrokeSound: document.getElementById('keystrokeSound'),
        wordDoneSound: document.getElementById('wordDoneSound'),
    };

    // --- SAMPLE TEXTS & DATA ---
    const sampleTexts = {
        english: {
            1: "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the alphabet at least once.",
            2: "Technology is best when it brings people together. We live in a society exquisitely dependent on science and technology.",
            3: "A good habit can change your life. Make today the day you start building better habits for a better tomorrow.",
            4: "Creativity is intelligence having fun. It allows a person to discover things and ideas that were not part of their previous knowledge.",
            5: "Peter Piper picked a peck of pickled peppers. How many pickled peppers did Peter Piper pick?",
        },
        bangla: {
            1: "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস আমার প্রাণে বাসা করিয়া থাকিব।",
            2: "শিক্ষা মানুষের সর্বশ্রেষ্ঠ সম্পদ। শিক্ষা ছাড়া মানুষ অন্ধকারে থাকে। তাই সবার উচিত শিক্ষা অর্জন করা।",
            3: "সময় অত্যন্ত মূল্যবান। একবার চলে যাওয়া সময় আর ফিরে আসে না। তাই সময়কে সঠিকভাবে ব্যবহার করা উচিত।",
            4: "সততা সেরা পন্থা। সৎ ব্যক্তি সবার কাছে সম্মানিত হয়। জীবনে সত্য বলা এবং সৎ থাকা উচিত।",
            5: "বন্ধু জীবনের এক অবিচ্ছেদ্য অংশ। ভালো বন্ধু জীবনের দুঃসময়ে পাশে থাকে। সবার উচিত ভালো বন্ধু বেছে নেওয়া।",
        },
        arabic: {
            1: "التعليم هو السلاح الأقوى الذي يمكنك استخدامه لتغيير العالم. المعرفة قوة، والتعليم هو مفتاح المستقبل.",
            2: "الوقت مثل النهر، لا يمكنك لمس نفس الماء مرتين. استغل كل لحظة في حياتك بحكمة.",
            3: "الصديق الحقيقي هو من يرى ألمك في عينيك بينما يرى الجميع ابتسامتك على وجهك.",
            4: "النجاح ليس نهائياً، والفشل ليس قاتلاً: ما يهم هو الشجاعة للمتابعة.",
            5: "الكتب هي أصدقاء صامتة ومخلصة. إنها تقدم لنا الحكمة والمعرفة دون أي توقع.",
        },
        hindi: {
            1: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं। ज्ञान शक्ति है, और शिक्षा भविष्य की कुंजी है।",
            2: "समय एक नदी की तरह है, आप एक ही पानी को दो बार नहीं छू सकते। अपने जीवन के हर पल का बुद्धिमानी से उपयोग करें।",
            3: "एक सच्चा दोस्त वह है जो आपके दर्द को आपकी आँखों में देखता है, जबकि दूसरे सभी लोग आपके चेहरे पर आपकी मुस्कान देखते हैं।",
            4: "सफलता अंतिम नहीं है, और असफलता घातक नहीं है: जो मायने रखता है वह आगे बढ़ने की हिम्मत है।",
            5: "किताबें मौन और वफादार दोस्त हैं। वे बिना किसी उम्मीद के हमें ज्ञान और बुद्धिमत्ता प्रदान करती हैं।",
        }
    };

    // --- STATE VARIABLES ---
    let state = {
        currentLanguage: 'english',
        testDuration: 30,
        sampleText: '',
        startTime: null,
        timerInterval: null,
        typingStarted: false,
        totalTypedChars: 0,
        correctChars: 0,
        currentStreak: 0,
        soundEnabled: true,
        lastWordCompleted: 0,
        audioContext: null,
        audioInitialized: false,
    };

    // --- INITIALIZATION ---
    function init() {
        loadTheme();
        loadProfile();
        loadLeaderboard();
        attachEventListeners();
        loadSoundSettings();
        initAudioContext();
    }

    // --- AUDIO CONTEXT INITIALIZATION ---
    function initAudioContext() {
        // Initialize audio context on first user interaction
        const initAudio = () => {
            if (!state.audioInitialized) {
                try {
                    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    state.audioInitialized = true;
                    console.log('Audio context initialized');
                } catch (error) {
                    console.error('Error initializing audio context:', error);
                }
            }
        };

        // Add event listeners for user interaction
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
    }

    // --- EVENT LISTENERS ---
    function attachEventListeners() {
        elements.startButton.addEventListener('click', startTestSequence);
        elements.profileButton.addEventListener('click', () => showModal(elements.profileModal));
        elements.themeToggle.addEventListener('click', toggleTheme);
        elements.saveProfileButton.addEventListener('click', saveProfile);
        elements.closeProfileButton.addEventListener('click', () => hideModal(elements.profileModal));
        elements.retakeButton.addEventListener('click', resetToStartScreen);
        elements.closeModalButton.addEventListener('click', resetToStartScreen);
        elements.clearHistoryButton.addEventListener('click', clearLeaderboardHistory);
        elements.cancelButton.addEventListener('click', cancelTest);
        elements.typingArea.addEventListener('input', handleTyping);
        elements.fontSelector.addEventListener('change', (e) => changeFont(e.target.value));
        elements.soundToggle.addEventListener('change', (e) => {
            state.soundEnabled = e.target.checked;
            localStorage.setItem('typeRushSoundEnabled', state.soundEnabled);
        });
    }

    // --- PROFILE & THEME FUNCTIONS ---
    function loadProfile() {
        const profile = JSON.parse(localStorage.getItem('typeRushProfile')) || { username: '' };
        elements.usernameInput.value = profile.username;
        updateProfileDisplay();
    }
    function saveProfile() {
        const username = elements.usernameInput.value.trim();
        if (username) {
            localStorage.setItem('typeRushProfile', JSON.stringify({ username }));
            showNotification('Profile Saved!', 'success');
            hideModal(elements.profileModal);
        } else {
            showNotification('Username cannot be empty!', 'error');
        }
    }
    function updateProfileDisplay() {
        const profile = JSON.parse(localStorage.getItem('typeRushProfile')) || { username: 'Guest' };
        const leaderboard = JSON.parse(localStorage.getItem('typeRushLeaderboard')) || [];
        const userResults = leaderboard.filter(r => r.username === profile.username);

        if (userResults.length > 0) {
            const bestWpm = Math.max(...userResults.map(r => r.wpm));
            const avgWpm = Math.round(userResults.reduce((sum, r) => sum + r.wpm, 0) / userResults.length);
            const avgAccuracy = Math.round(userResults.reduce((sum, r) => sum + r.accuracy, 0) / userResults.length);
            
            elements.profileBestWpm.textContent = bestWpm;
            elements.profileAvgWpm.textContent = avgWpm;
            elements.profileTestsTaken.textContent = userResults.length;
            elements.profileAvgAccuracy.textContent = `${avgAccuracy}%`;
            drawStatsChart(userResults.slice(-5).map(r => r.wpm));
        } else {
            elements.profileBestWpm.textContent = '0';
            elements.profileAvgWpm.textContent = '0';
            elements.profileTestsTaken.textContent = '0';
            elements.profileAvgAccuracy.textContent = '0%';
            clearCanvas();
        }
    }
    function loadTheme() {
        const theme = localStorage.getItem('typeRushTheme') || 'cyberpunk';
        document.body.className = theme === 'light' ? 'theme-light' : theme === 'dark' ? 'theme-dark' : '';
    }
    function toggleTheme() {
        const currentTheme = document.body.className;
        let newTheme;
        if (currentTheme.includes('light')) newTheme = 'dark';
        else if (currentTheme.includes('dark')) newTheme = 'cyberpunk';
        else newTheme = 'light';
        
        document.body.className = newTheme === 'light' ? 'theme-light' : newTheme === 'dark' ? 'theme-dark' : '';
        localStorage.setItem('typeRushTheme', newTheme);
    }
    function changeFont(fontChoice) {
        const sampleText = elements.sampleTextDisplay;
        const typingArea = elements.typingArea;
        
        // Remove any language-specific classes
        document.body.classList.remove('lang-arabic');
        
        switch(fontChoice) {
            case 'monospace':
                sampleText.style.fontFamily = typingArea.style.fontFamily = 'var(--font-mono)';
                break;
            case 'bangla':
                sampleText.style.fontFamily = typingArea.style.fontFamily = 'var(--font-bangla)';
                break;
            case 'arabic':
                sampleText.style.fontFamily = typingArea.style.fontFamily = 'var(--font-arabic)';
                document.body.classList.add('lang-arabic');
                showNotification('Arabic font selected. Text will appear right-to-left.', 'info');
                break;
            case 'hindi':
                sampleText.style.fontFamily = typingArea.style.fontFamily = 'var(--font-hindi)';
                break;
            case 'bijoy':
                sampleText.style.fontFamily = typingArea.style.fontFamily = 'var(--font-bijoy)';
                showNotification('Font changed. For best results, use a Unicode keyboard (Avro/Default Bangla).', 'info');
                break;
            default:
                sampleText.style.fontFamily = typingArea.style.fontFamily = 'var(--font-mono)';
        }
    }
    function loadSoundSettings() {
        const soundEnabled = localStorage.getItem('typeRushSoundEnabled');
        if (soundEnabled !== null) {
            state.soundEnabled = soundEnabled === 'true';
            elements.soundToggle.checked = state.soundEnabled;
        }
    }

    // --- TEST FLOW FUNCTIONS ---
    function startTestSequence() {
        state.currentLanguage = elements.languageSelector.value;
        state.testDuration = parseInt(elements.timeSelector.value);
        const texts = sampleTexts[state.currentLanguage];
        const randomKey = Math.floor(Math.random() * Object.keys(texts).length) + 1;
        state.sampleText = texts[randomKey];
        
        // Apply language-specific settings
        applyLanguageSettings(state.currentLanguage);
        
        showCountdown();
    }
    
    function applyLanguageSettings(language) {
        // Remove any language-specific classes
        document.body.classList.remove('lang-arabic');
        
        // Apply language-specific settings
        switch(language) {
            case 'arabic':
                document.body.classList.add('lang-arabic');
                elements.sampleTextDisplay.style.direction = 'rtl';
                elements.typingArea.style.direction = 'rtl';
                elements.sampleTextDisplay.style.textAlign = 'right';
                elements.typingArea.style.textAlign = 'right';
                break;
            default:
                elements.sampleTextDisplay.style.direction = 'ltr';
                elements.typingArea.style.direction = 'ltr';
                elements.sampleTextDisplay.style.textAlign = 'left';
                elements.typingArea.style.textAlign = 'left';
        }
    }
    
    function showCountdown() {
        hideScreen(elements.startScreen);
        elements.countdownOverlay.style.display = 'flex';
        let count = 3;
        elements.countdownNumber.textContent = count;
        const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
                elements.countdownNumber.textContent = count;
                elements.countdownNumber.style.animation = 'none';
                setTimeout(() => elements.countdownNumber.style.animation = 'countdownPulse 1s ease-in-out', 10);
            } else {
                elements.countdownNumber.textContent = 'GO!';
                setTimeout(() => {
                    elements.countdownOverlay.style.display = 'none';
                    startTest();
                }, 500);
                clearInterval(countInterval);
            }
        }, 1000);
    }
    function startTest() {
        showScreen(elements.testScreen);
        resetTestState();
        elements.typingArea.disabled = false;
        elements.typingArea.focus();
        displaySampleText();
        
        state.startTime = Date.now();
        state.typingStarted = true;
        state.timerInterval = setInterval(updateTimer, 100);
        setTimeout(endTest, state.testDuration * 1000);
    }
    function cancelTest() {
        if (state.typingStarted) {
            clearInterval(state.timerInterval);
            state.typingStarted = false;
            elements.typingArea.disabled = true;
            
            if (confirm('Are you sure you want to cancel the test? Your progress will be lost.')) {
                resetToStartScreen();
                showNotification('Test cancelled', 'info');
            } else {
                // Resume the test if user doesn't confirm
                elements.typingArea.disabled = false;
                elements.typingArea.focus();
                state.typingStarted = true;
                state.timerInterval = setInterval(updateTimer, 100);
            }
        }
    }
    function endTest() {
        clearInterval(state.timerInterval);
        state.typingStarted = false;
        elements.typingArea.disabled = true;

        const timeElapsedInMinutes = (Date.now() - state.startTime) / 60000;
        const wpm = Math.round(state.correctChars / 5 / timeElapsedInMinutes) || 0;
        const rawWpm = Math.round(state.totalTypedChars / 5 / timeElapsedInMinutes) || 0;
        const accuracy = state.totalTypedChars > 0 ? Math.round((state.correctChars / state.totalTypedChars) * 100) : 0;

        // Play completion sound
        playSound('wordDone');

        saveResultToLeaderboard(wpm, accuracy);
        showResultsModal(wpm, rawWpm, accuracy);
    }
    function resetToStartScreen() {
        hideModal(elements.resultModal);
        hideScreen(elements.testScreen);
        showScreen(elements.startScreen);
        resetTestState();
    }
    function resetTestState() {
        clearInterval(state.timerInterval);
        state.typingStarted = false;
        state.totalTypedChars = 0;
        state.correctChars = 0;
        state.currentStreak = 0;
        state.lastWordCompleted = 0;
        elements.typingArea.value = '';
        elements.timerDisplay.textContent = state.testDuration;
        elements.progressBar.style.width = '0%';
        elements.wpmDisplay.textContent = '0';
        elements.accuracyDisplay.textContent = '100';
        elements.streakDisplay.textContent = '0';
        elements.sampleTextDisplay.innerHTML = '';
    }

    // --- LOGIC FUNCTIONS ---
    function handleTyping() {
        if (!state.typingStarted) return;
        const typedText = elements.typingArea.value;
        state.totalTypedChars = typedText.length;
        state.correctChars = 0;
        state.currentStreak = 0;
        let highlightedHTML = '';
        
        for (let i = 0; i < state.sampleText.length; i++) {
            const typedChar = typedText[i];
            const sampleChar = state.sampleText[i];
            
            if (i < typedText.length) {
                if (typedChar === sampleChar) {
                    highlightedHTML += `<span class="correct-char">${sampleChar}</span>`;
                    state.correctChars++;
                    state.currentStreak++;
                    
                    // Play keystroke sound for correct character
                    playSound('keystroke');
                } else {
                    highlightedHTML += `<span class="incorrect-char">${sampleChar}</span>`;
                    state.currentStreak = 0;
                    // No wrong sound played
                }
            } else {
                highlightedHTML += `<span class="current-char">${sampleChar}</span>`;
            }
            
            // Check if a word was completed
            if (i > 0 && sampleChar === ' ' && typedText[i] === ' ' && i > state.lastWordCompleted) {
                state.lastWordCompleted = i;
                playSound('wordDone');
            }
        }
        
        elements.sampleTextDisplay.innerHTML = highlightedHTML;
        updateStats();
    }
    function updateStats() {
        const timeElapsedInMinutes = (Date.now() - state.startTime) / 60000;
        const wpm = timeElapsedInMinutes > 0 ? Math.round(state.correctChars / 5 / timeElapsedInMinutes) : 0;
        const accuracy = state.totalTypedChars > 0 ? Math.round((state.correctChars / state.totalTypedChars) * 100) : 100;
        elements.wpmDisplay.textContent = wpm;
        elements.accuracyDisplay.textContent = accuracy;
        elements.streakDisplay.textContent = state.currentStreak;
    }
    function updateTimer() {
        const timeElapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const timeLeft = Math.max(0, state.testDuration - timeElapsed);
        elements.timerDisplay.textContent = timeLeft;
        const progress = ((state.testDuration - timeLeft) / state.testDuration) * 100;
        elements.progressBar.style.width = `${progress}%`;
    }
    function displaySampleText() {
        elements.sampleTextDisplay.innerHTML = `<span class="current-char">${state.sampleText[0]}</span>${state.sampleText.substring(1)}`;
    }

    // --- SOUND FUNCTIONS ---
    function playSound(type) {
        if (!state.soundEnabled) return;
        
        // Initialize audio context if not already done
        if (!state.audioInitialized) {
            try {
                state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                state.audioInitialized = true;
            } catch (error) {
                console.error('Error initializing audio context:', error);
                return;
            }
        }
        
        try {
            let sound;
            switch(type) {
                case 'keystroke':
                    sound = elements.keystrokeSound;
                    break;
                case 'wordDone':
                    sound = elements.wordDoneSound;
                    break;
                default:
                    return;
            }
            
            // Check if audio file exists and can be played
            if (sound.src && sound.src !== window.location.href) {
                const playPromise = sound.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Audio started playing successfully
                    }).catch(error => {
                        console.error('Error playing sound:', error);
                        // Fallback to a simple beep
                        playTunedSound(type);
                    });
                }
            } else {
                // Fallback to a simple beep
                playTunedSound(type);
            }
        } catch (error) {
            console.error('Error with sound playback:', error);
            playTunedSound(type);
        }
    }

    // Enhanced sound function for more crisp and tuned audio
    function playTunedSound(type) {
        if (!state.audioContext) return;
        
        try {
            // Create audio nodes
            const oscillator = state.audioContext.createOscillator();
            const gainNode = state.audioContext.createGain();
            const filter = state.audioContext.createBiquadFilter();
            
            // Connect nodes
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(state.audioContext.destination);
            
            // Set up filter for crisp sound
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            filter.Q.value = 5;
            
            // Configure sound based on type
            const now = state.audioContext.currentTime;
            
            switch(type) {
                case 'keystroke':
                    // Create a crisp keystroke sound with harmonics
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(1200, now);
                    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                    
                    // Quick attack and decay for crispness
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    
                    // Short duration
                    oscillator.start(now);
                    oscillator.stop(now + 0.05);
                    break;
                    
                case 'wordDone':
                    // Create a pleasant word completion sound
                    oscillator.type = 'sine';
                    
                    // Create a simple chord for a pleasant sound
                    const fundamental = 523.25; // C5
                    oscillator.frequency.setValueAtTime(fundamental, now);
                    
                    // Add a second oscillator for harmony
                    const oscillator2 = state.audioContext.createOscillator();
                    const gainNode2 = state.audioContext.createGain();
                    oscillator2.connect(gainNode2);
                    gainNode2.connect(state.audioContext.destination);
                    
                    oscillator2.type = 'sine';
                    oscillator2.frequency.setValueAtTime(fundamental * 1.25, now); // E5
                    
                    // Envelope for both oscillators
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    
                    gainNode2.gain.setValueAtTime(0, now);
                    gainNode2.gain.linearRampToValueAtTime(0.15, now + 0.01);
                    gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    
                    // Start and stop both oscillators
                    oscillator.start(now);
                    oscillator.stop(now + 0.3);
                    oscillator2.start(now);
                    oscillator2.stop(now + 0.3);
                    break;
            }
        } catch (error) {
            console.error('Error playing tuned sound:', error);
        }
    }

    // --- MODAL & LEADERBOARD FUNCTIONS ---
    function showResultsModal(wpm, rawWpm, accuracy) {
        elements.modalWpm.textContent = wpm;
        elements.modalRawWpm.textContent = rawWpm;
        elements.modalAccuracy.textContent = `${accuracy}%`;
        const suggestions = [];
        if (accuracy < 90) suggestions.push("Focus on accuracy. Speed comes with precision.");
        if (wpm < 40) suggestions.push("Keep practicing! Regular tests build muscle memory.");
        if (accuracy >= 95 && wpm > 60) suggestions.push("Outstanding! You're a typing master.");
        if (accuracy >= 95 && wpm < 60) suggestions.push("Great accuracy! Now try to push your speed.");
        elements.suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
        showModal(elements.resultModal);
    }
    function saveResultToLeaderboard(wpm, accuracy) {
        const profile = JSON.parse(localStorage.getItem('typeRushProfile')) || { username: 'Guest' };
        const result = {
            username: profile.username,
            wpm,
            accuracy,
            language: state.currentLanguage.charAt(0).toUpperCase() + state.currentLanguage.slice(1),
            date: new Date().toLocaleString()
        };
        let leaderboard = JSON.parse(localStorage.getItem('typeRushLeaderboard')) || [];
        leaderboard.push(result);
        leaderboard.sort((a, b) => b.wpm - a.wpm);
        localStorage.setItem('typeRushLeaderboard', JSON.stringify(leaderboard));
        loadLeaderboard();
        updateProfileDisplay();
    }
    function loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('typeRushLeaderboard')) || [];
        elements.leaderboardTableBody.innerHTML = '';
        
        // Add animation class to the leaderboard section
        elements.leaderboardSection.classList.add('leaderboard-refresh');
        
        if (leaderboard.length === 0) {
            elements.noHistoryMessage.style.display = 'block';
            // Remove animation class after animation completes
            setTimeout(() => {
                elements.leaderboardSection.classList.remove('leaderboard-refresh');
            }, 500);
            return;
        }
        
        elements.noHistoryMessage.style.display = 'none';
        leaderboard.slice(0, 10).forEach((result, index) => {
            const row = elements.leaderboardTableBody.insertRow();
            row.innerHTML = `<td>${index + 1}</td><td>${result.username}</td><td>${result.wpm}</td><td>${result.accuracy}%</td><td>${result.language}</td><td>${result.date}</td>`;
        });
        
        // Remove animation class after animation completes
        setTimeout(() => {
            elements.leaderboardSection.classList.remove('leaderboard-refresh');
        }, 500);
    }
    function clearLeaderboardHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            localStorage.removeItem('typeRushLeaderboard');
            loadLeaderboard();
            updateProfileDisplay();
            showNotification('History cleared!', 'success');
        }
    }
    function drawStatsChart(data) {
        const ctx = elements.statsChart.getContext('2d');
        const width = elements.statsChart.width;
        const height = elements.statsChart.height;
        clearCanvas();
        if (data.length < 2) return;

        const padding = 20;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        const maxWpm = Math.max(...data);

        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--neon-cyan');
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((wpm, index) => {
            const x = padding + (index / (data.length - 1)) * graphWidth;
            const y = height - padding - (wpm / maxWpm) * graphHeight;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--neon-cyan');
        data.forEach((wpm, index) => {
            const x = padding + (index / (data.length - 1)) * graphWidth;
            const y = height - padding - (wpm / maxWpm) * graphHeight;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    function clearCanvas() {
        const ctx = elements.statsChart.getContext('2d');
        ctx.clearRect(0, 0, elements.statsChart.width, elements.statsChart.height);
    }

    // --- NOTIFICATION SYSTEM ---
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon;
        switch(type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            case 'info':
                icon = 'fa-info-circle';
                break;
            default:
                icon = 'fa-bell';
        }
        
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        elements.notificationContainer.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (elements.notificationContainer.contains(notification)) {
                    elements.notificationContainer.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // --- UTILITY FUNCTIONS ---
    function showModal(modal) { modal.style.display = 'flex'; }
    function hideModal(modal) { modal.style.display = 'none'; }
    function showScreen(screen) { screen.classList.add('active'); }
    function hideScreen(screen) { screen.classList.remove('active'); }

    // --- GO! ---
    init();
});

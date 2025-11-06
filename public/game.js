// Game State
const GAME_STATE = {
    INIT: 'init',
    PLAYING: 'playing',
    CHECKING: 'checking',
    GAME_OVER: 'game_over'
};

let state = GAME_STATE.INIT;
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let comboMultiplier = 1;
let comboTimer = null;
let lastMatchTime = 0;
let gameTimer = null;
let timeRemaining = 60;

// Card symbols (neon-themed emojis)
const SYMBOLS = ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎵'];

// Audio elements
const sounds = {
    flip: document.getElementById('audio-flip'),
    match: document.getElementById('audio-match'),
    win: document.getElementById('audio-win'),
    lose: document.getElementById('audio-lose')
};

// Web Audio API for procedural sounds
let audioContext;
let isSoundEnabled = true;

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Procedural sound effects
function playProceduralSound(type) {
    if (!isSoundEnabled) return;
    
    try {
        initAudio();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const now = audioContext.currentTime;
        
        switch(type) {
            case 'flip':
                // Quick click sound
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
                
            case 'match':
                // Success chime
                oscillator.frequency.setValueAtTime(523.25, now); // C5
                oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
                gainNode.gain.setValueAtTime(0.4, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;
                
            case 'combo':
                // Combo sound - higher pitch based on multiplier
                const pitch = 400 + (comboMultiplier * 100);
                oscillator.frequency.setValueAtTime(pitch, now);
                oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.15);
                gainNode.gain.setValueAtTime(0.5, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;
                
            case 'win':
                // Victory fanfare
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, now);
                oscillator.frequency.setValueAtTime(659.25, now + 0.15);
                oscillator.frequency.setValueAtTime(783.99, now + 0.3);
                oscillator.frequency.setValueAtTime(1046.50, now + 0.45); // C6
                gainNode.gain.setValueAtTime(0.5, now);
                gainNode.gain.setValueAtTime(0.5, now + 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
                oscillator.start(now);
                oscillator.stop(now + 0.8);
                break;
                
            case 'lose':
                // Sad trombone
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(300, now);
                oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                gainNode.gain.setValueAtTime(0.4, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                oscillator.start(now);
                oscillator.stop(now + 0.5);
                break;
        }
    } catch(e) {
        console.log('Audio playback failed:', e);
    }
}

// DOM Elements
const gridElement = document.getElementById('grid');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const comboElement = document.getElementById('combo');
const overlayElement = document.getElementById('overlay');
const resultTitleElement = document.getElementById('result-title');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Initialize game
function initGame() {
    state = GAME_STATE.INIT;
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    comboMultiplier = 1;
    timeRemaining = 60;
    
    // Reset timer color
    timerElement.style.color = '#00ffff';
    timerElement.classList.remove('urgent');
    timerElement.style.animation = 'pulse 1s infinite';
    
    updateUI();
    createGrid();
    overlayElement.classList.add('hidden');
    
    // Start timer
    startTimer();
    state = GAME_STATE.PLAYING;
}

// Fisher-Yates shuffle
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create card grid
function createGrid() {
    gridElement.innerHTML = '';
    const cardPairs = [...SYMBOLS, ...SYMBOLS];
    const shuffledCards = shuffle(cardPairs);
    
    shuffledCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${symbol}</div>
        `;
        
        card.addEventListener('click', () => handleCardClick(card));
        gridElement.appendChild(card);
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
                card.classList.add('hover-glow');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover-glow');
        });
    });
}

// Handle card click
function handleCardClick(card) {
    if (state !== GAME_STATE.PLAYING) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    
    // Ripple effect on click
    const rect = card.getBoundingClientRect();
    createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // Particle trail
    createParticleTrail(card);
    
    // Flip card with slot machine animation
    card.classList.add('flipping');
    setTimeout(() => {
        card.classList.remove('flipping');
        card.classList.add('flipped');
    }, 600);
    
    playSound('flip');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        state = GAME_STATE.CHECKING;
        setTimeout(checkMatch, 800);
    }
}

// Check if cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // MATCH!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        // Combo system
        const now = Date.now();
        if (now - lastMatchTime < 3000) {
            comboMultiplier = Math.min(comboMultiplier + 1, 8);
            comboElement.classList.add('active');
            setTimeout(() => comboElement.classList.remove('active'), 300);
            
            // Show combo burst for 2x and above
            showComboBurst(comboMultiplier);
            
            // Flash background on high combos
            if (comboMultiplier >= 3) {
                document.body.classList.add('combo-active');
                setTimeout(() => document.body.classList.remove('combo-active'), 500);
            }
        } else {
            comboMultiplier = 1;
        }
        lastMatchTime = now;
        
        // Score calculation
        const points = 100 * comboMultiplier;
        score += points;
        
        // Score pop animation
        scoreElement.classList.add('score-pop');
        setTimeout(() => scoreElement.classList.remove('score-pop'), 300);
        
        // Screen shake intensity based on combo
        if (comboMultiplier > 1) {
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 300);
        }
        
        // Confetti effect on match (more for higher combos)
        createConfetti(card1);
        createConfetti(card2);
        
        // Play combo sound if multiplier active
        if (comboMultiplier > 1) {
            setTimeout(() => playProceduralSound('combo'), 100);
        }
        
        playSound('match');
        updateUI();
        
        // Reset combo after 3 seconds
        clearTimeout(comboTimer);
        comboTimer = setTimeout(() => {
            comboMultiplier = 1;
            updateUI();
        }, 3000);
        
        // Check win condition
        if (matchedPairs === 8) {
            setTimeout(gameOver, 500);
        }
    } else {
        // NO MATCH
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 800);
        
        // Reset combo
        comboMultiplier = 1;
        updateUI();
    }
    
    flippedCards = [];
    state = GAME_STATE.PLAYING;
}

// Create confetti effect
function createConfetti(card) {
    const rect = card.getBoundingClientRect();
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff00'];
    
    // More confetti for higher combos
    const count = 10 + (comboMultiplier * 5);
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${rect.left + rect.width / 2}px`;
        confetti.style.top = `${rect.top + rect.height / 2}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.3}s`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = confetti.style.width;
        
        // Random horizontal spread
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        confetti.style.setProperty('--spread-x', `${Math.cos(angle) * distance}px`);
        confetti.style.setProperty('--spread-y', `${Math.sin(angle) * distance}px`);
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Create ripple effect
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
}

// Create particle trail
function createParticleTrail(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#ff00ff', '#00ffff', '#ffff00'];
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 30}px`;
            particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 30}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 50);
    }
}

// Show combo burst text
function showComboBurst(multiplier) {
    if (multiplier <= 1) return;
    
    const burst = document.createElement('div');
    burst.className = 'combo-burst';
    burst.textContent = `×${multiplier} COMBO!`;
    
    document.body.appendChild(burst);
    
    setTimeout(() => burst.remove(), 1000);
}

// Timer
function startTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        timeRemaining--;
        updateUI();
        
        if (timeRemaining <= 0) {
            gameOver();
        }
        
        // Urgent visual feedback at 10 seconds
        if (timeRemaining <= 10) {
            timerElement.style.color = '#ff0000';
            timerElement.classList.add('urgent');
            
            // Heartbeat sound on each second
            if (timeRemaining <= 5) {
                playProceduralSound('flip');
            }
        }
    }, 1000);
}

// Update UI
function updateUI() {
    timerElement.textContent = timeRemaining;
    scoreElement.textContent = score;
    comboElement.textContent = `×${comboMultiplier}`;
}

// Game Over
function gameOver() {
    clearInterval(gameTimer);
    state = GAME_STATE.GAME_OVER;
    
    const isWin = matchedPairs === 8;
    
    resultTitleElement.textContent = isWin ? '🎰 JACKPOT! 🎰' : '⏰ TIME\'S UP! ⏰';
    finalScoreElement.textContent = score;
    
    // Victory celebration
    if (isWin) {
        // Massive confetti explosion
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = -50;
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${x}px`;
                confetti.style.top = `${y}px`;
                confetti.style.background = ['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff00'][Math.floor(Math.random() * 5)];
                confetti.style.width = `${Math.random() * 15 + 5}px`;
                confetti.style.height = confetti.style.width;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 2000);
            }, i * 20);
        }
    }
    
    // Show overlay after effects
    setTimeout(() => {
        overlayElement.classList.remove('hidden');
    }, isWin ? 500 : 0);
    
    playSound(isWin ? 'win' : 'lose');
    
    // TODO: YouTube Playables SDK Integration
    // Uncomment when SDK is available:
    // if (window.YouTubePlayables) {
    //     window.YouTubePlayables.submitScore(score);
    // }
}

// Play sound
function playSound(soundName) {
    // Try procedural sound first
    playProceduralSound(soundName);
    
    // Also try to play MP3 if available
    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => {
            // Silently fail if MP3 not available
        });
    }
}

// Restart button
restartBtn.addEventListener('click', initGame);

// Start game on load
window.addEventListener('load', () => {
    // Initialize audio on first user interaction
    document.body.addEventListener('click', initAudio, { once: true });
    
    // Small delay to ensure DOM is ready
    setTimeout(initGame, 100);
});

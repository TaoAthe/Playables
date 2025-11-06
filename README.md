# Memory Match - Neon Edition 🎰

A dopamine-inducing, Vegas-style memory card game designed for YouTube Playables.

## 🎮 Game Features

### Core Mechanics
- **4×4 Grid**: 8 pairs (16 cards total) with neon-themed emojis
- **60-Second Timer**: Beat the clock to match all pairs
- **Combo Multiplier System**: Match pairs quickly for ×2, ×4, ×8 score multipliers
- **Slot Machine Card Flips**: 3D spinning animations on every flip

### Visual Effects
- 🌈 Neon gradients with pulsing glow effects
- ⚡ Screen shake that intensifies with combo streaks
- 🎊 Confetti burst on every match
- 💫 Las Vegas jackpot aesthetic

### Scoring
- Base: **100 points** per match
- Combo bonus: Match within 3 seconds for multiplier
- Maximum combo: **×8** (800 points per match!)

## 🚀 Quick Start

### Option 1: Direct Browser Preview
1. Open `public/index.html` in your browser
2. Start playing immediately!

### Option 2: Local Server (Recommended)
```bash
# Using Python
cd public
python -m http.server 8000

# Using Node.js
npx http-server public -p 8000
```

Then open: `http://localhost:8000`

## 📂 Project Structure

```
youtube-playable-game/
├── public/
│   ├── index.html      # Main game file
│   ├── styles.css      # Neon styling
│   └── game.js         # Game logic
├── assets/
│   └── audio/          # Sound effects (flip, match, win, lose)
├── src/                # TypeScript source (optional)
├── package.json
├── tsconfig.json
├── Specs.txt
└── README.md
```

## 🎵 Audio Setup

Place audio files in `assets/audio/`:
- `flip.mp3` - Card flip sound
- `match.mp3` - Successful match sound
- `win.mp3` - Victory sound
- `lose.mp3` - Game over sound

### Where to Get Sounds
- [Freesound.org](https://freesound.org) - Free sound effects
- [Zapsplat](https://www.zapsplat.com) - Game audio library
- Use short, punchy sounds (<1 second) for best performance

## 🎯 Game States

1. **INIT** - Loading and setup
2. **PLAYING** - Active gameplay
3. **CHECKING** - Validating card match
4. **GAME_OVER** - Final score display

## 🔧 Technical Details

- **Pure Vanilla JS** - No frameworks, ultra-lightweight
- **CSS3 Animations** - Hardware-accelerated transforms
- **Mobile Responsive** - Works on all screen sizes
- **YouTube Playables Ready** - SDK integration prepared

## 🎨 Customization

### Change Card Symbols
Edit `SYMBOLS` array in `game.js`:
```javascript
const SYMBOLS = ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎵'];
```

### Adjust Timer
Change initial time in `game.js`:
```javascript
let timeRemaining = 60; // Change to desired seconds
```

### Modify Combo Window
Adjust combo timing in `checkMatch()`:
```javascript
if (now - lastMatchTime < 3000) { // Change 3000ms to your preference
```

## 📱 YouTube Playables Integration

The game includes stub code for YouTube Playables SDK:

```javascript
// Uncomment when SDK is available:
// if (window.YouTubePlayables) {
//     window.YouTubePlayables.submitScore(score);
// }
```

## 🎮 Gameplay Tips

- **Speed is key**: Match cards within 3 seconds to build combos
- **Memory first**: Focus on remembering positions before chasing combos
- **Watch the timer**: Red timer = under 10 seconds remaining
- **Combo decay**: 3 seconds without a match resets your multiplier

## 🚧 Roadmap (Iteration Phase 2)

- [ ] Power-ups (X-Ray Vision, Shuffle Bomb, Lightning Round)
- [ ] Rhythm-based beat sync
- [ ] Card evolution animations
- [ ] Particle trail effects
- [ ] Achievement system

## 📄 Build & Deploy

### For YouTube Playables
The game runs standalone - just upload the `public` folder contents.

### Build with Webpack (Optional)
```bash
npm install
npm run build
```

---

**🎰 Made with ❤️ for maximum dopamine hits**

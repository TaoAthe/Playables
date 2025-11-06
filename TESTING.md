# 🎮 Quick Test Guide

## Test the Game Now!

### Method 1: Direct File Open (Easiest)
1. Navigate to `public/index.html`
2. Double-click to open in your browser
3. Start playing!

**Note:** Audio may not work without a web server due to browser security.

### Method 2: Local Web Server (Recommended)

#### Option A - Python (if installed)
```bash
cd public
python -m http.server 8000
```

#### Option B - Node.js (if installed)
```bash
npx http-server public -p 8000
```

#### Option C - VS Code Live Server
1. Install "Live Server" extension
2. Right-click `public/index.html`
3. Select "Open with Live Server"

Then open: **http://localhost:8000**

## What to Test

### Core Mechanics
- [ ] Cards flip with slot machine animation
- [ ] Matching pairs stay flipped and glow green
- [ ] Non-matching pairs flip back after delay
- [ ] Timer counts down from 60 seconds
- [ ] Score increases on match

### Combo System
- [ ] Match 2 pairs quickly (< 3 seconds apart)
- [ ] Combo multiplier increases (×2, ×4, ×8)
- [ ] Score multiplies with combo
- [ ] Combo resets after 3 seconds of no matches

### Visual Effects
- [ ] Screen shakes on combo matches
- [ ] Confetti particles on every match
- [ ] Timer turns red at 10 seconds
- [ ] Neon glow effects on hover

### Game Over
- [ ] Game ends when all 8 pairs matched (WIN)
- [ ] Game ends when timer reaches 0 (LOSE)
- [ ] Final score displays correctly
- [ ] "PLAY AGAIN" button restarts game

## Known Issues (Expected)
- Audio won't play without actual MP3 files
- May need web server for full functionality
- First flip animation may lag slightly (browser warming up)

## Performance Check
- Game should load instantly
- No lag during card flips
- Smooth animations at 60fps
- Works on mobile devices

---

**Ready to play? Open `public/index.html` and enjoy! 🎰**

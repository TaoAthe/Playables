// src/index.ts
import { GameEngine } from './game/engine';
import { GameState } from './game/state';
import { Menu } from './ui/menu';
import { HUD } from './ui/hud';
import { AudioManager } from './audio/manager';
import { Loader } from './utils/loader';

const gameEngine = new GameEngine();
const gameState = new GameState();
const menu = new Menu();
const hud = new HUD();
const audioManager = new AudioManager();

function main() {
    // Initialize the game
    audioManager.loadAudio();
    Loader.loadAssets().then(() => {
        menu.show();
        gameEngine.start(gameState, hud);
    });
}

// Start the main game loop
main();
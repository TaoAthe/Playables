class GameEngine {
    private lastTime: number;
    private gameLoopId: number | null;

    constructor() {
        this.lastTime = 0;
        this.gameLoopId = null;
    }

    public start(): void {
        this.lastTime = performance.now();
        this.gameLoop();
    }

    private gameLoop(): void {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        this.update(deltaTime);
        this.render();

        this.lastTime = currentTime;
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    private update(deltaTime: number): void {
        // Update game state logic here
    }

    private render(): void {
        // Render game graphics here
    }

    public stop(): void {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }
}

export default GameEngine;
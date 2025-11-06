export class HUD {
    private health: number;
    private score: number;

    constructor(initialHealth: number, initialScore: number) {
        this.health = initialHealth;
        this.score = initialScore;
    }

    public updateHealth(newHealth: number): void {
        this.health = newHealth;
    }

    public updateScore(newScore: number): void {
        this.score = newScore;
    }

    public render(): void {
        // Code to render the HUD on the screen
        console.log(`Health: ${this.health}, Score: ${this.score}`);
    }
}
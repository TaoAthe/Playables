export class GameState {
    private score: number;
    private level: number;

    constructor() {
        this.score = 0;
        this.level = 1;
    }

    public getScore(): number {
        return this.score;
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public getLevel(): number {
        return this.level;
    }

    public setLevel(level: number): void {
        this.level = level;
    }

    public reset(): void {
        this.score = 0;
        this.level = 1;
    }
}
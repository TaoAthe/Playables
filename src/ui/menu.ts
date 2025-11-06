export class Menu {
    private options: string[];
    private selectedOption: number;

    constructor(options: string[]) {
        this.options = options;
        this.selectedOption = 0;
    }

    public displayMenu(): void {
        console.clear();
        console.log("Main Menu");
        this.options.forEach((option, index) => {
            const prefix = index === this.selectedOption ? "> " : "  ";
            console.log(`${prefix}${option}`);
        });
    }

    public navigateUp(): void {
        this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
    }

    public navigateDown(): void {
        this.selectedOption = (this.selectedOption + 1) % this.options.length;
    }

    public selectOption(): string {
        return this.options[this.selectedOption];
    }
}
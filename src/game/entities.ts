export class Player {
    constructor(name) {
        this.name = name;
        this.health = 100;
        this.score = 0;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    addScore(points) {
        this.score += points;
    }
}

export class Enemy {
    constructor(type) {
        this.type = type;
        this.health = 50;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }
}
export class AudioManager {
    private audioFiles: { [key: string]: HTMLAudioElement } = {};

    constructor() {}

    loadAudio(file: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const audio = new Audio(file);
            audio.onloadeddata = () => {
                this.audioFiles[file] = audio;
                resolve();
            };
            audio.onerror = () => {
                reject(new Error(`Failed to load audio file: ${file}`));
            };
        });
    }

    playAudio(file: string): void {
        const audio = this.audioFiles[file];
        if (audio) {
            audio.currentTime = 0; // Restart audio if already playing
            audio.play().catch(error => {
                console.error(`Error playing audio: ${error}`);
            });
        } else {
            console.warn(`Audio file not loaded: ${file}`);
        }
    }

    stopAudio(file: string): void {
        const audio = this.audioFiles[file];
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset audio to start
        }
    }
}
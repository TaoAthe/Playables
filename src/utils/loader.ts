import { loadImage } from './helpers';

export async function loadAssets(assetList) {
    const loadedAssets = {};

    for (const asset of assetList) {
        if (asset.type === 'image') {
            loadedAssets[asset.name] = await loadImage(asset.path);
        } else if (asset.type === 'audio') {
            loadedAssets[asset.name] = await loadAudio(asset.path);
        }
    }

    return loadedAssets;
}

async function loadAudio(path) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(path);
        audio.onloadeddata = () => resolve(audio);
        audio.onerror = () => reject(new Error(`Failed to load audio: ${path}`));
        audio.load();
    });
}
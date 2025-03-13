import { getArtworkLinks } from './image-handlers.js';

export function initializeMediaSession(elements, state) {
    elements.audioElement.addEventListener('play', () => {
        navigator.mediaSession.playbackState = 'playing';
        updateMetadata(elements, state);
    });
    
    elements.audioElement.addEventListener('pause', () => {
        navigator.mediaSession.playbackState = 'paused';
    });
    
    elements.createButton.addEventListener('click', () => {
        elements.audioElement.volume = 0.01;
        elements.audioElement.play()
            .then(() => {
                updateMetadata(elements, state);
                
                elements.audioElement.volume = 0;
                navigator.mediaSession.playbackState = 'playing';
                elements.statusDiv.textContent = 'Notification created! Check your notification area';
                elements.statusDiv.classList.add('success');
                elements.statusDiv.classList.remove('error');
            })
            .catch(error => {
                elements.statusDiv.textContent = `Error: ${error.message}. Try clicking again.`;
                elements.statusDiv.classList.add('error');
                elements.statusDiv.classList.remove('success');
            });
    });
    
    elements.stopButton.addEventListener('click', () => {
        elements.audioElement.pause();
        elements.audioElement.currentTime = 0;
        
        if (navigator.mediaSession.metadata) {
            try {
                navigator.mediaSession.metadata = null;
            } catch (e) {
                console.log("Cannot directly clear metadata, using empty metadata instead");
            }
            
            navigator.mediaSession.metadata = new MediaMetadata({
                title: '',
                artist: '',
                artwork: []
            });
        }
        
        navigator.mediaSession.playbackState = 'none';
        
        elements.statusDiv.textContent = 'Notification removed';
        elements.statusDiv.classList.remove('success');
        elements.statusDiv.classList.remove('error');
    });
}

export function updateMetadata(elements, state) {
    const title = elements.titleInput.value || 'Default Title';
    const artist = elements.artistInput.value || 'Default Artist';
    
    navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        artwork: getArtworkLinks(elements, state)
    });
    
    setupMediaSessionHandlers(elements);
}

function setupMediaSessionHandlers(elements) {
    navigator.mediaSession.setActionHandler('play', () => {
        elements.audioElement.play();
        navigator.mediaSession.playbackState = 'playing';
        elements.statusDiv.textContent = 'Playing';
        elements.statusDiv.classList.add('success');
    });
    
    navigator.mediaSession.setActionHandler('pause', () => {
        elements.audioElement.pause();
        navigator.mediaSession.playbackState = 'paused';
        elements.statusDiv.textContent = 'Paused';
        elements.statusDiv.classList.remove('success');
    });
    
    navigator.mediaSession.setActionHandler('previoustrack', () => {
        elements.statusDiv.textContent = 'Previous track action triggered';
    });
    
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        elements.statusDiv.textContent = 'Next track action triggered';
    });
}
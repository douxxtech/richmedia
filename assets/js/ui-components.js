import { updateColorPreview } from './image-handlers.js';

export function initializeUIComponents(elements, state) {
    elements.uploadOptionBtn.addEventListener('click', () => {
        elements.imageUploadInput.click();
        state.imageMode = 'upload';
        elements.urlInputContainer.style.display = 'none';
        elements.colorInputContainer.style.display = 'none';
    });
    
    elements.urlOptionBtn.addEventListener('click', () => {
        elements.urlInputContainer.style.display = 'block';
        elements.colorInputContainer.style.display = 'none';
        state.imageMode = 'url';
    });
    
    elements.colorOptionBtn.addEventListener('click', () => {
        elements.colorInputContainer.style.display = 'block';
        elements.urlInputContainer.style.display = 'none';
        state.imageMode = 'color';
        updateColorPreview(elements, state);
    });
    
    elements.imageColorInput.addEventListener('input', () => {
        if (state.imageMode === 'color') {
            updateColorPreview(elements, state);
        }
    });
    
    elements.audioElement.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        elements.statusDiv.textContent = `Audio loading error. Using built-in fallback.`;
        elements.statusDiv.classList.add('error');
    });
    
    elements.audioElement.addEventListener('ended', () => {
        if (!elements.audioElement.loop) {
            elements.audioElement.currentTime = 0;
            elements.audioElement.play();
        }
    });
}
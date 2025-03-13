import { initializeUIComponents } from './ui-components.js';
import { initializeImageHandlers } from './image-handlers.js';
import { initializeMediaSession } from './media-session.js';

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        titleInput: document.getElementById('title'),
        artistInput: document.getElementById('artist'),
        imageColorInput: document.getElementById('image-color'),
        imageUploadInput: document.getElementById('image-upload'),
        imageUrlInput: document.getElementById('image-url'),
        imagePreview: document.getElementById('image-preview'),
        uploadOptionBtn: document.getElementById('upload-option'),
        urlOptionBtn: document.getElementById('url-option-btn'),
        colorOptionBtn: document.getElementById('color-option'),
        urlInputContainer: document.getElementById('url-input-container'),
        colorInputContainer: document.getElementById('color-input-container'),
        loadUrlBtn: document.getElementById('load-url'),
        createButton: document.getElementById('create-button'),
        stopButton: document.getElementById('stop-button'),
        statusDiv: document.getElementById('status'),
        audioElement: document.getElementById('audio-element')
    };
    
    const state = {
        customImage: null,
        imageMode: 'color'
    };
    
    if (!('mediaSession' in navigator)) {
        elements.statusDiv.textContent = 'Your browser does not support Media Session API';
        elements.statusDiv.classList.add('error');
        elements.createButton.disabled = true;
        return;
    }
    
    initializeUIComponents(elements, state);
    initializeImageHandlers(elements, state);
    initializeMediaSession(elements, state);
});
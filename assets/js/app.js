document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    const artistInput = document.getElementById('artist');
    const imageColorInput = document.getElementById('image-color');
    const imageUploadInput = document.getElementById('image-upload');
    const imageUrlInput = document.getElementById('image-url');
    const imagePreview = document.getElementById('image-preview');
    const uploadOptionBtn = document.getElementById('upload-option');
    const urlOptionBtn = document.getElementById('url-option-btn');
    const colorOptionBtn = document.getElementById('color-option');
    const urlInputContainer = document.getElementById('url-input-container');
    const colorInputContainer = document.getElementById('color-input-container');
    const loadUrlBtn = document.getElementById('load-url');
    const createButton = document.getElementById('create-button');
    const stopButton = document.getElementById('stop-button');
    const statusDiv = document.getElementById('status');
    const audioElement = document.getElementById('audio-element');
    
    let customImage = null;
    let imageMode = 'color';
    
    if (!('mediaSession' in navigator)) {
        statusDiv.textContent = 'Your browser does not support Media Session API';
        statusDiv.classList.add('error');
        createButton.disabled = true;
        return;
    }
    
    function generateColorImage(color, text) {
        const canvas = document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#ffffff';
        
        return canvas.toDataURL('image/png');
    }
    
    function updateColorPreview() {
        const color = imageColorInput.value;
        const title = titleInput.value || 'T';
        const imageDataUrl = generateColorImage(color, title);
        imagePreview.src = imageDataUrl;
        imagePreview.style.display = 'block';
        customImage = imageDataUrl;
    }
    
    uploadOptionBtn.addEventListener('click', () => {
        imageUploadInput.click();
        imageMode = 'upload';
        urlInputContainer.style.display = 'none';
        colorInputContainer.style.display = 'none';
    });
    
    urlOptionBtn.addEventListener('click', () => {
        urlInputContainer.style.display = 'block';
        colorInputContainer.style.display = 'none';
        imageMode = 'url';
    });
    
    colorOptionBtn.addEventListener('click', () => {
        colorInputContainer.style.display = 'block';
        urlInputContainer.style.display = 'none';
        imageMode = 'color';
        updateColorPreview();
    });
    
    imageColorInput.addEventListener('input', () => {
        if (imageMode === 'color') {
            updateColorPreview();
        }
    });
    
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                customImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    loadUrlBtn.addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        if (url) {
            const tempImg = new Image();
            tempImg.onload = function() {
                imagePreview.src = url;
                imagePreview.style.display = 'block';
                customImage = url;
                statusDiv.textContent = 'Image loaded from URL';
                statusDiv.classList.add('success');
                statusDiv.classList.remove('error');
            };
            tempImg.onerror = function() {
                statusDiv.textContent = 'Invalid image URL';
                statusDiv.classList.add('error');
                statusDiv.classList.remove('success');
            };
            tempImg.src = url;
        }
    });
    
    function getArtworkLinks() {
        const title = titleInput.value || 'Default Title';
        
        if (imageMode === 'color') {
            const color = imageColorInput.value;
            const img96 = generateColorImage(color, title);
            const img128 = generateColorImage(color, title);
            const img192 = generateColorImage(color, title);
            const img256 = generateColorImage(color, title);
            const img512 = generateColorImage(color, title);
            
            return [
                { src: img96, sizes: '96x96', type: 'image/png' },
                { src: img128, sizes: '128x128', type: 'image/png' },
                { src: img192, sizes: '192x192', type: 'image/png' },
                { src: img256, sizes: '256x256', type: 'image/png' },
                { src: img512, sizes: '512x512', type: 'image/png' }
            ];
        } else if (customImage) {
            return [
                { src: customImage, sizes: '96x96', type: 'image/png' },
                { src: customImage, sizes: '128x128', type: 'image/png' },
                { src: customImage, sizes: '192x192', type: 'image/png' },
                { src: customImage, sizes: '256x256', type: 'image/png' },
                { src: customImage, sizes: '512x512', type: 'image/png' }
            ];
        } else {
            const defaultColor = '#ff0000';
            const img96 = generateColorImage(defaultColor, title);
            const img512 = generateColorImage(defaultColor, title);
            
            return [
                { src: img96, sizes: '96x96', type: 'image/png' },
                { src: img512, sizes: '512x512', type: 'image/png' }
            ];
        }
    }
    
    function updateMetadata() {
        const title = titleInput.value || 'Default Title';
        const artist = artistInput.value || 'Default Artist';
        
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            artwork: getArtworkLinks()
        });
        
        navigator.mediaSession.setActionHandler('play', () => {
            audioElement.play();
            navigator.mediaSession.playbackState = 'playing';
            statusDiv.textContent = 'Playing';
            statusDiv.classList.add('success');
        });
        
        navigator.mediaSession.setActionHandler('pause', () => {
            audioElement.pause();
            navigator.mediaSession.playbackState = 'paused';
            statusDiv.textContent = 'Paused';
            statusDiv.classList.remove('success');
        });
        
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            statusDiv.textContent = 'Previous track action triggered';
        });
        
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            statusDiv.textContent = 'Next track action triggered';
        });
    }
    
    createButton.addEventListener('click', () => {
        audioElement.volume = 0.01;
        audioElement.play()
            .then(() => {
                updateMetadata();
                
                audioElement.volume = 0;
                navigator.mediaSession.playbackState = 'playing';
                statusDiv.textContent = 'Notification created! Check your notification area';
                statusDiv.classList.add('success');
                statusDiv.classList.remove('error');
            })
            .catch(error => {
                statusDiv.textContent = `Error: ${error.message}. Try clicking again.`;
                statusDiv.classList.add('error');
                statusDiv.classList.remove('success');
            });
    });
    
    stopButton.addEventListener('click', () => {
        audioElement.pause();
        audioElement.currentTime = 0;
        
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
        
        statusDiv.textContent = 'Notification removed';
        statusDiv.classList.remove('success');
        statusDiv.classList.remove('error');
    });
    
    audioElement.addEventListener('play', () => {
        navigator.mediaSession.playbackState = 'playing';
        updateMetadata();
    });
    
    audioElement.addEventListener('pause', () => {
        navigator.mediaSession.playbackState = 'paused';
    });
    
    audioElement.addEventListener('ended', () => {
        if (!audioElement.loop) {
            audioElement.currentTime = 0;
            audioElement.play();
        }
    });
    
    audioElement.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        statusDiv.textContent = `Audio loading error. Using built-in fallback.`;
        statusDiv.classList.add('error');
    });
});
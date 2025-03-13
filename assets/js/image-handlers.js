export function initializeImageHandlers(elements, state) {
    elements.imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.imagePreview.src = e.target.result;
                elements.imagePreview.style.display = 'block';
                state.customImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    elements.loadUrlBtn.addEventListener('click', () => {
        const url = elements.imageUrlInput.value.trim();
        if (url) {
            const tempImg = new Image();
            tempImg.onload = function() {
                elements.imagePreview.src = url;
                elements.imagePreview.style.display = 'block';
                state.customImage = url;
                elements.statusDiv.textContent = 'Image loaded from URL';
                elements.statusDiv.classList.add('success');
                elements.statusDiv.classList.remove('error');
            };
            tempImg.onerror = function() {
                elements.statusDiv.textContent = 'Invalid image URL';
                elements.statusDiv.classList.add('error');
                elements.statusDiv.classList.remove('success');
            };
            tempImg.src = url;
        }
    });
}

export function generateColorImage(color, text) {
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

export function updateColorPreview(elements, state) {
    const color = elements.imageColorInput.value;
    const title = elements.titleInput.value || 'T';
    const imageDataUrl = generateColorImage(color, title);
    elements.imagePreview.src = imageDataUrl;
    elements.imagePreview.style.display = 'block';
    state.customImage = imageDataUrl;
}

export function getArtworkLinks(elements, state) {
    const title = elements.titleInput.value || 'Default Title';
    
    if (state.imageMode === 'color') {
        const color = elements.imageColorInput.value;
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
    } else if (state.customImage) {
        return [
            { src: state.customImage, sizes: '96x96', type: 'image/png' },
            { src: state.customImage, sizes: '128x128', type: 'image/png' },
            { src: state.customImage, sizes: '192x192', type: 'image/png' },
            { src: state.customImage, sizes: '256x256', type: 'image/png' },
            { src: state.customImage, sizes: '512x512', type: 'image/png' }
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
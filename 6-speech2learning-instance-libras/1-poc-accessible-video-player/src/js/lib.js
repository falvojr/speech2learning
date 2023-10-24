// Url inicial para requisições de API
const url_base = 'https://falvojr.github.io/speech2learning';

// Variável global para manipular retorno da API
let api_return = {
    id: '',
    language: '',
    metadata: {
        availableLanguages: {},
        subtitles: {},
        transcripts: {}
    },
    name: '',
    url: ''
}

async function loadVideo() {
    const sourceElement = document.createElement('source');
    sourceElement.src = api_return.url;
    sourceElement.type = 'video/mp4';
    videoElement.appendChild(sourceElement);
}

async function loadSubtitles(){
    api_return.metadata.subtitles.forEach(subtitle => {
        const trackElement = document.createElement('track');
        trackElement.kind = 'subtitles';
        trackElement.label = subtitle.language;
        trackElement.srclang = subtitle.language;
        trackElement.src = subtitle.url;
        trackElement.default = subtitle.language === api_return.language;

        videoElement.appendChild(trackElement);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');

    try {
        const response = await fetch(url_base + '/api/mock.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        api_return = await response.json();

        // Carregar o vídeo
        await loadVideo();

        // Carregar as legendas
        await loadSubtitles();
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});
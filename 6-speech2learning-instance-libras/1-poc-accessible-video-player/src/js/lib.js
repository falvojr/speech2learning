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

// Módulo de elementos da página
const elements = {
    resumoButtonBR: document.getElementById('resumo-pt-BR'),
    resumoButtonUS: document.getElementById('resumo-en-US'),
    resumoButtonES: document.getElementById('resumo-es-ES'),
    resumoText: document.getElementById('resume-text'),
    titleText: document.getElementById('title-text')
};

// Carregar video a partir do retorno da api
async function loadVideo(videoElement) {
    // Inserir titulo do video
    elements.resumoText.innerHTML = api_return.name;

    const sourceElement = document.createElement('source');
    sourceElement.src = api_return.url;
    sourceElement.type = 'video/mp4';
    videoElement.appendChild(sourceElement);
}

// Carregar legendas a partir do retorno da api
async function loadSubtitles(videoElement){
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

// Carregar o resumo com base no idioma selecionado
function carregarResumo(idioma) {
    fetch(url_base+`/api/videos/${api_return.id}/transcript/${idioma}.txt`)
        .then((response) => response.text())
        .then((resumo) => {
        elements.resumoText.innerHTML = resumo;
        })
        .catch((error) => {
        console.error(`Erro ao carregar resumo em ${idioma}:`, error);
        });
}

// Evento para carregar video e legenda ao entrar na página.
document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');

    try {
        const response = await fetch(url_base + '/api/mock.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        api_return = await response.json();

        // Carregar o vídeo
        await loadVideo(videoElement);

        // Carregar as legendas
        await loadSubtitles(videoElement);
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

// Eventos para carregar o resumo quando o botão "Ver Resumo" for clicado.
elements.resumoButtonBR.addEventListener('click', () => carregarResumo('pt-BR'));
elements.resumoButtonUS.addEventListener('click', () => carregarResumo('en-US'));
elements.resumoButtonES.addEventListener('click', () => carregarResumo('es-ES'));
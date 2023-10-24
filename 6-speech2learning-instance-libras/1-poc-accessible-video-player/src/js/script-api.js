// Módulo de elementos da página
const elements = {
    resumoButton: document.getElementById('resumo-button'),
    resumoButtonBR: document.getElementById('resumo-pt-BR'),
    resumoButtonUS: document.getElementById('resumo-en-US'),
    resumoButtonES: document.getElementById('resumo-es-ES'),
    resumoDiv: document.getElementById('resumo-div'),
    exportPdfButton: document.getElementById('export-pdf'),
    getApiButton: document.getElementById('get-api-button'),
    resumoText: document.getElementById('resumo-text'),
    videoIframe: document.getElementById('video-iframe'),
};

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
  
// Função para fazer a requisição HTTP GET
function getApiData() {
    fetch(url_base+'/v1/player/mock.json')
        .then((response) => response.json())
        .then((data) => {
        console.log('data: ', data);
        api_return = data;
        elements.videoIframe.style.display = 'block';
        elements.resumoButton.style.display = 'block';
        })
        .catch((error) => {
        console.error('Erro na requisição API:', error);
        });
}
document.addEventListener('DOMContentLoaded', getApiData);

// Função para carregar o resumo com base no idioma selecionado
function carregarResumo(idioma) {
    fetch(url_base+`/videos/${api_return.id}/transcript/${idioma}.html`)
        .then((response) => response.text())
        .then((resumo) => {
        elements.resumoText.innerHTML = resumo;
        })
        .catch((error) => {
        console.error(`Erro ao carregar resumo em ${idioma}:`, error);
        });
}

// Função para alternar a visibilidade de um elemento
function toggleElementVisibility(element) {
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

// Função para abrir modal de resumo
function toggleResumoDiv() {
    toggleElementVisibility(elements.resumoDiv);
}
elements.resumoButton.addEventListener('click', toggleResumoDiv);

// Função para exportar o conteúdo da div para PDF
function exportToPdf() {
    window.alert('Clicou em fazer Download PDF!');
}
elements.exportPdfButton.addEventListener('click', exportToPdf);

// Eventos para carregar o resumo quando o botão "Ver Resumo" for clicado
elements.resumoButtonBR.addEventListener('click', () => carregarResumo('pt-BR'));
elements.resumoButtonUS.addEventListener('click', () => carregarResumo('en-US'));
elements.resumoButtonES.addEventListener('click', () => carregarResumo('es-ES'));
  
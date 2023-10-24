// Módulo de elementos da página
const elements = {
    resumoButton: document.getElementById('resumo-button'),
    resumoButtonBR: document.getElementById('resumo-pt-BR'),
    resumoButtonUS: document.getElementById('resumo-en-US'),
    resumoButtonES: document.getElementById('resumo-es-ES'),
    resumoDiv: document.getElementById('resumo-div'),
    exportPdfButton: document.getElementById('export-pdf'),
    getApiButton: document.getElementById('get-api-button'),
    apiDataDiv: document.getElementById('api-data'),
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

// Função para manipular o HTML com o retorno da API
function api_return_html(){
    elements.apiDataDiv.style.display = 'block';
    elements.apiDataDiv.innerHTML = `
    <h4>Informações da API:</h4>
    <p><strong>ID:</strong> ${api_return.id}</p>
    <p><strong>Nome:</strong> ${api_return.name}</p>
    <p><strong>URL do Vídeo:</strong> <a href="${api_return.url}" target="_blank">${api_return.url}</a></p>
    <h4>Legendas Disponíveis:</h4>
    <ul>
        ${api_return.metadata.subtitles
        .map(
            (subtitle) => `<li><strong>${subtitle.language}:</strong> <a href="${subtitle.url}" target="_blank">${subtitle.url}</a></li>`
        )
        .join('')}
    </ul>
    <h4>Transcrições Disponíveis:</h4>
    <ul>
        ${api_return.metadata.transcripts
        .map(
            (transcript) => `<li><strong>${transcript.language}:</strong> <a href="${transcript.url}" target="_blank">${transcript.url}</a></li>`
        )
        .join('')}
    </ul>
    `;

    elements.videoIframe.src = api_return.url;
    elements.videoIframe.style.display = 'block';
    elements.resumoButton.style.display = 'block';
}
  
// Função para fazer a requisição HTTP GET
function getApiData() {
    fetch(url_base+'/v1/player/mock.json')
        .then((response) => response.json())
        .then((data) => {
        console.log('data: ', data);
        api_return = data;

        api_return_html();
        })
        .catch((error) => {
        console.error('Erro na requisição API:', error);
        });
}
elements.getApiButton.addEventListener('click', getApiData);

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

function gerar_legendas(){
    // Converter as legendas de SRT para VTT
    for (const subtitle of api_return.metadata.subtitles) {
        fetch(subtitle.url)
            .then((response) => response.text())
            .then((srtText) => {
            const vttText = srtToVtt(srtText);
            subtitle.url = URL.createObjectURL(new Blob([vttText], { type: 'text/vtt' }));
            })
            .catch((error) => {
            console.error('Erro na conversão de SRT para VTT:', error);
            });
    }

    // Configurar as legendas dinamicamente
    const video = elements.videoIframe;
    video.querySelector('source').src = api_return.url;

    // Limpar as legendas existentes (se houver)
    while (video.firstChild) {
    video.removeChild(video.firstChild);
    }

    // Adicionar as legendas aos tracks
    for (const subtitle of api_return.metadata.subtitles) {
    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.label = subtitle.language;
    track.src = subtitle.url;
    track.srclang = subtitle.language;
    if (subtitle.default) {
        track.default = true;
    }
    video.appendChild(track);
    }

    // Atualizar o vídeo para refletir as alterações nas legendas
    video.load();
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
  
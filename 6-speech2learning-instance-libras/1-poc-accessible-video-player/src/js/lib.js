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
    resumoButtons: {
        ptBR: document.getElementById('resumo-pt-BR'),
        enUS: document.getElementById('resumo-en-US'),
        esES: document.getElementById('resumo-es-ES')
    },
    resumoText: document.getElementById('resume-text'),
    titleText: document.getElementById('title-text'),
    descriptionText: document.getElementById('description-text'),
    btnShowResume: document.getElementById('btn-show-resume'),
    controllers: document.querySelectorAll('.controller')
};

// Função para exibir ou ocultar o botão 'btn-show-resume' com base na transcrição selecionada
function toggleBtnShowResumeVisibility() {
    // Verificar se há texto na transcrição
    const hasTranscription = elements.resumoText.textContent.trim().length > 0;

    // Exibir ou ocultar o botão com base na presença de transcrição
    elements.btnShowResume.style.display = hasTranscription ? 'block' : 'none';
}

// Função para ocultar a transcrição e o botão 'btn-show-resume'
function hideTranscription() {
    elements.resumoText.innerHTML = ''; // Limpar o conteúdo da transcrição
    
    elements.btnShowResume.style.display = 'none'; // Ocultar o botão 'btn-show-resume'
}

// Carregar video a partir do retorno da api
async function loadVideo(videoElement) {
    // Inserir titulo e descrição do video
    elements.titleText.innerHTML = api_return.name;
    elements.descriptionText.innerHTML = api_return.description;

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

// Função de trocar o contraste da tela
function toggleContrast() {
    // Adicionar a classe .dark aos elementos específicos
    var elementsWithDarkClass = document.querySelectorAll('.bg, .aside, .bottom, .toggle-theme');

    elementsWithDarkClass.forEach(function (element) {
        element.classList.toggle("dark");
    });
}

// Carregar o resumo com base no idioma selecionado
function carregarResumo(idioma) {
    // Remover a classe 'selected' de todos os botões de controle
    elements.controllers.forEach(controller => {
        controller.classList.remove('selected');
    });

    // Adicionar a classe 'selected' apenas ao botão do idioma selecionado
    elements.controllers[idMap[idioma]].classList.add('selected');

    fetch(url_base+`/api/videos/${api_return.id}/transcript/${idioma}.txt`)
        .then((response) => response.text())
        .then((resumo) => {
            // Dividir o texto em parágrafos com base nas quebras de linha
            const paragrafos = resumo.split('\n');

            // Limpar o conteúdo existente caso troque de idioma
            elements.resumoText.innerHTML = '';

            // Adicionar cada parágrafo como um elemento <p>
            paragrafos.forEach(paragrafo => {
                const pElement = document.createElement('p');
                pElement.textContent = paragrafo;
                elements.resumoText.appendChild(pElement);
            });

            toggleBtnShowResumeVisibility();
        })
        .catch((error) => {
        console.error(`Erro ao carregar resumo em ${idioma}:`, error);
        });
}

// Mapear os IDs dos botões de controle para os idiomas correspondentes
const idMap = {
    'pt-BR': 0,
    'en-US': 1,
    'es-ES': 2
};

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
        
        // Ocultar botão transcrição
        elements.btnShowResume.style.display = 'none';
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

// Eventos para carregar o resumo quando o botão "Ver Resumo" for clicado.
elements.btnShowResume.addEventListener('click', () => {
    hideTranscription();
    toggleBtnShowResumeVisibility();
});

elements.resumoButtons.ptBR.addEventListener('click', () => {
    carregarResumo('pt-BR');
});

elements.resumoButtons.enUS.addEventListener('click', () => {
    carregarResumo('en-US');
});

elements.resumoButtons.esES.addEventListener('click', () => {
    carregarResumo('es-ES');
});
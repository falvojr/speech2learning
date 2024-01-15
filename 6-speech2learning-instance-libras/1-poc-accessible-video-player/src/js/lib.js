// Url inicial para requisições de API
const url_base = 'https://falvojr.github.io/speech2learning';

// Variável global para manipular retorno da API
let api_return = {
    id: '',
    url: '',
    metadata: {
        originalLanguage: '',
        localizations: {}
    },
}

// Módulo de elementos da página
const elements = {
    resumoButtonBR: document.getElementById('resumo-pt-BR'),
    resumoButtonUS: document.getElementById('resumo-en-US'),
    resumoButtonES: document.getElementById('resumo-es-ES'),
    resumoText: document.getElementById('resume-text'),
    titleText: document.getElementById('title-text'),
    descriptionText: document.getElementById('description-text'),
    btnShowResume: document.getElementById('btn-show-resume')
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
    const sourceElement = document.createElement('source');
    sourceElement.src = api_return.url;
    sourceElement.type = 'video/mp4';
    videoElement.appendChild(sourceElement);
}

// Carregar título e descrição a partir do retorno da api, definido a lingua original
async function loadTitleAndDescription(originalLanguage) {
    let language = originalLanguage;
    elements.titleText.innerHTML = api_return.metadata.localizations[language].name;
    elements.descriptionText.innerHTML = api_return.metadata.localizations[language].description;
}


// Carregar legendas a partir do retorno da api
async function loadSubtitles(videoElement) {
    const localizations = api_return.metadata.localizations;

    for (const langCode in localizations) {
        const loc = localizations[langCode];

        const trackElement = document.createElement('track');
        trackElement.kind = 'subtitles';
        trackElement.label = langCode;
        trackElement.srclang = langCode;
        trackElement.src = loc.subtitleUrl;
        trackElement.default = langCode === api_return.metadata.originalLanguage;

        videoElement.appendChild(trackElement);
    }
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
    let linkFetch = api_return.metadata.localizations[idioma].transcriptUrl;

    fetch(linkFetch)
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
        }
    );
}

// Evento para carregar video e legenda ao entrar na página.
document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');

    try {
        const response = await fetch(url_base + '/api/mockV2.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        api_return = await response.json();

        // Carregar o vídeo
        await loadVideo(videoElement);

        // Carregar o título e descrição
        await loadTitleAndDescription(api_return.metadata.originalLanguage);

        // Carregar as legendas
        await loadSubtitles(videoElement);

        // Criar dinamicamente os controles de idioma
        const carouselControllers = document.querySelector('.carousel-controllers');
        for (const langCode in api_return.metadata.localizations) {
            const controllerDiv = document.createElement('div');
            controllerDiv.classList.add('controller');

            const button = document.createElement('button');
            button.id = `resumo-${langCode}`;
            button.classList.add('resumo-idioma');

            const img = document.createElement('img');
            img.src = `./assets/icon/${langCode}.png`;
            img.alt = `Bandeira do ${langCode}`;

            const p = document.createElement('p');
            p.textContent = langCode;

            button.appendChild(img);
            button.appendChild(p);

            controllerDiv.appendChild(button);

            carouselControllers.appendChild(controllerDiv);

            // Adicione um event listener para cada botão
            button.addEventListener('click', function () {
                carregarResumo(langCode);
                loadTitleAndDescription(langCode);
                resetControllers();
                this.parentElement.classList.add('active');
            });
        }
        
        // Ocultar botão transcrição
        elements.btnShowResume.style.display = 'none';
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

// Eventos para carregar o resumo quando o botão "Ver Resumo" for clicado.
elements.btnShowResume.addEventListener('click', () => {hideTranscription(); toggleBtnShowResumeVisibility();});

// Adicione um event listener para cada botão
document.getElementById('resumo-pt-BR').addEventListener('click', function() {
    carregarResumo('pt-BR');
    loadTitleAndDescription('pt-BR');
    resetControllers(); // Resetar todas as classes
    this.parentElement.classList.add('active'); // Adicionar classe à linguagem selecionada
});

document.getElementById('resumo-en-US').addEventListener('click', function() {
    carregarResumo('en-US');
    loadTitleAndDescription('en-US');
    resetControllers();
    this.parentElement.classList.add('active');
});

document.getElementById('resumo-es-ES').addEventListener('click', function() {
    carregarResumo('es-ES');
    loadTitleAndDescription('es-ES');
    resetControllers();
    this.parentElement.classList.add('active');
});

// Função para resetar todas as classes para a cor padrão
function resetControllers() {
    const controllers = document.querySelectorAll('.controller');
    controllers.forEach(controller => {
        controller.classList.remove('active');
    });
}
  
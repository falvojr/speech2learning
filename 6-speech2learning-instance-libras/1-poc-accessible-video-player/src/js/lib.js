// Url inicial para requisições de API
const url_base = 'https://falvojr.github.io/speech2learning';

// Variável global para manipular retorno da API
let apiModel = {
    id: '',
    url: '',
    metadata: {
        originalLanguage: '',
        localizations: {}
    },
}

// Função para obter elementos da página
const getById = (id) => document.getElementById(id);
const getFirstByClass = (className) => document.getElementsByClassName(className)[0];

// Módulo de elementos da página
const elements = {
    resumoButtons: {}, // será preenchido dinamicamente
    resumoText: getById('resume-text'),
    titleText: getById('title-text'),
    descriptionText: getById('description-text'),
    btnShowResume: getById('btn-show-resume'),
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
    sourceElement.src = apiModel.url;
    sourceElement.type = 'video/mp4';
    videoElement.appendChild(sourceElement);
}

// Carregar título e descrição a partir do retorno da api, definido a lingua original
async function loadTitleAndDescription(originalLanguage) {
    let language = originalLanguage;
    elements.titleText.innerHTML = apiModel.metadata.localizations[language].name;
    elements.descriptionText.innerHTML = apiModel.metadata.localizations[language].description;
}

// Carregar legendas a partir do retorno da api
async function loadSubtitles(videoElement) {
    const localizations = apiModel.metadata.localizations;

    for (const langCode in localizations) {
        const loc = localizations[langCode];

        const trackElement = document.createElement('track');
        trackElement.kind = 'subtitles';
        trackElement.label = langCode;
        trackElement.srclang = langCode;
        trackElement.src = loc.subtitleUrl;
        trackElement.default = langCode === apiModel.metadata.originalLanguage;

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
    let linkFetch = apiModel.metadata.localizations[idioma].transcriptUrl;

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
    const videoElement = getById('video');

    try {
        const response = await fetch(url_base + '/api/mockV2.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        apiModel = await response.json();

        // Carregar o vídeo
        await loadVideo(videoElement);

        // Carregar o título e descrição
        await loadTitleAndDescription(apiModel.metadata.originalLanguage);

        // Carregar as legendas
        await loadSubtitles(videoElement); 

        // Criar dinamicamente os controles de idioma
        for (const langCode in apiModel.metadata.localizations) {
            addLanguageButton(langCode);
        }
        
        // Ocultar botão transcrição
        elements.btnShowResume.style.display = 'none';
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

// Eventos para carregar o resumo quando o botão "Ver Resumo" for clicado.
elements.btnShowResume.addEventListener('click', () => {hideTranscription(); toggleBtnShowResumeVisibility();});

// Função para criar e adicionar elementos de botão de idioma
function addLanguageButton(langCode) {
    const carouselControllers = getFirstByClass('carousel-controllers');
    const controllerDiv = document.createElement('div');
    controllerDiv.classList.add('controller');

    const button = document.createElement('button');
    button.id = `resumo-${langCode}`;
    button.classList.add('resumo-idioma');
    elements.resumoButtons[langCode] = button; // Adicionar ao módulo de elementos

    const img = document.createElement('img');
    img.src = `./assets/icon/${langCode.toLowerCase()}.png`;
    img.alt = `Bandeira do ${langCode}`;

    const p = document.createElement('p');
    p.textContent = langCode.toUpperCase();

    button.appendChild(img);
    button.appendChild(p);
    controllerDiv.appendChild(button);
    carouselControllers.appendChild(controllerDiv);

    // Adicionar event listener
    button.addEventListener('click', function () {
        carregarResumo(langCode);
        loadTitleAndDescription(langCode);
        resetControllers();
        this.parentElement.classList.add('active');
    });
}

// Função para resetar todas as classes para a cor padrão
function resetControllers() {
    const controllers = document.querySelectorAll('.controller');
    controllers.forEach(controller => {
        controller.classList.remove('active');
    });
}
  
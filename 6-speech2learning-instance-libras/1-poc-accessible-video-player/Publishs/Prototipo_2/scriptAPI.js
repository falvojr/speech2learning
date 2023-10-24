const resumoButton = document.getElementById('resumo-button');
const resumoButtonBR = document.getElementById('resumo-pt-BR');
const resumoButtonUS = document.getElementById('resumo-en-US');
const resumoButtonES = document.getElementById('resumo-es-ES');
const resumoDiv = document.getElementById('resumo-div');
const exportPdfButton = document.getElementById('export-pdf');
const getApiButton = document.getElementById('get-api-button');
const apiDataDiv = document.getElementById('api-data');

// Função para abrir modal de resumo
resumoButton.addEventListener('click', () => {
  if (resumoDiv.style.display === 'none') {
    resumoDiv.style.display = 'block';
  } else {
    resumoDiv.style.display = 'none';
  }
});

// Função para exportar o conteúdo da div para PDF
exportPdfButton.addEventListener('click', () => {
  window.alert('Clicou em fazer Download PDF!');
});

// Função para fazer a requisição HTTP GET
getApiButton.addEventListener('click', () => {
  // Fazer a requisição HTTP GET para o JSON
  fetch('https://falvojr.github.io/speech2learning/v1/player/mock.json')
    .then((response) => response.json())
    .then((data) => {
      // Exibir os dados na div "api-data"
      apiDataDiv.style.display = 'block';
      apiDataDiv.innerHTML = `
        <h4>Informações da API:</h4>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>URL do Vídeo:</strong> <a href="${data.url}" target="_blank">${data.url}</a></p>
        <h4>Legendas Disponíveis:</h4>
        <ul>
          ${data.metadata.subtitles
            .map(
              (subtitle) => `<li><strong>${subtitle.language}:</strong> <a href="${subtitle.url}" target="_blank">${subtitle.url}</a></li>`
            )
            .join('')}
        </ul>
        <h4>Transcrições Disponíveis:</h4>
        <ul>
          ${data.metadata.transcripts
            .map(
              (transcript) => `<li><strong>${transcript.language}:</strong> <a href="${transcript.url}" target="_blank">${transcript.url}</a></li>`
            )
            .join('')}
        </ul>
      `;

      // Definir a fonte do vídeo a partir do link retornado pela API
      const videoIframe = document.getElementById('video-iframe');
      videoIframe.src = data.url;

      // Tornar visível o player de vídeo e o botão "Ver Resumo"
      videoIframe.style.display = 'block';
      resumoButton.style.display = 'block';
    })
    .catch((error) => {
      console.error('Erro na requisição API:', error);
    });
});

// Função para carregar o resumo com base no idioma selecionado
function carregarResumo(idioma) {
  fetch(`https://falvojr.github.io/speech2learning/videos/507f1f77bcf86cd799439011/transcript/${idioma}.html`)
    .then((response) => response.text())
    .then((resumo) => {
      const resumoText = document.getElementById('resumo-text');
      resumoText.innerHTML = resumo;
    })
    .catch((error) => {
      console.error(`Erro ao carregar resumo em ${idioma}:`, error);
    });
}

// Evento para carregar o resumo quando o botão "Ver Resumo" for clicado
resumoButtonBR.addEventListener('click', () => {
  // Coloque o código para selecionar o idioma desejado aqui
  const idiomaSelecionado = 'pt-BR'; // Por exemplo, carregar o resumo em português
  carregarResumo(idiomaSelecionado);
});

// Evento para carregar o resumo quando o botão "Ver Resumo" for clicado
resumoButtonUS.addEventListener('click', () => {
  // Coloque o código para selecionar o idioma desejado aqui
  const idiomaSelecionado = 'en-US'; // Por exemplo, carregar o resumo em português
  carregarResumo(idiomaSelecionado);
});

// Evento para carregar o resumo quando o botão "Ver Resumo" for clicado
resumoButtonES.addEventListener('click', () => {
  // Coloque o código para selecionar o idioma desejado aqui
  const idiomaSelecionado = 'es-ES'; // Por exemplo, carregar o resumo em português
  carregarResumo(idiomaSelecionado);
});


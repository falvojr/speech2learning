document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');

    try {
        const response = await fetch('https://falvojr.github.io/speech2learning/api/mock.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        const data = await response.json();

        // Carregar o vídeo
        const sourceElement = document.createElement('source');
        sourceElement.src = data.url;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);

        // Carregar as legendas
        data.metadata.subtitles.forEach(subtitle => {
            const trackElement = document.createElement('track');
            trackElement.kind = 'subtitles';
            trackElement.label = subtitle.language;
            trackElement.srclang = subtitle.language;
            trackElement.src = subtitle.url;
            trackElement.default = subtitle.language === data.language;

            videoElement.appendChild(trackElement);
        });

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});
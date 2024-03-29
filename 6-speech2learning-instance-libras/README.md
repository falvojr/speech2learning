# Player Acessível com Suporte a Avatares de Línguas de Sinais

Este projeto integra a segunda instância da **_Arquitetura Speech2Learning_**, desenvolvida em parceria com os alunos de iniciação científica [@driicarvalho7](https://github.com/driicarvalho7) e [@motoki-yo](https://github.com/motoki-yo). Neste cenário, realizamos uma nova Prova de Conceito (PoC), também em colaboração com a EdTech DIO, com o objetivo de promover a acessibilidade em LIBRAS para seus conteúdos educacionais.

## Prova de Conceito (PoC)

Construímos um player de vídeo com design acessível, especialmente projetado para atender às necessidades de usuários surdos ou com deficiência auditiva. Para tornar o conteúdo educacional mais inclusivo e acessível, implementamos a integração com avatares de língua de sinais. A singularidade desta abordagem reside no uso de texto para animar os avatares, uma diretriz central da **_Arquitetura Speech2Learning_** que enfatiza o uso de Speech-To-Text (STT) como ferramenta essencial para aprimorar a acessibilidade em Objetos de Aprendizagem (OAs).

Esta PoC representa um marco fundamental para a **_Speech2Learning_**, pois estabelece as bases para futuros experimentos. Com ela, almejamos explorar a receptividade da comunidade surda em relação ao nosso player de vídeo, identificando pontos de melhoria e assegurando o alinhamento da solução com as necessidades do público.

Mais do que um avanço tecnológico, este projeto é um compromisso com a quebra de barreiras, a promoção da inclusão e a democratização do acesso à educação, independentemente das habilidades auditivas dos indivíduos. A participação dos alunos de iniciação científica [@driicarvalho7](https://github.com/driicarvalho7) e [@motoki-yo](https://github.com/motoki-yo) tem sido imprescindível, trazendo perspectivas únicas e enriquecedoras para o desenvolvimento do projeto.


```mermaid
sequenceDiagram
    box transparent Projeto de Iniciação Científica
    actor Surdo as Usuário da Libras
    participant PlayerDeVideo as Player de Video
    end
    participant Speech2Learning as API REST (Speech2Learning)
    participant AvatarDeLibras as Avatar de Libras

    Surdo->>PlayerDeVideo: Solicita a visualização de um vídeo
    activate PlayerDeVideo

    PlayerDeVideo->>Speech2Learning: GET /videos/{id}
    activate Speech2Learning
    Speech2Learning-->>PlayerDeVideo: Vídeo + metadados (transcrições, legendas etc)
    deactivate Speech2Learning

    PlayerDeVideo-->>Surdo: Apresenta o vídeo e seus metadados

    deactivate PlayerDeVideo
    
    loop Interagir com a Transcrição do Player de Vídeo Usando o Avatar de Libras
        Surdo->>PlayerDeVideo: Seleciona um texto para sinalização em Libras 
        activate PlayerDeVideo
        PlayerDeVideo->>AvatarDeLibras: Solicita a sinalização do texto em Libras
        activate AvatarDeLibras
        AvatarDeLibras-->>PlayerDeVideo: Retorna a sinalização do texto em Libras
        deactivate AvatarDeLibras
        PlayerDeVideo-->>Surdo: Avatar sinaliza o texto selecionado em Libras
    end

    deactivate PlayerDeVideo
```

## Experimento

### Fase 1: Experimento Piloto

Nesta fase preliminar, buscamos estabelecer a viabilidade do experimento, avaliando as preferências da comunidade surda entre os avatares VLibras e Hand Talks, e identificando oportunidades de melhoria no design acessível do player [(Wohlin et al., 2012)](#referencias). Seguindo um design de within-subjects, cada participante interagiu com ambos os avatares, proporcionando feedback valioso para a otimização do experimento principal [(Juristo & Moreno, 2011)](#referencias).

### Fase 2: Experimento Principal

O foco principal desta fase é avaliar a eficácia, eficiência e satisfação do usuário ao interagir com o Player de Vídeo enriquecido com features acessíveis, empregando um design between-subjects para uma análise comparativa robusta [(Wohlin et al., 2012; Juristo & Moreno, 2011)](#referencias). Através de um procedimento estruturado e análises qualitativas e quantitativas, buscamos responder às questões de pesquisa estabelecidas e garantir que o player atenda às necessidades da comunidade surda em termos de design acessível e satisfação do usuário [(Kitchenham & Pfleeger, 2001)](#referencias).

### Referências
- Wohlin, C., Runeson, P., Höst, M., Ohlsson, M. C., Regnell, B., & Wesslén, A. (2012). Experimentation in Software Engineering. Springer.
- Juristo, N., & Moreno, A. M. (2011). Basics of Software Engineering Experimentation. Springer.
- Kitchenham, B. A., & Pfleeger, S. L. (2001). Principles of survey research: Part 1: Turning lemons into lemonade. ACM SIGSOFT Software Engineering Notes, 26(6), 16-18.

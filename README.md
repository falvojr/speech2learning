# Arquitetura Speech2Learning

Repositório com diagramas e artefatos da Speech2Learning, uma arquitetura baseada em reconhecimento de fala para acessibilidade de conteúdos educacionais audíveis.

## Diagram de Componentes: Visão Arquitetural

```mermaid
graph RL;
  subgraph "Infraestrutura";
    Web(Web) --- Con
    Dis(Dispositivos) --- Con
    UI("Interface do Usuário (UI)") --- Pre
    BD(Bancos de Dados) --- Gat
    EXT(Integrações Externas) --- Gat

    subgraph "Adaptadores";
      Con(Controllers) --- UC
      Pre(Presenters) --- UC
      Gat(Gateways) -...-> |implementam| IGat

      subgraph "Aplicação";
        UC(Casos de Uso) --- OA
        UC --- IGat

        subgraph "Entidades";
          OA("Objetos de Aprendizagem (OA)")
          OA -.-> |contemplam| OAA(OA Audíveis)
          OAA -.-> |possuem| Tra(Transcrição)
          IGat(Interfaces de Gateways)
          IGat -.-> |contemplam| IRep(Interfaces de Repositórios)
          IGat -.-> |contemplam| IS2T(Interfaces de Reconhecimento de Fala)
        end
     end
    end
  end

classDef infra fill:#a3c9ff,stroke:#00315c,color:#00315c;
classDef adapters fill:#67dbb1,stroke:#003828,color:#003828;
classDef ucs fill:#ffb1c1,stroke:#5f112b,color:#5f112b;
classDef entities fill:#e2c54b,stroke:#3a3000,color:#3a3000;
classDef entities_secondary fill:#fff0c0,stroke:#3a3000,color:#3a3000,stroke-dasharray: 4 4;

class Web,Dis,UI,BD,EXT infra;
class Con,Gat,Pre adapters;
class UC ucs;
class OA,IGat entities;
class OAA,Tra,IRep,IS2T entities_secondary;
```

## Diagram de Sequencia: Caso de Uso Criar Audio Transcrito

```mermaid
sequenceDiagram
    box rgb(0, 49, 92) Infraestrutura
    participant API as Web API
    participant Cloud
    participant MongoDB
    end
    box rgb(0, 56, 40) Adaptadores
    participant Controller as AudioRestController
    participant SttGateway as SttCloudGateway
    participant DataGateway as AudioMongoDbGateway
    end
    box rgb(95, 17, 43) Casos de Uso
    participant CreateUC as CreateTranscribedAudioUC
    end
    box rgb(58, 48, 0) Objetos de Aprendizagem #40;Entidades#41;
    participant Entity as Audio
    participant ISttGateway as #60;I#62;SttGateway
    participant IDataGateway as #60;I#62;AudioGateway
    end
    
    API-)+Controller: HTTP POST /audios<br/>Content-Language: pt_BR
    Controller->>+CreateUC: Adpata o corpo da requisição HTTP para uma estrutura conveniente ao Caso de Uso (UC)
    CreateUC->>+Entity: Cria um "Audio" com os dados de "Entrada"
    critical Regras cruciais de negócio falharam
        Entity--xCreateUC: Trata como uma exceção de negócio
    end
    Entity-->>-CreateUC: Retorna a instância do "Audio" validada
    CreateUC->>+ISttGateway: Solicita a transcrição do áudio para a abstração de reconhecimento de fala
    SttGateway-->>ISttGateway: Provê a implementação concreta para o reconhecimento de fala.
    activate SttGateway
    alt AWS Provider Enabled
        SttGateway-)+Cloud: Consome o serviço em nuvem "Amazon Transcribe".
    else Google Provider Enabled
        SttGateway-)Cloud: Consome o serviço em nuvem "GCP Speech-To-Text".
    else Microsoft Provider Enabled
        SttGateway-)Cloud: Consome o serviço em nuvem "Azure Speech-To-Text".
    else IBM Provider Enabled
        SttGateway-)Cloud: Consome o serviço em nuvem "Watson Speech-To-Text".
    end
    Cloud--)-SttGateway: Transcrição automática do áudio
    deactivate SttGateway
    critical Falha na transcrição do áudio
        ISttGateway--xCreateUC: Trata como uma exceção de negócio
    end
    ISttGateway-->>-CreateUC: Retorna a transcrição do áudio.
    CreateUC->>+Entity: Adiciona a transcrição e língua nos Metadados.
    Entity->>Entity: Preenche os Metadados, versionando-os como "v0".
    Entity-->>-CreateUC: Retorna a instância do "Audio" com os Metadados preparados.
    CreateUC->>+IDataGateway: Solicita a persistência do áudio e seus respectivos Metadados.
    DataGateway-->>IDataGateway: Provê a implementação concreta para a persistência de dados.
    activate DataGateway
    Note over MongoDB: Usa o GridFS para armazenar/recuperar arquivos
    par Armazena o arquivo de áudio
        DataGateway-)+MongoDB: Persiste o arquivo na collection "fs.chunks".
    and Armazena os metadados do arquivo de áudio
        DataGateway-)MongoDB: Persiste os metadados na collection "fs.files".
    end 
    MongoDB--)-DataGateway: Retorna o ObjectId do documento persistido/mapeado.
    deactivate DataGateway
    CreateUC->>CreateUC: Consolida os dados em uma "Saida"
    CreateUC -->- Controller: Retorna o ID do Audio criado
    Controller--)-API: HTTP Status 203 (Created)

```

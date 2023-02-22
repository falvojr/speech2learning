# Arquitetura Speech2Learning

Repositório com diagramas e artefatos da Speech2Learning, uma arquitetura baseada em reconhecimento de fala para acessibilidade de conteúdos educacionais audíveis.

## Diagram de Componentes

```mermaid
graph BT;
  subgraph "Infraestrutura (Frameworks & Drivers)";
    Web(Web) --- Con
    Dis(Dispositivos) --- Con
    UI("Interface do Usuário (UI)") --- Pre
    EXT(Integrações Externas)
    BD(Banco de Dados)

    subgraph "Adaptadores de Interface";
        Con(Controllers) --- UC
        Pre(Presenters) --- UC
        Gat(Gateways) -..- IGat

        subgraph "Casos de Uso";
            UC(Casos de Uso) --- OA

            subgraph "Entidades";
                OA(Objetos de Aprendizagem) --- |possui| MD[Metadados]
                IGat(Interfaces dos Gateways)
            end
            UC --- IGat
        end
    end
    Gat ---- BD
    Gat --- EXT
  end

classDef infra fill:#a3c9ff,stroke:#00315c,color:#00315c;
classDef adapters fill:#67dbb1,stroke:#003828,color:#003828;
classDef ucs fill:#ffb1c1,stroke:#5f112b,color:#5f112b;
classDef entities fill:#e2c54b,stroke:#3a3000,color:#3a3000;

class Web,Dis,UI,BD,EXT infra;
class Con,Gat,Pre adapters;
class UC ucs;
class OA,MD,IGat entities;
```

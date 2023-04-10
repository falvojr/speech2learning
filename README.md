# Arquitetura Speech2Learning

Repositório de documentação e artefatos da Speech2Learning, uma arquitetura que tem como objetivo oferecer uma abstração de software que favoreça a acessibilidade de conteúdos educacionais por meio do conceito de reconhecimento de fala. Especificamente, a Speech2Learning tem foco na acessibilidade de conteúdos audíveis, os quais são convertidos em texto, gerando insumos para transcrições, legendas ou sinalização em línguas de sinais (através de um avatar de LIBRAS baseado em texto, como o Hand Talk, por exemplo). Além disso, esta proposta possui sinergia com os conceitos de Objetos de Aprendizagem (OA) e Recursos Educacionais Abertos (REAs), os quais foram integrados à arquitetura visando a padronização de artefatos de ensino reutilizáveis e (preferencialmente) licenciados de maneira aberta.

## Mapeamento Sistemático da Literatura: Nosso "Porque"

Antes de propormos a Arquitetura Speech2Learning, conduzimos um Mapeamento Sistemático (MS) com o objetivo de identificar como a tecnologia tem contribuído para o ensino e aprendizagem por meio das línguas de sinais (FalvoJr et al., [2020a](https://doi.org/10.5753/cbie.sbie.2020.812); [2020b](https://doi.org/10.1109/FIE44824.2020.9274169); [2020c](https://doi.org/10.22456/1679-1916.110217)). O MS identificou 185 estudos primários, oferecendo um panorama das principais soluções tecnológicas relacionadas à educação para surdos e delimitando as publicações focadas na Língua Brasileira de Sinais (LIBRAS).

Em geral, o MS concluiu que a tecnologia já tem contribuído significativamente para o ensino e aprendizagem através das línguas de sinais. No entanto, os estudos primários carecem de padrões e boas práticas de desenvolvimento que possam favorecer o compartilhamento de seus objetos de aprendizagem. Diante dessa lacuna, a arquitetura de software Speech2Learning foi criada para promover a construção de soluções que estejam estruturalmente preparadas para a inclusão de pessoas surdas no processo de ensino e aprendizagem, por meio da acessibilidade de conteúdos educacionais audíveis.

Tecnicamente, a Speech2Learning propõe um arcabouço genérico, que não se limita apenas às línguas de sinais. Contudo, ela oferece uma abstração que facilita a acessibilidade de objetos de aprendizagem audíveis, permitindo que suas transcrições sejam geradas e, consequentemente, possibilitando a sinalização dos mesmos. Nesse contexto, soluções baseadas em avatares (como o [Hand Talk](https://www.handtalk.me/), que se destacou em nosso MS) podem ser exploradas a partir das transcrições, tornando os conteúdos acessíveis ao público das línguas de sinais.

## Referências e Influências: Nosso "Como"

Nesse contexto, propomos a Arquitetura Speech2Learning, uma adaptação da *Clean Architecture* [(Martin, 2012)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) no domínio educacional, com o objetivo de promover a acessibilidade de objetos de aprendizagem através do reconhecimento de fala. Antes de apresentarmos o desenho da Speech2Learning, é importante fundamentar brevemente a *Clean Architecture* e suas principais características.

O termo *Clean Architecture* foi cunhado por Robert Martin (Uncle Bob) em 2012 e tem se difundido desde então, principalmente pelo sucesso de sua série de livros (Martin, [2008](https://www.amazon.com/gp/product/0132350882); [2011](https://www.amazon.com/gp/product/0137081073); [2017](https://www.amazon.com/gp/product/0134494164); [2019](https://www.amazon.com/gp/product/0135781868); [2021](https://www.amazon.com/gp/product/013691571X)). Em linhas gerais, a *Clean Architecture* é uma ideia prática que integra algumas das principais referências em Engenharia de Software nas últimas décadas, incluindo:  

-   *Hexagonal Architecture* (também conhecida como *Ports and Adapters*): Idealizada por [Cockburn (2005)](https://alistair.cockburn.us/hexagonal-architecture) e adotada no livro de [Freeman e Pryce (2009)](https://www.amazon.com.br/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627), que, segundo Robert Martin: "Expõe a profunda simbiose entre Test Driven Development (TDD) e Object Oriented Design (OOD)";
-   *Onion Architecture*: Proposta por [Palermo (2008)](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1), é estruturalmente muito similar à *Clean Architecture* e foi uma das precursoras a propor camadas concêntricas;
-   *Data, Context and Interaction (DCI)*: [Coplien e Reenskaug (2012)](https://www.amazon.com/Agile-Software-Architecture-Paradigm-Orientation-ebook/dp/B019ZTY6EM) definem o paradigma DCI, o qual nos faz refletir sobre a forma como lidamos com a Programação Orientada a Objetos (POO), sugerindo o DCI como fundamento para um código mais expressivo [(Reenskaug, 2009)](https://dci.github.io/documents/commonsense.pdf). Um adendo interessante é que Reenskaug também é o criador do padrão MVC;
-   *Boundary, Control and Entity (BCE)*: Desenvolvido por Ivar Jacobson, um dos pioneiros da UML, é um padrão arquitetural que favorece a engenharia de software orientada a objetos guiada por casos de uso [(Jacobson, 1992)](https://www.amazon.com/Object-Oriented-Software-Engineering-Approach/dp/0201544350).

Todas essas iniciativas compartilham a ideia de separar o código em camadas independentes e ter o domínio no centro da arquitetura, permitindo a criação de sistemas altamente testáveis, independentes de tecnologia e adaptáveis às necessidades específicas de um projeto. Embora a *Clean Architecture* tenha uma estrutura geral definida por Robert Martin, é importante lembrar que ela possui flexibilidade e adaptabilidade como algumas de suas principais características. É possível, por exemplo, adicionar novas camadas, ajustar as responsabilidades, modificar a granularidade dos componentes da arquitetura e até mesmo introduzir novas tecnologias ou padrões. 

Tais características, aliadas à grande aceitação da *Clean Architecture* na indústria, sugerem uma referência sólida e confiável para abordarmos os gaps identificados em nosso MS, visando potencializar a criação de soluções educacionais flexíveis e modulares, com foco em reúso e independência de tecnologia. Nesse contexto, propomos a Arquitetura Speech2Learning, uma adaptação da *Clean Architecture* que mantém todas as suas características intrínsecas, mas formaliza aspectos importantes para a acessibilidade de objetos de aprendizagem audíveis. Com isso, nossa intenção é definir uma estrutura que favoreça a construção de soluções educacionais acessíveis, as quais podem beneficiar aprendizes surdos através de transcrições interpretadas por avatares de línguas de sinais, por exemplo.

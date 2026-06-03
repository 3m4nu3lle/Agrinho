# Terra Viva — Seguranca Alimentar e Producao Sustentavel

Projeto desenvolvido para o **Agrinho Programacao 2026**, com o tema **Seguranca Alimentar e Producao Sustentavel**.

## Objetivo do tema

Mostrar que seguranca alimentar nao e so ter comida no prato, mas garantir qualidade, quantidade, acesso justo e sustentabilidade para as proximas geracoes.

## Identidade visual Terra Viva

Paleta terrosa e organica (areia, argila, cobre/terracota) que remete a terra viva, solo e crescimento. Tipografia mista: Poppins para titulos compactos, Inter para corpo editorial.

## Tecnologias utilizadas

- HTML5 semantico com ARIA roles
- CSS3: variaveis, flexbox, grid, media queries, keyframes, backdrop-filter, gradientes
- Google Fonts (Inter + Poppins)
- JavaScript vanilla (ES6+) com localStorage
- Canvas API para topografia organica
- SVG inline para caule, reservatorios e micelio

## Funcionalidades interativas

- **Preloader** com spinner terracota
- **Header auto-hide:** some ao rolar para baixo, reaparece ao subir
- **Topografia organica:** canvas com linhas de contorno onduladas animadas
- **Caule de navegacao:** barra lateral com nos que pulsam e se preenchem ao rolar (desktop)
- **Menu semente:** botao flutuante mobile que abre sementes em arco
- **Reservatorios animados:** contadores que enchem como recipientes de agua em SVG
- **Slider de pilares:** carrossel com dots e navegacao por setas, auto-advance
- **3D tilt:** cards inclinam suavemente ao mover o mouse (desktop)
- **Desidratacao visual:** cards que "racham" ao passar o mouse
- **Germinacao:** cards que brotam com efeito elastico
- **Teia de micelio:** linha conectora SVG entre os exemplos
- **Quiz:** teste de conhecimentos com pontuacao
- **Carta de Compromisso:** formulario que gera declaracao personalizada
- **Ordenacao de referencias:** ordene por ano crescente/decrescente
- **Modo escuro + alto contraste + ajuste de fonte + traducao PT/EN:** controles no cabecalho com persistencia via localStorage
- **Scroll reveal:** elementos surgem suavemente ao rolar
- **Voltar ao topo:** botao flutuante

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno.
2. Navegue pelas secoes pelo caule lateral (desktop) ou menu semente (mobile).
3. Interaja com o slider, quiz, carta de compromisso e abas.

## Estrutura de arquivos

```
/
├── index.html          # Estrutura semantica com SVGs inline e canvas
├── style.css           # Estilos Terra Viva: paleta terrosa, animacoes complexas
├── script.js           # JS: localStorage, header auto-hide, slider, 3D tilt, quiz
└── README.md           # Este arquivo
```

## Creditos

Conteudo textual autoral baseado em referencias como FAO, IPES-Food, EMBRAPA, Forum Mundial da Alimentacao, Via Campesina, MST e Rede Ecoa.
Todos os elementos visuais sao CSS, SVG inline e canvas (zero imagens externas).

Projeto desenvolvido para o **Agrinho Programacao 2026**.

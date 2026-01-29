# CargosAppWeb# CargosAppWeb

Aplicação para **consulta, geração e visualização de descrições de cargos**, composta por:

- **Backend em Python**: coleta, consolidação e geração de JSON de cargos
- **Frontend Web (HTML/CSS/JS)**: interface para pesquisa, visualização e impressão de relatórios
- **Deploy via GitHub Pages**, utilizando apenas a pasta `web`

---

## 📌 Visão Geral

Este projeto resolve três problemas principais:

1. **Buscar cargos automaticamente** a partir de uma base externa (API Senior)
2. **Estruturar dados de cargos** em JSON padronizado
3. **Gerar relatórios visuais e imprimíveis** (A4 / PDF) via navegador

---

## 📁 Estrutura do Projeto

```text
CargosAppWeb/
│
├── app/                    # Scripts Python (backend / geração de dados)
│   ├── CriadorCargos.py
│   ├── criar_Base_De_Cargos.py
│   └── funcs.py
│
├── web/                    # Frontend (GitHub Pages)
│   ├── index.html
│   ├── GerarRelatorio.js
│   ├── Script.js
│   ├── json/
│   │   └── CargosDesc.json
│   └── media/
│       └── tke_logo_rgb_standard_gradient.svg
│
└── README.md

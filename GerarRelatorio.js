const btprintPDF = document.getElementById("baixarPdf");

const opt = localStorage.getItem("buttonSelected");
const dadosRaw = JSON.parse(localStorage.getItem("cargoSelecionado"));

// ======================
// NORMALIZA DADOS
// ======================
// garante sempre array
const dados = Array.isArray(dadosRaw) ? dadosRaw : [dadosRaw];

// ======================
// PREENCHER RELATÓRIO (1 CARGO)
// ======================
function preencherRelatorio(dado) {
  const sumario = document.getElementById("Sumario");
  const responsabilidades = document.getElementById("Responsabilidades");
  const competencias_tecnicas = document.getElementById("competencias_tecnicas");
  const idioma_formacao = document.getElementById("idioma_formacao");
  const tituloRelatorio = document.getElementById("TituloRelatorio");

  tituloRelatorio.textContent = dado.name ?? "";
  sumario.textContent = dado.items?.[0]?.description ?? "";
  responsabilidades.textContent = dado.items?.[1]?.description ?? "";
  competencias_tecnicas.textContent = dado.items?.[2]?.description ?? "";
  idioma_formacao.textContent = dado.items?.[3]?.description ?? "";

}

// ======================
// GERAR RELATÓRIO PARA VÁRIOS
// ======================
function gerarTodos(dados) {
  const original = document.getElementById("allContent");
  original.remove();

  dados.forEach(dado => {
    const clone = original.cloneNode(true);

    clone.querySelector("#TituloRelatorio").textContent = dado.name ?? "";
    clone.querySelector("#Sumario").textContent = dado.items?.[0]?.description ?? "";
    clone.querySelector("#Responsabilidades").textContent = dado.items?.[1]?.description ?? "";
    clone.querySelector("#competencias_tecnicas").textContent = dado.items?.[2]?.description ?? "";
    clone.querySelector("#idioma_formacao").textContent = dado.items?.[3]?.description ?? "";

    document.body.appendChild(clone);
  });
}

// ======================
// CONTROLE DE FLUXO
// ======================
switch (opt) {
  case "1":
    // vários selecionados
    gerarTodos(dados);
    break;

  case "2":
    // todos
    gerarTodos(dados);
    break;

  default:
    console.error("Opção inválida:", opt);
}

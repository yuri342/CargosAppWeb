// ======================
// GERAR EXCEL
// ======================
export async function gerarExcel(dados) {
  const linhas = dados.map(dado => ({
    Cargo: dado.name,
    Descrição: dado.items?.[0]?.description ?? "",
    Responsabilidades: dado.items?.[1]?.description ?? "",
    Competencias_Técnicas: dado.items?.[2]?.description ?? "",
    Formação_Idioma: dado.items?.[3]?.description ?? ""
  }));

  const ws = XLSX.utils.json_to_sheet(linhas);

  const headerStyle = {
    fill: { fgColor: { rgb: "000000" } },
    font: { color: { rgb: "FFFFFF" }, bold: true },
    alignment: { horizontal: "center", vertical: "center" }
  };

  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (cell) cell.s = headerStyle;
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cargos");
  XLSX.writeFile(wb, "cargos.xlsx");
}

// ======================
// CARREGAR NOMES
// ======================
async function carregarJson() {
  const response = await fetch('./json/CargosDesc.json');
  const data = await response.json();
  return data.map(item => item.name);
}

// ======================   //
// RENDER SELECT           //
// ====================== //
async function render(filter = '') {
  const cargosNomes = await carregarJson();
  const select = document.getElementById("dataOpts");

  select.innerHTML = '';

  const filtro = filter.trim().toLowerCase();

  cargosNomes.forEach(nome => {
    if (!filtro || nome.toLowerCase() === filtro) {
      const opt = document.createElement("option");
      opt.value = nome;
      opt.textContent = nome;
      select.appendChild(opt);
    }
  });
}

render();

// ======================
// INPUT FILTRO
// ======================
const inputFiltro = document.getElementById("NomeDoArquivo");

function atualizarLista() {
  const valor = inputFiltro.value.trim();
  render(valor);
}

inputFiltro.addEventListener("input", atualizarLista);
document.addEventListener("DOMContentLoaded", atualizarLista);

// ======================
// UTIL — PEGAR MULTI SELEÇÃO
// ======================
function getSelecionados(select) {
  return Array.from(select.selectedOptions)
    .map(opt => opt.value);
}

// ======================
// BUSCAR CARGOS POR NOME (ARRAY)
// ======================
async function buscarCargosPorNome(nomes) {
  const response = await fetch('./json/CargosDesc.json');
  const dados = await response.json();
  return dados.filter(cargo => nomes.some(nome => nome === cargo.name));
}

// ======================
// ELEMENTOS
// ======================
const selectCargos = document.getElementById("dataOpts");
const btEnviar = document.getElementById("Enviar");
const btTodos = document.getElementById("GerarTodos");
const btExcel = document.getElementById("GerarEmExcel");

// ======================
// GERAR EXCEL
// ======================
btExcel.addEventListener("click", async () => {
  const selecionados = getSelecionados(selectCargos);

  const response = await fetch('./json/CargosDesc.json');
  const data = await response.json();

  const dados = selecionados.length
    ? data.filter(cargo => selecionados.includes(cargo.name))
    : data;

  await gerarExcel(dados);
});

// ======================
// GERAR TODOS
// ======================
btTodos.addEventListener("click", async () => {
  const response = await fetch('./json/CargosDesc.json');
  const data = await response.json();

  localStorage.setItem("cargoSelecionado", JSON.stringify(data));
  localStorage.setItem("buttonSelected", 2);

  window.location.href = "Model.html";
});

// ======================
// ENVIAR SELECIONADOS
// ======================
btEnviar.addEventListener("click", async () => {
  const selecionados = getSelecionados(selectCargos);

  if (selecionados.length === 0) {
    alert("Selecione ao menos um cargo");
    return; 
  }

  const dados = await buscarCargosPorNome(selecionados);

  localStorage.setItem("cargoSelecionado", JSON.stringify(dados));
  localStorage.setItem("buttonSelected", 1);

  window.location.href = "Model.html";
});

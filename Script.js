// ======================
// CONFIG / CACHE
// ======================
let cargosCache = null;

// ======================
// NORMALIZAR TEXTO
// ======================
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim();
}

// ======================
// CARREGAR JSON (CACHE)
// ======================
async function carregarJson() {
  if (cargosCache) return cargosCache;

  const response = await fetch('./json/CargosDesc.json');
  cargosCache = await response.json();
  return cargosCache;
}

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
// RENDER SELECT (BUSCA INTELIGENTE)
// ======================
async function render(filter = '') {
  const dados = await carregarJson();
  const select = document.getElementById("dataOpts");

  select.innerHTML = '';

  const filtroNormalizado = normalizarTexto(filter);

  dados.forEach(({ name }) => {
    const nomeNormalizado = normalizarTexto(name);

    if (!filtroNormalizado || nomeNormalizado.includes(filtroNormalizado)) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    }
  });
}

// ======================
// DEBOUNCE (PERFORMANCE)
// ======================
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ======================
// INPUT FILTRO
// ======================
const inputFiltro = document.getElementById("NomeDoArquivo");

const atualizarLista = debounce(() => {
  render(inputFiltro.value);
}, 300);

inputFiltro.addEventListener("input", atualizarLista);
document.addEventListener("DOMContentLoaded", () => render());

// ======================
// UTIL — PEGAR MULTI SELEÇÃO
// ======================
function getSelecionados(select) {
  return Array.from(select.selectedOptions).map(opt => opt.value);
}

// ======================
// BUSCAR CARGOS POR NOME
// ======================
async function buscarCargosPorNome(nomes) {
  const dados = await carregarJson();
  return dados.filter(cargo => nomes.includes(cargo.name));
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
  const data = await carregarJson();

  const dados = selecionados.length
    ? data.filter(cargo => selecionados.includes(cargo.name))
    : data;

  await gerarExcel(dados);
});

// ======================
// GERAR TODOS
// ======================
btTodos.addEventListener("click", async () => {
  const data = await carregarJson();

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

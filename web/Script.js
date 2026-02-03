import {gerarExcel} from './GerarRelatorio.js';

async function carregarJson() {
    const response = await fetch('./json/CargosDesc.json');
    const data = await response.json();
    return data.map(item => item.name);
}

async function render(filter = '') {
    const cargosNomes = await carregarJson();
    const app = document.getElementById("dataOpts");

    app.innerHTML = ''; // limpa antes de renderizar

    const filtro = filter.trim().toLowerCase();

    cargosNomes.forEach(nome => {
        const nomeNormalizado = nome.toLowerCase();

        if (!filtro || nomeNormalizado.includes(filtro)) {
            const opt = document.createElement("option");
            opt.id = "OptData"
            opt.value = nome;
            opt.textContent = nome;
            app.appendChild(opt);
        }
    });

    console.log("RenderOK");
}

async function CarregarObj(key) {
    const response = await fetch('./json/CargosDesc.json');
    const data = await response.json();
    const resultado = data.find(item => item.name === key);

    console.log(resultado)


}

const input = document.getElementById("NomeDoArquivo");
function atualizarLista() {
    const skey = input.value.trim();
    console.log("Valor Pesquisado:", skey);

    if (skey === '') {
        render();
    } else {
        render(skey);
    }
}
input.addEventListener("input", atualizarLista);
document.addEventListener("DOMContentLoaded", atualizarLista);

async function buscarCargoPorNome(nome) {
    const response = await fetch('./json/CargosDesc.json');
    const dados = await response.json();

    return dados.find(cargo => cargo.name === nome) || null;
}

const inputselect = document.getElementById("dataOpts")

const inputBt = document.getElementById("Enviar")
const inputBtTodos = document.getElementById("GerarTodos")
const inputBtExcel = document.getElementById("GerarEmExcel")

inputBtExcel.addEventListener("click", async e =>{
    const response = await fetch('./json/CargosDesc.json');
    const data = await response.json();
    await gerarExcel(data)
})

inputBtTodos.addEventListener("click", async e =>{
    const response = await fetch('./json/CargosDesc.json');
    const data = await response.json();
    localStorage.setItem("cargoSelecionado", JSON.stringify(data))
    localStorage.setItem("buttonSelected", 2)
    window.location.href = "Model.html"
})

inputBt.addEventListener("click", async e =>{
    const dados = await buscarCargoPorNome(inputselect.value)
    localStorage.setItem("cargoSelecionado", JSON.stringify(dados));
    localStorage.setItem("buttonSelected", 1)
    window.location.href = "Model.html";
})


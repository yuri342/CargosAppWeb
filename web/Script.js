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
            opt.value = nome;
            opt.textContent = nome;
            app.appendChild(opt);
        }
    });

    console.log("RenderOK");
}

const input = document.getElementById("NomeDoArquivo")
input.addEventListener('input', e => {
    const skey = e.target.value.trim();
    console.log("Valor Pesquisado:", skey);

    if (skey === '') {
        render();
    } else {
        render(skey);
    }
});

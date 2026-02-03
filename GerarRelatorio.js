
const btprintPDF = document.getElementById("baixarPdf");

const opt = localStorage.getItem("buttonSelected")
const dados = JSON.parse(localStorage.getItem("cargoSelecionado"));



async function prencherRelatorio(dados) {
        //Sumario
        const sumario = document.getElementById("Sumario")
        //Responsabilidades
        const Responsabilidades = document.getElementById("Responsabilidades")
        //competencias_tecnicas
        const competencias_tecnicas = document.getElementById("competencias_tecnicas")
        //idioma_formacao
        const idioma_formacao = document.getElementById("idioma_formacao")
        //titRel
        const TituloRelatorio = document.getElementById("TituloRelatorio")

        let sumarioText = dados.items[0].description
        let ResponsabilidadesText = dados.items[1].description
        let competencias_tecnicasText = dados.items[2].description
        let idioma_formacaoText = dados.items[3].description
        let tituloText = dados.name
    
        TituloRelatorio.textContent = tituloText
        sumario.textContent = sumarioText
        Responsabilidades.textContent = ResponsabilidadesText
        competencias_tecnicas.textContent = competencias_tecnicasText
        idioma_formacao.textContent = idioma_formacaoText
        
        console.log(dados.items[0].title)
}

function gerarTodos(dados) {
    const original = document.getElementById("allContent");
    console.log(dados)
    dados.forEach(dado => {
        const clone = original.cloneNode(true);
        original.remove();

        clone.querySelector("#TituloRelatorio").textContent = dado.name;
        clone.querySelector("#Sumario").textContent = dado.items?.[0]?.description ?? "";
        clone.querySelector("#Responsabilidades").textContent = dado.items?.[1]?.description ?? "";
        clone.querySelector("#competencias_tecnicas").textContent = dado.items?.[2]?.description ?? "";
        clone.querySelector("#idioma_formacao").textContent = dado.items?.[3]?.description ?? "";

        document.body.appendChild(clone);
    });
}


console.log(opt)
switch (opt) {
    case "1":
        await prencherRelatorio(dados)
        break;
    case "2":
        await gerarTodos(dados)
        break;
    case "3":
        
        break;
    default:
        console.log("opção invalida")
        break;
}
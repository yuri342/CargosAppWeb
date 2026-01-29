
//Não usado por enquanto
// const btprint = document.getElementById("Btprint");
// btprint.addEventListener("click", () => {
//     btprint.style
//     window.print();
// });


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

    const sumarioText = dados.items[0].description
    const ResponsabilidadesText = dados.items[1].description
    const competencias_tecnicasText = dados.items[2].description
    const idioma_formacaoText = dados.items[3].description
    const tituloText = dados.name

    TituloRelatorio.textContent = tituloText
    sumario.textContent = sumarioText
    Responsabilidades.textContent = ResponsabilidadesText
    competencias_tecnicas.textContent = competencias_tecnicasText
    idioma_formacao.textContent = idioma_formacaoText
    
    console.log(dados.items[0].title)
}

await prencherRelatorio(dados)
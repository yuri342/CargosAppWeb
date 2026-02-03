
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

async function gerarTodos(dados) {
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


console.log(opt)
switch (opt) {
    case "1":
        await prencherRelatorio(dados)
        break;
    case "2":
        await gerarTodos(dados)
        break;
    default:
        console.log("opção invalida")
        break;
}
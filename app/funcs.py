import requests
import pathlib
import pandas as pd
import json

def gerarArrayComNomes(PathExcel):
    path_file = pathlib.Path(PathExcel)
    df = pd.read_excel(path_file)
    nomes = df['TITRED'].tolist()
    return nomes


def pequisarCargos(skey):
    session = requests.Session()

    url = "https://hcm-api.senior.com.br/frontend-api/career-path/job-position-career/1B4E037293114AFFB64D34BAD3BF6C1A/search"

    params = {
        "q": skey
    }

    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "user-role-active": "5DA297944E48475FBAFD66762B5B9ED4",
        "user-role-list": "5DA297944E48475FBAFD66762B5B9ED4",
        "zone-offset": "-180",
        "Authorization": "Bearer aOCXkwp4JMszJZcYHSu8dzsZk5yuUYo1"
    }

    session.cookies.update({
        "activeEmployeeId": "1B4E037293114AFFB64D34BAD3BF6C1A",
        "com.senior.domain": ".senior.com.br",
    })

    response = session.get(url, headers=headers, params=params)
    
    # Verifica se a requisição foi bem-sucedida
    if response.status_code == 200:
        return response.json()  # Retorna o JSON, não o objeto response
    else:
        print(f"Erro ao buscar '{skey}': Status {response.status_code}")
        return None


def SalvarJson(pathOut, Values):
    with open(pathOut, 'w', encoding='utf-8') as arquivoResultado:
        json.dump(Values, arquivoResultado, ensure_ascii=False, indent=4)


# Execução
nomes = gerarArrayComNomes(pathlib.Path('Cargos.xlsx'))
arraySalvos = []

for nome in nomes:
    print(f"Buscando: {nome}")
    resultado = pequisarCargos(nome)
    if resultado:  # Só adiciona se não for None
        arraySalvos.append({
            "cargo_pesquisado": nome,
            "resultado": resultado
        })

# Salvar o resultado
SalvarJson('resultados_cargos.json', arraySalvos)
print(f"Total de cargos salvos: {len(arraySalvos)}")
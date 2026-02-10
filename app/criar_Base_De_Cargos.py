import requests
import json


def obterDetalhesCompletos(job_position_id, workstation_id="undefined"):
    """
    Obtém os detalhes completos de um cargo específico
    
    Args:
        job_position_id: ID do cargo (ex: "3D552BFBBB9744858158E51046B2102A")
        workstation_id: ID da estação de trabalho (padrão: "undefined")
    
    Returns:
        dict: Dados do cargo em formato JSON ou None se houver erro
    """
    session = requests.Session()
    
    url = f"https://hcm-api.senior.com.br/frontend-api/jobdescription/jobpositionsummary"
    
    params = {
        "jobposition": job_position_id,
        "workstation": workstation_id
    }
    
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "if-modified-since": "Mon, 26 Jul 1997 05:00:00 GMT",
        "pragma": "no-cache",
        "user-role-active": "5DA297944E48475FBAFD66762B5B9ED4",
        "user-role-list": "5DA297944E48475FBAFD66762B5B9ED4",
        "zone-offset": "-180",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "keep-alive": "true",
        "Authorization": "Bearer 68c881pSKJhuYzjwbRFgHUmzMSj6myk9"
    }
    
    # Cookies
    session.cookies.update({
        "activeEmployeeId": "1B4E037293114AFFB64D34BAD3BF6C1A",
        "com.senior.domain": ".senior.com.br"
    })
    
    try:
        response = session.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Erro {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        print(f"Erro na requisição: {e}")
        return None


def extrairApenasIds(caminho_json):
    """Retorna apenas a lista de IDs"""
    with open(caminho_json, 'r', encoding='utf-8') as arquivo:
        dados = json.load(arquivo)
    
    ids = []
    for item in dados:
        for resultado in item['resultado']:
            ids.append(resultado['id'])
    
    return ids

def remover_repetidos_por_name(lista):
    vistos = set()
    resultado = []

    for item in lista:
        if not item:
            continue

        name = item.get("name")
        if not name:
            continue

        chave = name.strip().upper()

        if chave not in vistos:
            vistos.add(chave)
            resultado.append(item)

    return resultado


def SalvarJson(pathOut, Values):
    with open(pathOut, 'w', encoding='utf-8') as arquivoResultado:
        json.dump(Values, arquivoResultado, ensure_ascii=False, indent=4)

# Uso:
ids = extrairApenasIds('resultados_cargos.json')

# Exemplo de uso completo:
if __name__ == "__main__":
    descDeCargos = []
    print(len(ids))
    for id in ids:
        dados = obterDetalhesCompletos(id)
        descDeCargos.append(dados)

descDeCargosUnicos = remover_repetidos_por_name(descDeCargos)
SalvarJson("SalvosTesteDesc.json", descDeCargosUnicos)

print("Finalizado e salvo em SalvosTesteDesc.json")

    
import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# ---------- CONFIG ----------
TOKEN = "UeXktV0ck2DPMapLTy90D0NBBPAqoAkd"
MAX_WORKERS = 10
URL = "https://hcm-api.senior.com.br/frontend-api/jobdescription/jobpositionsummary"
# ----------------------------

def criar_sessao():
    session = requests.Session()
    session.headers.update({
        "accept": "application/json, text/plain, */*",
        "user-role-active": "5DA297944E48475FBAFD66762B5B9ED4",
        "user-role-list": "5DA297944E48475FBAFD66762B5B9ED4",
        "zone-offset": "-180",
        "Authorization": f"Bearer {TOKEN}"
    })
    session.cookies.update({
        "activeEmployeeId": "1B4E037293114AFFB64D34BAD3BF6C1A",
        "com.senior.domain": ".senior.com.br"
    })
    return session

def obter_detalhes(session, job_position_id):
    try:
        response = session.get(
            URL,
            params={"jobposition": job_position_id, "workstation": "undefined"},
            timeout=10
        )
        if response.status_code == 200:
            return response.json()
    except requests.RequestException:
        pass
    return None

def extrair_ids(caminho_json):
    with open(caminho_json, "r", encoding="utf-8") as f:
        dados = json.load(f)

    return [
        resultado["id"]
        for item in dados
        for resultado in item.get("resultado", [])
        if "id" in resultado
    ]

def salvar_json(path, dados):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

# ---------- EXECUÇÃO ----------
ids = extrair_ids("resultados_cargos2.json")
print(f"Total de IDs: {len(ids)}")

session = criar_sessao()

vistos = set()
resultados_unicos = []

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(obter_detalhes, session, _id): _id for _id in ids}

    for future in as_completed(futures):
        dados = future.result()
        if not dados:
            continue

        name = dados.get("name")
        if not name:
            continue

        chave = name.strip().upper()

        if chave not in vistos:
            vistos.add(chave)
            resultados_unicos.append(dados)

salvar_json("SalvosTesteDesc.json", resultados_unicos)

print(f"Finalizado. Registros únicos: {len(resultados_unicos)}")
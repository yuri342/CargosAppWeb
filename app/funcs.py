import requests
import pathlib
import pandas as pd
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# ---------- CONFIG ----------
URL = "https://hcm-api.senior.com.br/frontend-api/career-path/job-position-career/1B4E037293114AFFB64D34BAD3BF6C1A/search"
TOKEN = "UeXktV0ck2DPMapLTy90D0NBBPAqoAkd"
MAX_WORKERS = 10  # ajuste conforme sua internet/API limite
# ----------------------------

def gerarArrayComNomes(path_excel):
    df = pd.read_excel(path_excel, usecols=["TITRED"])
    return df["TITRED"].dropna().astype(str).tolist()

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
        "com.senior.domain": ".senior.com.br",
    })
    return session

def pesquisar_cargo(session, nome):
    try:
        response = session.get(URL, params={"q": nome}, timeout=10)
        if response.status_code == 200:
            return {"cargo_pesquisado": nome, "resultado": response.json()}
    except requests.RequestException:
        pass
    return None

def salvar_json(path_out, dados):
    with open(path_out, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

# ---------- EXECUÇÃO ----------
nomes = gerarArrayComNomes(pathlib.Path("Cargos2.xlsx"))

session = criar_sessao()
resultados = []

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(pesquisar_cargo, session, nome): nome for nome in nomes}
    
    for future in as_completed(futures):
        resultado = future.result()
        if resultado:
            resultados.append(resultado)

salvar_json("resultados_cargos2.json", resultados)
print(f"Total de cargos salvos: {len(resultados)}")
# ============================================================
# app.py
# Projeto: Grimório do Jogador
# Função:
# - Inicializa o Flask
# - Cria e atualiza automaticamente o banco SQLite
# - Renderiza a página principal
# - Fornece API CRUD para os personagens
# ============================================================

from flask import Flask, request, jsonify, render_template # type: ignore
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Caminho do banco SQLite
DB_PATH = "database.db"


# ============================================================
# Funções de banco
# ============================================================
def get_db():
    """
    Cria uma conexão com o banco e configura o retorno
    das linhas como dicionário-like (sqlite3.Row).
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_column(conn, table_name, column_name, column_type):
    """
    Garante que uma coluna exista na tabela.
    Se não existir, cria via ALTER TABLE.

    Isso ajuda a evoluir o projeto sem quebrar bancos antigos.
    """
    columns = conn.execute(f"PRAGMA table_info({table_name})").fetchall()
    existing = [col["name"] for col in columns]

    if column_name not in existing:
        conn.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")


def init_db():
    """
    Cria a tabela principal se não existir
    e garante as colunas necessárias.
    """
    conn = get_db()

    # Tabela principal
    conn.execute("""
        CREATE TABLE IF NOT EXISTS personagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            classe TEXT,
            raca TEXT,
            subraca TEXT,
            nivel INTEGER,
            criado_em TEXT,
            atualizado_em TEXT
        )
    """)

    # Colunas extras que queremos garantir
    required_columns = {
        "antecedente": "TEXT",
        "tendencia": "TEXT",
        "xp": "INTEGER DEFAULT 0",
        "nome_jogador": "TEXT",
        "idade": "TEXT",
        "altura": "TEXT",
        "peso": "TEXT",
        "olhos": "TEXT",
        "pele": "TEXT",
        "cabelos": "TEXT",

        "forca": "INTEGER DEFAULT 10",
        "destreza": "INTEGER DEFAULT 10",
        "constituicao": "INTEGER DEFAULT 10",
        "inteligencia": "INTEGER DEFAULT 10",
        "sabedoria": "INTEGER DEFAULT 10",
        "carisma": "INTEGER DEFAULT 10",

        "forca_final": "INTEGER DEFAULT 10",
        "destreza_final": "INTEGER DEFAULT 10",
        "constituicao_final": "INTEGER DEFAULT 10",
        "inteligencia_final": "INTEGER DEFAULT 10",
        "sabedoria_final": "INTEGER DEFAULT 10",
        "carisma_final": "INTEGER DEFAULT 10",

        "vida_max": "INTEGER DEFAULT 10",
        "vida_atual": "INTEGER DEFAULT 10",
        "vida_temp": "INTEGER DEFAULT 0",
        "ca": "INTEGER DEFAULT 10",
        "iniciativa": "INTEGER DEFAULT 0",
        "deslocamento": "TEXT DEFAULT '9 m'",
        "proficiencia": "INTEGER DEFAULT 2",
        "inspiracao": "TEXT DEFAULT 'Não'",
        "dados_vida": "TEXT",
        "sucessos_morte": "INTEGER DEFAULT 0",
        "fracassos_morte": "INTEGER DEFAULT 0",
        "sabedoria_passiva": "INTEGER DEFAULT 10",

        "testes_resistencia": "TEXT",
        "pericias": "TEXT",

        "ataques": "TEXT",
        "equipamentos": "TEXT",
        "caracteristicas_habilidades": "TEXT",
        "idiomas_proficiencias": "TEXT",

        "tracos_personalidade": "TEXT",
        "ideais": "TEXT",
        "ligacoes": "TEXT",
        "defeitos": "TEXT",

        "historia": "TEXT",
        "aparencia": "TEXT",
        "aliados_organizacoes": "TEXT",
        "tesouro": "TEXT",

        "classe_conjuradora": "TEXT",
        "habilidade_chave_magia": "TEXT",
        "cd_magia": "INTEGER",
        "bonus_ataque_magia": "INTEGER",

        "truques": "TEXT",
        "magias_nivel_1": "TEXT",
        "magias_nivel_2": "TEXT",
        "magias_nivel_3": "TEXT",
        "magias_nivel_4": "TEXT",
        "magias_nivel_5": "TEXT",
        "magias_nivel_6": "TEXT",
        "magias_nivel_7": "TEXT",
        "magias_nivel_8": "TEXT",
        "magias_nivel_9": "TEXT",

        "espacos_nivel_1_total": "INTEGER DEFAULT 0",
        "espacos_nivel_1_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_2_total": "INTEGER DEFAULT 0",
        "espacos_nivel_2_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_3_total": "INTEGER DEFAULT 0",
        "espacos_nivel_3_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_4_total": "INTEGER DEFAULT 0",
        "espacos_nivel_4_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_5_total": "INTEGER DEFAULT 0",
        "espacos_nivel_5_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_6_total": "INTEGER DEFAULT 0",
        "espacos_nivel_6_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_7_total": "INTEGER DEFAULT 0",
        "espacos_nivel_7_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_8_total": "INTEGER DEFAULT 0",
        "espacos_nivel_8_usados": "INTEGER DEFAULT 0",
        "espacos_nivel_9_total": "INTEGER DEFAULT 0",
        "espacos_nivel_9_usados": "INTEGER DEFAULT 0"
    }

    for column_name, column_type in required_columns.items():
        ensure_column(conn, "personagens", column_name, column_type)

    conn.commit()
    conn.close()


# Inicializa banco ao subir a aplicação
init_db()


# ============================================================
# Rotas de página
# ============================================================
@app.route("/")
def home():
    """
    Renderiza a página principal.
    O arquivo precisa estar em templates/index.html
    """
    return render_template("index.html")


# ============================================================
# API - Listar personagens
# ============================================================
@app.route("/personagens", methods=["GET"])
def listar_personagens():
    conn = get_db()
    personagens = conn.execute(
        "SELECT * FROM personagens ORDER BY id DESC"
    ).fetchall()
    conn.close()

    return jsonify([dict(p) for p in personagens])


# ============================================================
# Função auxiliar para montar payload
# ============================================================
def build_payload(data):
    """
    Normaliza os dados recebidos do frontend.
    Isso evita repetição no POST e no PUT.
    """
    return {
        "nome": data.get("nome", ""),
        "classe": data.get("classe", ""),
        "raca": data.get("raca", ""),
        "subraca": data.get("subraca", ""),
        "nivel": data.get("nivel", 1),

        "antecedente": data.get("antecedente", ""),
        "tendencia": data.get("tendencia", ""),
        "xp": data.get("xp", 0),
        "nome_jogador": data.get("nome_jogador", ""),
        "idade": data.get("idade", ""),
        "altura": data.get("altura", ""),
        "peso": data.get("peso", ""),
        "olhos": data.get("olhos", ""),
        "pele": data.get("pele", ""),
        "cabelos": data.get("cabelos", ""),

        "forca": data.get("forca", 10),
        "destreza": data.get("destreza", 10),
        "constituicao": data.get("constituicao", 10),
        "inteligencia": data.get("inteligencia", 10),
        "sabedoria": data.get("sabedoria", 10),
        "carisma": data.get("carisma", 10),

        "forca_final": data.get("forca_final", 10),
        "destreza_final": data.get("destreza_final", 10),
        "constituicao_final": data.get("constituicao_final", 10),
        "inteligencia_final": data.get("inteligencia_final", 10),
        "sabedoria_final": data.get("sabedoria_final", 10),
        "carisma_final": data.get("carisma_final", 10),

        "vida_max": data.get("vida_max", 10),
        "vida_atual": data.get("vida_atual", 10),
        "vida_temp": data.get("vida_temp", 0),
        "ca": data.get("ca", 10),
        "iniciativa": data.get("iniciativa", 0),
        "deslocamento": data.get("deslocamento", "9 m"),
        "proficiencia": data.get("proficiencia", 2),
        "inspiracao": data.get("inspiracao", "Não"),
        "dados_vida": data.get("dados_vida", ""),
        "sucessos_morte": data.get("sucessos_morte", 0),
        "fracassos_morte": data.get("fracassos_morte", 0),
        "sabedoria_passiva": data.get("sabedoria_passiva", 10),

        "testes_resistencia": data.get("testes_resistencia", ""),
        "pericias": data.get("pericias", ""),

        "ataques": data.get("ataques", ""),
        "equipamentos": data.get("equipamentos", ""),
        "caracteristicas_habilidades": data.get("caracteristicas_habilidades", ""),
        "idiomas_proficiencias": data.get("idiomas_proficiencias", ""),

        "tracos_personalidade": data.get("tracos_personalidade", ""),
        "ideais": data.get("ideais", ""),
        "ligacoes": data.get("ligacoes", ""),
        "defeitos": data.get("defeitos", ""),

        "historia": data.get("historia", ""),
        "aparencia": data.get("aparencia", ""),
        "aliados_organizacoes": data.get("aliados_organizacoes", ""),
        "tesouro": data.get("tesouro", ""),

        "classe_conjuradora": data.get("classe_conjuradora", ""),
        "habilidade_chave_magia": data.get("habilidade_chave_magia", ""),
        "cd_magia": data.get("cd_magia", None),
        "bonus_ataque_magia": data.get("bonus_ataque_magia", None),

        "truques": data.get("truques", ""),
        "magias_nivel_1": data.get("magias_nivel_1", ""),
        "magias_nivel_2": data.get("magias_nivel_2", ""),
        "magias_nivel_3": data.get("magias_nivel_3", ""),
        "magias_nivel_4": data.get("magias_nivel_4", ""),
        "magias_nivel_5": data.get("magias_nivel_5", ""),
        "magias_nivel_6": data.get("magias_nivel_6", ""),
        "magias_nivel_7": data.get("magias_nivel_7", ""),
        "magias_nivel_8": data.get("magias_nivel_8", ""),
        "magias_nivel_9": data.get("magias_nivel_9", ""),

        "espacos_nivel_1_total": data.get("espacos_nivel_1_total", 0),
        "espacos_nivel_1_usados": data.get("espacos_nivel_1_usados", 0),
        "espacos_nivel_2_total": data.get("espacos_nivel_2_total", 0),
        "espacos_nivel_2_usados": data.get("espacos_nivel_2_usados", 0),
        "espacos_nivel_3_total": data.get("espacos_nivel_3_total", 0),
        "espacos_nivel_3_usados": data.get("espacos_nivel_3_usados", 0),
        "espacos_nivel_4_total": data.get("espacos_nivel_4_total", 0),
        "espacos_nivel_4_usados": data.get("espacos_nivel_4_usados", 0),
        "espacos_nivel_5_total": data.get("espacos_nivel_5_total", 0),
        "espacos_nivel_5_usados": data.get("espacos_nivel_5_usados", 0),
        "espacos_nivel_6_total": data.get("espacos_nivel_6_total", 0),
        "espacos_nivel_6_usados": data.get("espacos_nivel_6_usados", 0),
        "espacos_nivel_7_total": data.get("espacos_nivel_7_total", 0),
        "espacos_nivel_7_usados": data.get("espacos_nivel_7_usados", 0),
        "espacos_nivel_8_total": data.get("espacos_nivel_8_total", 0),
        "espacos_nivel_8_usados": data.get("espacos_nivel_8_usados", 0),
        "espacos_nivel_9_total": data.get("espacos_nivel_9_total", 0),
        "espacos_nivel_9_usados": data.get("espacos_nivel_9_usados", 0),
    }


# ============================================================
# API - Criar personagem
# ============================================================
@app.route("/personagens", methods=["POST"])
def criar_personagem():
    data = request.json or {}
    payload = build_payload(data)
    agora = datetime.now().isoformat()

    conn = get_db()
    conn.execute("""
        INSERT INTO personagens (
            nome, classe, raca, subraca, nivel,
            antecedente, tendencia, xp, nome_jogador, idade, altura, peso, olhos, pele, cabelos,
            forca, destreza, constituicao, inteligencia, sabedoria, carisma,
            forca_final, destreza_final, constituicao_final, inteligencia_final, sabedoria_final, carisma_final,
            vida_max, vida_atual, vida_temp, ca, iniciativa, deslocamento, proficiencia, inspiracao, dados_vida,
            sucessos_morte, fracassos_morte, sabedoria_passiva,
            testes_resistencia, pericias,
            ataques, equipamentos, caracteristicas_habilidades, idiomas_proficiencias,
            tracos_personalidade, ideais, ligacoes, defeitos,
            historia, aparencia, aliados_organizacoes, tesouro,
            classe_conjuradora, habilidade_chave_magia, cd_magia, bonus_ataque_magia,
            truques, magias_nivel_1, magias_nivel_2, magias_nivel_3, magias_nivel_4,
            magias_nivel_5, magias_nivel_6, magias_nivel_7, magias_nivel_8, magias_nivel_9,
            espacos_nivel_1_total, espacos_nivel_1_usados,
            espacos_nivel_2_total, espacos_nivel_2_usados,
            espacos_nivel_3_total, espacos_nivel_3_usados,
            espacos_nivel_4_total, espacos_nivel_4_usados,
            espacos_nivel_5_total, espacos_nivel_5_usados,
            espacos_nivel_6_total, espacos_nivel_6_usados,
            espacos_nivel_7_total, espacos_nivel_7_usados,
            espacos_nivel_8_total, espacos_nivel_8_usados,
            espacos_nivel_9_total, espacos_nivel_9_usados,
            criado_em, atualizado_em
        )
        VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?
        )
    """, (
        payload["nome"], payload["classe"], payload["raca"], payload["subraca"], payload["nivel"],
        payload["antecedente"], payload["tendencia"], payload["xp"], payload["nome_jogador"], payload["idade"], payload["altura"], payload["peso"], payload["olhos"], payload["pele"], payload["cabelos"],
        payload["forca"], payload["destreza"], payload["constituicao"], payload["inteligencia"], payload["sabedoria"], payload["carisma"],
        payload["forca_final"], payload["destreza_final"], payload["constituicao_final"], payload["inteligencia_final"], payload["sabedoria_final"], payload["carisma_final"],
        payload["vida_max"], payload["vida_atual"], payload["vida_temp"], payload["ca"], payload["iniciativa"], payload["deslocamento"], payload["proficiencia"], payload["inspiracao"], payload["dados_vida"],
        payload["sucessos_morte"], payload["fracassos_morte"], payload["sabedoria_passiva"],
        payload["testes_resistencia"], payload["pericias"],
        payload["ataques"], payload["equipamentos"], payload["caracteristicas_habilidades"], payload["idiomas_proficiencias"],
        payload["tracos_personalidade"], payload["ideais"], payload["ligacoes"], payload["defeitos"],
        payload["historia"], payload["aparencia"], payload["aliados_organizacoes"], payload["tesouro"],
        payload["classe_conjuradora"], payload["habilidade_chave_magia"], payload["cd_magia"], payload["bonus_ataque_magia"],
        payload["truques"], payload["magias_nivel_1"], payload["magias_nivel_2"], payload["magias_nivel_3"], payload["magias_nivel_4"],
        payload["magias_nivel_5"], payload["magias_nivel_6"], payload["magias_nivel_7"], payload["magias_nivel_8"], payload["magias_nivel_9"],
        payload["espacos_nivel_1_total"], payload["espacos_nivel_1_usados"],
        payload["espacos_nivel_2_total"], payload["espacos_nivel_2_usados"],
        payload["espacos_nivel_3_total"], payload["espacos_nivel_3_usados"],
        payload["espacos_nivel_4_total"], payload["espacos_nivel_4_usados"],
        payload["espacos_nivel_5_total"], payload["espacos_nivel_5_usados"],
        payload["espacos_nivel_6_total"], payload["espacos_nivel_6_usados"],
        payload["espacos_nivel_7_total"], payload["espacos_nivel_7_usados"],
        payload["espacos_nivel_8_total"], payload["espacos_nivel_8_usados"],
        payload["espacos_nivel_9_total"], payload["espacos_nivel_9_usados"],
        agora, agora
    ))

    conn.commit()
    conn.close()

    return jsonify({"msg": "Personagem criado com sucesso!"}), 201


# ============================================================
# API - Atualizar personagem
# ============================================================
@app.route("/personagens/<int:personagem_id>", methods=["PUT"])
def atualizar_personagem(personagem_id):
    data = request.json or {}
    payload = build_payload(data)
    agora = datetime.now().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    personagem = cursor.execute(
        "SELECT * FROM personagens WHERE id = ?",
        (personagem_id,)
    ).fetchone()

    if not personagem:
        conn.close()
        return jsonify({"msg": "Personagem não encontrado."}), 404

    cursor.execute("""
        UPDATE personagens
        SET
            nome = ?, classe = ?, raca = ?, subraca = ?, nivel = ?,
            antecedente = ?, tendencia = ?, xp = ?, nome_jogador = ?, idade = ?, altura = ?, peso = ?, olhos = ?, pele = ?, cabelos = ?,
            forca = ?, destreza = ?, constituicao = ?, inteligencia = ?, sabedoria = ?, carisma = ?,
            forca_final = ?, destreza_final = ?, constituicao_final = ?, inteligencia_final = ?, sabedoria_final = ?, carisma_final = ?,
            vida_max = ?, vida_atual = ?, vida_temp = ?, ca = ?, iniciativa = ?, deslocamento = ?, proficiencia = ?, inspiracao = ?, dados_vida = ?,
            sucessos_morte = ?, fracassos_morte = ?, sabedoria_passiva = ?,
            testes_resistencia = ?, pericias = ?,
            ataques = ?, equipamentos = ?, caracteristicas_habilidades = ?, idiomas_proficiencias = ?,
            tracos_personalidade = ?, ideais = ?, ligacoes = ?, defeitos = ?,
            historia = ?, aparencia = ?, aliados_organizacoes = ?, tesouro = ?,
            classe_conjuradora = ?, habilidade_chave_magia = ?, cd_magia = ?, bonus_ataque_magia = ?,
            truques = ?, magias_nivel_1 = ?, magias_nivel_2 = ?, magias_nivel_3 = ?, magias_nivel_4 = ?,
            magias_nivel_5 = ?, magias_nivel_6 = ?, magias_nivel_7 = ?, magias_nivel_8 = ?, magias_nivel_9 = ?,
            espacos_nivel_1_total = ?, espacos_nivel_1_usados = ?,
            espacos_nivel_2_total = ?, espacos_nivel_2_usados = ?,
            espacos_nivel_3_total = ?, espacos_nivel_3_usados = ?,
            espacos_nivel_4_total = ?, espacos_nivel_4_usados = ?,
            espacos_nivel_5_total = ?, espacos_nivel_5_usados = ?,
            espacos_nivel_6_total = ?, espacos_nivel_6_usados = ?,
            espacos_nivel_7_total = ?, espacos_nivel_7_usados = ?,
            espacos_nivel_8_total = ?, espacos_nivel_8_usados = ?,
            espacos_nivel_9_total = ?, espacos_nivel_9_usados = ?,
            atualizado_em = ?
        WHERE id = ?
    """, (
        payload["nome"], payload["classe"], payload["raca"], payload["subraca"], payload["nivel"],
        payload["antecedente"], payload["tendencia"], payload["xp"], payload["nome_jogador"], payload["idade"], payload["altura"], payload["peso"], payload["olhos"], payload["pele"], payload["cabelos"],
        payload["forca"], payload["destreza"], payload["constituicao"], payload["inteligencia"], payload["sabedoria"], payload["carisma"],
        payload["forca_final"], payload["destreza_final"], payload["constituicao_final"], payload["inteligencia_final"], payload["sabedoria_final"], payload["carisma_final"],
        payload["vida_max"], payload["vida_atual"], payload["vida_temp"], payload["ca"], payload["iniciativa"], payload["deslocamento"], payload["proficiencia"], payload["inspiracao"], payload["dados_vida"],
        payload["sucessos_morte"], payload["fracassos_morte"], payload["sabedoria_passiva"],
        payload["testes_resistencia"], payload["pericias"],
        payload["ataques"], payload["equipamentos"], payload["caracteristicas_habilidades"], payload["idiomas_proficiencias"],
        payload["tracos_personalidade"], payload["ideais"], payload["ligacoes"], payload["defeitos"],
        payload["historia"], payload["aparencia"], payload["aliados_organizacoes"], payload["tesouro"],
        payload["classe_conjuradora"], payload["habilidade_chave_magia"], payload["cd_magia"], payload["bonus_ataque_magia"],
        payload["truques"], payload["magias_nivel_1"], payload["magias_nivel_2"], payload["magias_nivel_3"], payload["magias_nivel_4"],
        payload["magias_nivel_5"], payload["magias_nivel_6"], payload["magias_nivel_7"], payload["magias_nivel_8"], payload["magias_nivel_9"],
        payload["espacos_nivel_1_total"], payload["espacos_nivel_1_usados"],
        payload["espacos_nivel_2_total"], payload["espacos_nivel_2_usados"],
        payload["espacos_nivel_3_total"], payload["espacos_nivel_3_usados"],
        payload["espacos_nivel_4_total"], payload["espacos_nivel_4_usados"],
        payload["espacos_nivel_5_total"], payload["espacos_nivel_5_usados"],
        payload["espacos_nivel_6_total"], payload["espacos_nivel_6_usados"],
        payload["espacos_nivel_7_total"], payload["espacos_nivel_7_usados"],
        payload["espacos_nivel_8_total"], payload["espacos_nivel_8_usados"],
        payload["espacos_nivel_9_total"], payload["espacos_nivel_9_usados"],
        agora,
        personagem_id
    ))

    conn.commit()
    conn.close()

    return jsonify({"msg": "Personagem atualizado com sucesso!"})


# ============================================================
# API - Excluir personagem
# ============================================================
@app.route("/personagens/<int:personagem_id>", methods=["DELETE"])
def deletar_personagem(personagem_id):
    conn = get_db()
    cursor = conn.cursor()

    personagem = cursor.execute(
        "SELECT * FROM personagens WHERE id = ?",
        (personagem_id,)
    ).fetchone()

    if not personagem:
        conn.close()
        return jsonify({"msg": "Personagem não encontrado."}), 404

    cursor.execute("DELETE FROM personagens WHERE id = ?", (personagem_id,))
    conn.commit()
    conn.close()

    return jsonify({"msg": "Personagem deletado com sucesso!"})


# ============================================================
# Inicialização da aplicação
# ============================================================
if __name__ == "__main__":
    app.run(debug=True)
# ============================================================
# app.py
# Grimório do Jogador
# ------------------------------------------------------------
# Backend Flask + SQLite para o site de criação de fichas.
# Nesta versão, a maior parte dos dados do personagem é salva
# em JSON, o que facilita evoluir o projeto sem quebrar o banco.
# ============================================================

from flask import Flask, jsonify, render_template, request # type: ignore
import json
import sqlite3
from datetime import datetime

app = Flask(__name__)
DB_PATH = "database.db"


def get_db():
    """Abre conexão com o SQLite."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Cria a tabela principal se ela ainda não existir."""
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS personagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            classe TEXT,
            raca TEXT,
            nivel INTEGER DEFAULT 1,
            alinhamento TEXT,
            vida_max INTEGER DEFAULT 10,
            ca INTEGER DEFAULT 10,
            proficiencia INTEGER DEFAULT 2,
            payload TEXT NOT NULL,
            criado_em TEXT NOT NULL,
            atualizado_em TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


@app.route("/")
def home():
    """Entrega a página principal do site."""
    return render_template("index.html")


@app.route("/api/characters", methods=["GET"])
def list_characters():
    """Lista os personagens já salvos para o dashboard."""
    conn = get_db()
    rows = conn.execute(
        "SELECT id, nome, classe, raca, nivel, alinhamento, vida_max, ca, proficiencia, atualizado_em FROM personagens ORDER BY atualizado_em DESC"
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route("/api/characters/<int:character_id>", methods=["GET"])
def get_character(character_id):
    """Busca um personagem específico."""
    conn = get_db()
    row = conn.execute("SELECT * FROM personagens WHERE id = ?", (character_id,)).fetchone()
    conn.close()

    if not row:
        return jsonify({"msg": "Personagem não encontrado."}), 404

    payload = json.loads(row["payload"])
    payload["id"] = row["id"]
    payload["criado_em"] = row["criado_em"]
    payload["atualizado_em"] = row["atualizado_em"]
    return jsonify(payload)


@app.route("/api/characters", methods=["POST"])
def create_character():
    """Cria um personagem novo."""
    data = request.get_json(silent=True) or {}
    nome = (data.get("nome") or "").strip()

    if not nome:
        return jsonify({"msg": "O nome do personagem é obrigatório."}), 400

    now = datetime.now().isoformat(timespec="seconds")
    payload_json = json.dumps(data, ensure_ascii=False)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO personagens (
            nome, classe, raca, nivel, alinhamento,
            vida_max, ca, proficiencia, payload, criado_em, atualizado_em
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            nome,
            data.get("classe", ""),
            data.get("raca", ""),
            int(data.get("nivel", 1) or 1),
            data.get("alinhamento", ""),
            int(data.get("vida_max", 10) or 10),
            int(data.get("ca", 10) or 10),
            int(data.get("proficiencia", 2) or 2),
            payload_json,
            now,
            now,
        ),
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({"msg": "Personagem criado com sucesso!", "id": new_id}), 201


@app.route("/api/characters/<int:character_id>", methods=["PUT"])
def update_character(character_id):
    """Atualiza um personagem existente."""
    data = request.get_json(silent=True) or {}
    nome = (data.get("nome") or "").strip()

    if not nome:
        return jsonify({"msg": "O nome do personagem é obrigatório."}), 400

    now = datetime.now().isoformat(timespec="seconds")
    payload_json = json.dumps(data, ensure_ascii=False)

    conn = get_db()
    exists = conn.execute("SELECT id FROM personagens WHERE id = ?", (character_id,)).fetchone()
    if not exists:
        conn.close()
        return jsonify({"msg": "Personagem não encontrado."}), 404

    conn.execute(
        """
        UPDATE personagens
        SET nome = ?, classe = ?, raca = ?, nivel = ?, alinhamento = ?,
            vida_max = ?, ca = ?, proficiencia = ?, payload = ?, atualizado_em = ?
        WHERE id = ?
        """,
        (
            nome,
            data.get("classe", ""),
            data.get("raca", ""),
            int(data.get("nivel", 1) or 1),
            data.get("alinhamento", ""),
            int(data.get("vida_max", 10) or 10),
            int(data.get("ca", 10) or 10),
            int(data.get("proficiencia", 2) or 2),
            payload_json,
            now,
            character_id,
        ),
    )
    conn.commit()
    conn.close()
    return jsonify({"msg": "Personagem atualizado com sucesso!"})


@app.route("/api/characters/<int:character_id>", methods=["DELETE"])
def delete_character(character_id):
    """Exclui um personagem."""
    conn = get_db()
    exists = conn.execute("SELECT id FROM personagens WHERE id = ?", (character_id,)).fetchone()
    if not exists:
        conn.close()
        return jsonify({"msg": "Personagem não encontrado."}), 404

    conn.execute("DELETE FROM personagens WHERE id = ?", (character_id,))
    conn.commit()
    conn.close()
    return jsonify({"msg": "Personagem excluído com sucesso!"})


if __name__ == "__main__":
    app.run(debug=True)

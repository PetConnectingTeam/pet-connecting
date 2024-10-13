from flask import Flask, jsonify, request
import mysql.connector

app = Flask(__name__)

# Configuración de la base de datos
config = {
    'user': 'root',
    'password': 'rootpassword',
    'host': 'db',  # Nombre del servicio del contenedor en docker-compose
    'database': 'mydb'
}

@app.route('/data', methods=['GET'])
def get_data():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM mytable')
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

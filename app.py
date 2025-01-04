from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  
model = joblib.load('demand_prediction_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        
        data = request.json

        stock_level = float(data['stockLevel'])
        reorder_point = float(data['reorderPoint'])
        year = int(data['year'])
        month = int(data['month'])
        prediction = model.predict([[stock_level, reorder_point, year, month]])

        return jsonify({'prediction': round(prediction[0], 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')

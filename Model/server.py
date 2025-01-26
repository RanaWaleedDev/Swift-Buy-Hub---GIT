import json
from flask import Flask, request , jsonify
from flask_cors import CORS, cross_origin

from sklearn import preprocessing
import pickle
import pandas as pd
import numpy as np
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
from sklearn.preprocessing import LabelEncoder

with open('model_car.pkl', 'rb') as f:
    model = pickle.load(f)

with open('model (1).pkl', 'rb') as f:
    laptop_model = pickle.load(f)


def preprocess_input(input_data):
    query = pd.DataFrame([input_data])
    label_encoder = LabelEncoder()
    categorical_cols = ['Company', 'TypeName', 'Cpu brand', 'Gpu brand', 'os']
    for col in categorical_cols:
        query[col] = label_encoder.fit_transform(query[col])
    return query

def predict_laptop_price1(transformed_data):
    predicted_price = laptop_model.predict(transformed_data)
    return predicted_price[0]    

@app.route('/api/post/laptopModel', methods=['POST'])
def predict_laptop_price():
    data = request.json
    print(data,'data')
    # Extract laptop features from the request data
    # Make sure the keys match the keys used when sending the request from the frontend
  
    
  
    second = data.get('HDD')
    first = data.get('SSD')
 
    Layer1HDD = 1 if second is not None else 0
    Layer1SSD = 1 if first is not None else 0
    Layer2HDD = 1 if second is not None else 0
    Layer2SSD = 1 if first is not None else 0
    Layer1Hybrid=0
    Layer1Flash_Storage=0
    Layer2Hybrid=0
    Layer2Flash_Storage=0
   
    user_input = {
        'Company': data.get('company'),
        'TypeName': data.get('typeName'),
        'Ram':  data.get('Ram'),
        'Weight': data.get('Weight'),
        'Touchscreen': data.get('Touchscreen'),# yes = 1 and no = 1
        'Ips':data.get('Ips'),# yes = 1 and no = 1
        'ppi':  data.get('ppi') , # Pixels per inch
        'Cpu brand': data.get('Cpubrand'),
        'first':data.get('SSD'),# for ssd
        'second': data.get('HDD'),#for hdd
        'Layer1HDD': Layer1HDD,
        "Layer1SSD": Layer1SSD,
        'Layer1Hybrid': Layer1Hybrid,
        'Layer1Flash_Storage': Layer1Flash_Storage,
        'Layer2HDD': Layer2HDD,
        "Layer2SSD": Layer2SSD,
        'Layer2Hybrid': Layer2Hybrid,
        'Layer2Flash_Storage': Layer2Flash_Storage,
        'Gpu brand': 'Nvidia',
        'os': 'Windows'
    }

    # Preprocess the input data
    transformed_input = preprocess_input(user_input)
    # Make predictions
    predicted_price = predict_laptop_price1(transformed_input)
    # Convert the predicted price back to its original scale
    actual_predicted_price = np.exp(predicted_price)
    # Print the predicted price
    print("Predicted price of the laptop:", actual_predicted_price)
    # Return the predicted price as a JSON response
    return jsonify({'price': actual_predicted_price})


def price_predict(ec,myear,mile,company,varient,etype,trans,btype):
  print(ec,'ec',myear,'myear',mile,'Mileage',company,'company',varient,'varient',etype,'etype',trans,'trans',btype,'btype')
  cin=pd.DataFrame({'Engine Capacity':[ec],
                   'Model Year':[myear],
                   'Mileage':[mile],
                   'Company':[company],
                    'Vaarient':[varient],
                   'Engine Type':[etype],
                   'Transmission':[trans],
                   'Body Type':[btype]})
  label_encoder = preprocessing.LabelEncoder()
  encoded_company = label_encoder.fit_transform(cin.Company)
  encoded_varient = label_encoder.fit_transform(cin.Vaarient)
  encoded_company = pd.Series(encoded_company)
  encoded_varient = pd.Series(encoded_varient)
  cin['Company'] = encoded_company
  cin['Vaarient'] = encoded_varient
  cout=model.predict(cin)
  cout = cout.tolist()
    
  result_df = pd.DataFrame({'prediction': cout})
  json_result = result_df.to_json(orient='records')
  parsed_json = json.loads(json_result )

  prediction = parsed_json[0]['prediction']

  print(prediction,'presdictiosdnsd')
    
  return prediction



@app.route('/api/post/carmodel', methods=['POST'])
def imageValidater():
    data = request.json
    param1 = data.get('engineCapacity')
    param2 = data.get('modelYear')
    param3 = data.get('mileage')
    param4 = data.get('company')
    param5 = data.get('variant')
    param6 = data.get('engineType')
    param7 = data.get('transmission')
    param8 = data.get('bodyType')
    return jsonify({'price':price_predict(param1,param2,param3,param4,param5,param6,param7,param8)})




if __name__ == '__main__':
    app.run(debug=True, port=8000) 

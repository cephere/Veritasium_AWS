from flask import Flask, request, jsonify #request is for getting input values for database
from flask_cors import CORS
import os
import numpy as np
from PIL import Image
import pyodbc #this is for database
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app=Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/algo", methods=["GET"])
def algo():
    # Path to the dataset
    dataset_path = r"C:\Users\R3v3rt\Documents\School\[THESIS] Veritasium\[CODE]\backend\train"

    # Initialize lists for images and labels
    images = []
    labels = []

    # Iterate through 'fake' and 'real' folders
    for label in ['fake', 'real']:
        folder_path = os.path.join(dataset_path, label)
        for img_name in os.listdir(folder_path):
            img_path = os.path.join(folder_path, img_name)
            try:
                # Load the image and resize to a fixed size (e.g., 64x64)
                img = Image.open(img_path).resize((64, 64))
                img_array = np.array(img)  # Convert image to a NumPy array
                images.append(img_array)  # Append image data
                labels.append(label)      # Append label
            except Exception as e:
                print(f"Error loading {img_path}: {e}")

    # Convert lists to NumPy arrays
    X = np.array(images)
    y = np.array([1 if label == 'real' else 0 for label in labels])  # Convert labels to binary (1 for 'real', 0 for 'fake')

    # Normalize pixel values to [0, 1]
    X = X / 255.0

    # Flatten images (if using traditional ML models)
    X_flat = X.reshape(X.shape[0], -1)

    # Split into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_flat, y, test_size=0.2, random_state=42)

    # Define models
    models = [
        LogisticRegression(solver='liblinear')
    ]
    
    results = []

    # Train and evaluate each model
    for i in models:
        reg = i.fit(X_train, y_train)
        y_pred = reg.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred) * 100
        
        results.append({"model_name": reg.__class__.__name__, "accuracy": round(accuracy, 5)})
        
    return jsonify(results)

conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=.\SQLEXPRESS;"
    "DATABASE=Thesis;"
    "Trusted_Connection=yes;"
)
conn = pyodbc.connect(conn_str)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['name']
    email = data['email']
    password = data['password']
    
    try:
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()    
            # Check if the username already exists
            cursor.execute("SELECT * FROM USERS WHERE USERNAME = ?", (username,))
            if cursor.fetchone():
                return jsonify({"error": "Username already belongs to an account!"}), 400
            
            # Check if the email already exists
            cursor.execute("SELECT * FROM USERS WHERE EMAIL = ?", (email,))
            if cursor.fetchone():
                return jsonify({"error": "Email already belongs to an account!"}), 400
            
            cursor.execute("INSERT INTO USERS (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)", 
                        (username, email, password))
            conn.commit()
            return jsonify({"message": "Account creation successful!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
        
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['name']
    password = data['password']
    is_admin = data.get('isAdmin', False)

    cursor = conn.cursor()
    try:
        if is_admin:
            cursor.execute("SELECT * FROM USERS WHERE USERNAME = ? AND PASSWORD = ? AND USER_ID IN (1, 2)", (username, password))
        else:
            cursor.execute("SELECT * FROM USERS WHERE USERNAME = ? AND PASSWORD = ?", (username, password))

        user = cursor.fetchone()
        if user:
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Invalid credentials!"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        
@app.route('/api/counts', methods=['GET'])
def counts():
    try:
        cursor = conn.cursor()
        
        cursor.execute("""SELECT 
            COUNT(CASE WHEN NEWS_PREDICTION = 'FAKE' AND ADMIN_EVALUATION = 'FALSE' THEN 1 END) AS Fake_False_Count,
            COUNT(CASE WHEN NEWS_PREDICTION = 'FAKE' AND ADMIN_EVALUATION = 'TRUE' THEN 1 END) AS Fake_True_Count,
            COUNT(CASE WHEN NEWS_PREDICTION = 'REAL' AND ADMIN_EVALUATION = 'FALSE' THEN 1 END) AS Real_False_Count,
            COUNT(CASE WHEN NEWS_PREDICTION = 'REAL' AND ADMIN_EVALUATION = 'TRUE' THEN 1 END) AS Real_True_Count FROM RECORDS""")
        counts = cursor.fetchall()

        # Convert records to a list of dictionaries
        counts_list = []
        for row in counts:
            counts_list.append({
                'FalseNegative': row.Fake_False_Count,
                'TrueNegative': row.Fake_True_Count,
                'FalsePositive': row.Real_False_Count,
                'TruePositive': row.Real_True_Count
            })

        return jsonify(counts_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        
@app.route('/api/users', methods=['GET'])
def users():
    try:
        cursor = conn.cursor()
        
        cursor.execute("SELECT USER_ID, USERNAME, EMAIL FROM USERS")
        users = cursor.fetchall()

        # Convert records to a list of dictionaries
        users_list = []
        for row in users:
            users_list.append({
                'userID': row.USER_ID,
                'username': row.USERNAME,
                'email': row.EMAIL
            })

        return jsonify(users_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()        

@app.route('/api/records', methods=['GET'])
def records():
    try:
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM RECORDS")
        records = cursor.fetchall()

        # Convert records to a list of dictionaries
        records_list = []
        for row in records:
            records_list.append({
                'newsId': row.NEWS_ID,
                'userId': row.USER_ID,
                'newsType': row.NEWS_TYPE,
                'newsLink': row.NEWS_LINK,
                'newsPrediction': row.NEWS_PREDICTION,
                'userEvaluation': row.USER_EVALUATION,
                'adminEvaluation': row.ADMIN_EVALUATION,
                'dateOfSubmission': row.SUBMISSION_DATE.strftime('%Y-%m-%d')  # Format date
            })

        return jsonify(records_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        
@app.route('/api/search', methods=['GET'])
def searchrecords():
    search = request.args.get('search', '')
    filter_option = request.args.get('filter', 'All')  # Get the filter option from the request
    cursor = conn.cursor()
    
    # Base query
    query = "SELECT * FROM RECORDS"
    params = []

    # Modify the query based on the selected filter option
    if filter_option == 'UserID':
        query += " WHERE USER_ID LIKE ?"
        params = ['%' + search + '%']
    elif filter_option == 'NewsType':
        query += " WHERE NEWS_TYPE LIKE ?"
        params = ['%' + search + '%']
    elif filter_option == 'All':
        query += " WHERE USER_ID LIKE ? OR NEWS_TYPE LIKE ? OR NEWS_LINK LIKE ? OR NEWS_PREDICTION LIKE ? OR USER_EVALUATION LIKE ? OR ADMIN_EVALUATION LIKE ? OR SUBMISSION_DATE LIKE ?"
        params = ['%' + search + '%'] * 7  # Create a list of parameters for the query

    cursor.execute(query, params)
    records = cursor.fetchall()
    
    # Convert records to a list of dictionaries
    records_list = [{'newsId': r[0], 'userId': r[1], 'newsType': r[2], 'newsLink': r[3], 
                     'newsPrediction': r[4], 'userEvaluation': r[5], 
                     'adminEvaluation': r[6], 'dateOfSubmission': r[7]} for r in records]
    
    cursor.close()
    return jsonify(records_list)

@app.route('/api/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.get_json()
    admin_evaluation = data.get('adminEvaluation')
    
    try:
        cursor = conn.cursor()
        
        # Update the record in the database
        cursor.execute("UPDATE RECORDS SET ADMIN_EVALUATION = ? WHERE NEWS_ID = ?", (admin_evaluation, record_id))
        conn.commit()
        return jsonify({'message': 'Record updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        
if __name__ == "__main__":
    app.run(debug=True, port=8080)
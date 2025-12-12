from flask import Flask, request, jsonify
import cv2
import numpy as np
import face_recognition
import os
import pickle
from pathlib import Path
import sqlite3
import json

app = Flask(__name__)

# Get absolute path to project root
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Storage paths (absolute)
ENCODINGS_DIR = os.path.join(PROJECT_ROOT, 'face_encodings')
ENCODINGS_FILE = os.path.join(ENCODINGS_DIR, 'encodings.pkl')
TRAINING_DIR = os.path.join(PROJECT_ROOT, 'face_training')
DB_PATH = os.path.join(PROJECT_ROOT, 'database', 'database.sqlite')
STORAGE_DIR = os.path.join(PROJECT_ROOT, 'storage', 'app', 'public', 'drivers')

# Ensure directories exist
Path(ENCODINGS_DIR).mkdir(exist_ok=True)
Path(TRAINING_DIR).mkdir(exist_ok=True)

# Load encodings on startup
encodings_data = {'encodings': [], 'names': [], 'driver_ids': []}

def load_encodings():
    global encodings_data
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, 'rb') as f:
            encodings_data = pickle.load(f)
    else:
        encodings_data = {'encodings': [], 'names': [], 'driver_ids': []}

def save_encodings():
    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump(encodings_data, f)

def auto_train_from_db():
    """Auto-train all drivers with profile images on startup"""
    global encodings_data
    
    try:
        if not os.path.exists(DB_PATH):
            print(f"⚠️  Database not found at {DB_PATH}, skipping auto-train")
            return 0
        
        print(f"📂 Database path: {DB_PATH}")
        print(f"📂 Storage path: {STORAGE_DIR}")
        
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get all drivers with images
        cursor.execute('''
            SELECT id, name, image FROM drivers 
            WHERE image IS NOT NULL AND image != ''
        ''')
        drivers = cursor.fetchall()
        conn.close()
        
        print(f"🔍 Found {len(drivers)} drivers with images in database")
        
        trained_count = 0
        
        for driver in drivers:
            driver_id = driver['id']
            name = driver['name']
            image_path = driver['image']
            
            # Skip if already trained
            if driver_id in encodings_data['driver_ids']:
                print(f"  ⏭️  Skipped (already trained): {name} (ID: {driver_id})")
                continue
            
            # Extract filename from path (stored as "drivers/filename.jpg")
            # Get just the filename part
            filename = os.path.basename(image_path)
            full_path = os.path.join(STORAGE_DIR, filename)
            
            if not os.path.exists(full_path):
                print(f"  ✗ Image not found: {full_path}")
                continue
            
            try:
                # Read and process image
                img = cv2.imread(full_path)
                if img is None:
                    print(f"  ✗ Failed to read image: {name}")
                    continue
                
                rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                face_encodings = face_recognition.face_encodings(rgb_img)
                
                # Only train if exactly one face detected
                if len(face_encodings) == 0:
                    print(f"  ✗ No face detected: {name} (ID: {driver_id})")
                elif len(face_encodings) > 1:
                    print(f"  ✗ Multiple faces detected ({len(face_encodings)}): {name} (ID: {driver_id})")
                else:
                    encoding = face_encodings[0]
                    encodings_data['encodings'].append(encoding)
                    encodings_data['names'].append(name)
                    encodings_data['driver_ids'].append(driver_id)
                    trained_count += 1
                    print(f"  ✓ Trained: {name} (ID: {driver_id})")
            except Exception as e:
                print(f"  ✗ Error training {name}: {str(e)}")
                continue
        
        if trained_count > 0:
            save_encodings()
        
        return trained_count
        
    except Exception as e:
        print(f"⚠️  Auto-train error: {str(e)}")
        return 0

# Load on startup
load_encodings()

@app.route('/', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'Face Recognition Service',
        'trained_faces': len(encodings_data['encodings']),
        'endpoints': {
            'POST /train_face': 'Train a new driver face',
            'POST /recognize_face': 'Recognize and login with face',
            'POST /detect_faces': 'Detect faces in image',
            'GET /status': 'Get training status',
            'POST /reset': 'Reset all trained faces'
        }
    })

@app.route('/detect_faces', methods=['POST'])
def detect_faces():
    """Detect faces in image"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image'}), 400

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )

    result = [
        {'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)} 
        for (x, y, w, h) in faces
    ]
    return jsonify({'faces': result, 'count': len(result)})

@app.route('/train_face', methods=['POST'])
def train_face():
    """Train/register a driver's face"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        if 'driver_id' not in request.form:
            return jsonify({'error': 'driver_id required'}), 400
        if 'name' not in request.form:
            return jsonify({'error': 'name required'}), 400

        driver_id = request.form.get('driver_id')
        name = request.form.get('name')
        file = request.files['image']

        # Read image
        img_data = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Invalid image'}), 400

        # Convert BGR to RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect face encodings
        face_encodings = face_recognition.face_encodings(rgb_img)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'No face detected in image'}), 400
        
        if len(face_encodings) > 1:
            return jsonify({'error': 'Multiple faces detected. Please provide image with only one face'}), 400

        # Store encoding
        encoding = face_encodings[0]
        encodings_data['encodings'].append(encoding)
        encodings_data['names'].append(name)
        encodings_data['driver_ids'].append(int(driver_id))

        save_encodings()

        return jsonify({
            'success': True,
            'message': f'Face registered for {name}',
            'driver_id': driver_id
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recognize_face', methods=['POST'])
def recognize_face():
    """Recognize a face and return driver info"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        img_data = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Invalid image'}), 400

        # No encodings trained yet
        if len(encodings_data['encodings']) == 0:
            return jsonify({'error': 'No faces trained yet'}), 404

        # Convert to RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Get face encodings from uploaded image
        face_encodings_in_image = face_recognition.face_encodings(rgb_img)
        
        if len(face_encodings_in_image) == 0:
            return jsonify({'error': 'No face detected'}), 400

        # Compare with trained encodings
        test_encoding = face_encodings_in_image[0]
        matches = face_recognition.compare_faces(
            encodings_data['encodings'], 
            test_encoding,
            tolerance=0.6  # Lower = stricter matching
        )
        face_distances = face_recognition.face_distance(
            encodings_data['encodings'],
            test_encoding
        )

        # Find best match
        best_match_idx = np.argmin(face_distances)
        best_match_distance = face_distances[best_match_idx]

        if best_match_distance < 0.6:  # Match found
            driver_id = encodings_data['driver_ids'][best_match_idx]
            name = encodings_data['names'][best_match_idx]
            
            return jsonify({
                'success': True,
                'driver_id': driver_id,
                'name': name,
                'confidence': float(1 - best_match_distance),
                'message': f'Face recognized: {name}'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Face not recognized',
                'best_distance': float(best_match_distance)
            }), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    """Get training status"""
    return jsonify({
        'trained_faces': len(encodings_data['encodings']),
        'drivers': encodings_data['driver_ids'],
        'names': encodings_data['names']
    })

@app.route('/train-all', methods=['POST'])
def train_all():
    """Train all drivers from database (called by Laravel)"""
    global encodings_data
    try:
        print("\n🔄 Manual training request received...")
        trained = auto_train_from_db()
        return jsonify({
            'success': True,
            'message': f'Trained {trained} drivers',
            'total_trained_faces': len(encodings_data['encodings']),
            'driver_ids': encodings_data['driver_ids']
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/reset', methods=['POST'])
def reset():
    """Reset all trained faces"""
    global encodings_data
    encodings_data = {'encodings': [], 'names': [], 'driver_ids': []}
    
    if os.path.exists(ENCODINGS_FILE):
        os.remove(ENCODINGS_FILE)
    
    return jsonify({'success': True, 'message': 'All trained faces reset'})

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Starting Face Recognition Service...")
    print("="*60)
    
    # Load existing encodings
    print(f"📂 Loaded cached encodings: {len(encodings_data['encodings'])} faces")
    
    # Auto-train from database
    print("🔍 Auto-training from database...")
    newly_trained = auto_train_from_db()
    print(f"✅ Auto-trained: {newly_trained} new drivers")
    
    print(f"📊 Total trained faces: {len(encodings_data['encodings'])}")
    print("="*60)
    print("Available endpoints:")
    print("  GET  http://localhost:5000/           - Health check")
    print("  POST http://localhost:5000/detect_faces - Detect faces")
    print("  POST http://localhost:5000/train_face  - Train single driver face")
    print("  POST http://localhost:5000/train-all   - Train ALL drivers from DB")
    print("  POST http://localhost:5000/recognize_face - Recognize face")
    print("  GET  http://localhost:5000/status     - Training status")
    print("  POST http://localhost:5000/reset      - Reset all faces")
    print("="*60 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=False)
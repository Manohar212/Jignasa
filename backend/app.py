import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import db
import random
import time
import base64
# import cv2 # Uncomment for real CV usage
# import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jignasa_secret_key'
CORS(app)
db.init_app(app)

# Updated SocketIO config for better stability
socketio = SocketIO(
    app, 
    cors_allowed_origins="*", 
    async_mode='eventlet', 
    ping_timeout=10, 
    ping_interval=5
)

# --- Error Handling for SocketIO ---
@socketio.on_error_default
def default_error_handler(e):
    print(f"SocketIO Error: {e}")
    # In production, log to a monitoring service

# --- Mock Data Stores ---
# Store faculty profile in memory for demo purposes
faculty_profile_store = {
    "name": "Dr. Robert Chen",
    "email": "robert.chen@university.edu",
    "faculty_id": "FAC-10234"
}

# --- Auth Routes ---
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    # In production: Verify password hash from DB
    return jsonify({"token": "jwt_token_example", "role": "student", "name": "John Doe"}), 200

# --- Profile Routes (Faculty) ---
@app.route('/api/faculty/profile/current', methods=['GET'])
def get_faculty_profile():
    return jsonify(faculty_profile_store)

@app.route('/api/faculty/profile/update', methods=['PUT'])
def update_faculty_profile():
    data = request.json
    
    # Update in-memory store
    if 'name' in data:
        faculty_profile_store['name'] = data['name']
    if 'email' in data:
        faculty_profile_store['email'] = data['email']
    
    return jsonify({
        "message": "Profile updated successfully",
        "profile": faculty_profile_store
    })

# --- Group Routes ---
@app.route('/api/groups', methods=['GET'])
def get_groups():
    # Mock data - In production: query DB
    return jsonify([
        {"id": 1, "name": "CS-2024-A", "students_count": 42, "code": "JIG-A"},
        {"id": 2, "name": "CS-2024-B", "students_count": 38, "code": "JIG-B"}
    ])

@app.route('/api/student/enrolled-groups/<int:student_id>', methods=['GET'])
def get_enrolled_groups(student_id):
    # Mock DB Response
    groups = [
        {
            "group_id": 1,
            "group_name": "Data Structures",
            "faculty_name": "Prof. Amitabh Sharma",
            "total_students": 128
        },
        {
            "group_id": 2,
            "group_name": "Algorithms",
            "faculty_name": "Dr. Sarah Jenkins",
            "total_students": 94
        },
        {
            "group_id": 3,
            "group_name": "Computer Networks",
            "faculty_name": "Prof. Rajesh Kumar",
            "total_students": 110
        },
        {
            "group_id": 4,
            "group_name": "Operating Systems",
            "faculty_name": "Dr. Emily Watson",
            "total_students": 76
        }
    ]
    return jsonify(groups)

@app.route('/api/groups/join', methods=['POST'])
def join_group():
    data = request.json
    student_id = data.get('student_id')
    class_code = data.get('class_code')

    # Mock Validation
    if not class_code:
        return jsonify({"message": "Class code required"}), 400
    
    # Simulate DB check
    valid_codes = ['JIG-A', 'JIG-B', 'CS-TEST', 'JIG-8820-B']
    
    if class_code in valid_codes:
         return jsonify({"message": "Successfully joined"}), 200
    else:
         return jsonify({"message": "Invalid class code"}), 404

@app.route('/api/groups/<int:group_id>', methods=['GET'])
def get_group_details(group_id):
    # Mock Details
    return jsonify({
        "id": group_id,
        "name": "Data Structures",
        "faculty": "Prof. Amitabh Sharma",
        "total_students": 128,
        "description": "Comprehensive study of data organization, management, and storage formats that enable efficient access and modification.",
        "schedule": "Mon, Wed, Fri - 10:00 AM"
    })

# --- Lecture Routes ---
@app.route('/api/lectures/today', methods=['GET'])
def get_todays_lectures():
    return jsonify([
        {"id": 1, "title": "Data Structures", "start_time": "09:00", "end_time": "10:30", "group_name": "CS-301", "location": "Hall A"}
    ])

# --- Emotion Analysis Logic ---
def analyze_image(base64_img):
    """
    Placeholder for ML Emotion Detection Model.
    In production: Load TensorFlow/PyTorch model here.
    """
    # Simulate processing delay
    # time.sleep(0.05) 
    
    # Mock Result
    emotions = ['Focused', 'Confused', 'Bored', 'Distracted']
    weights = [0.6, 0.15, 0.15, 0.1]
    return random.choices(emotions, weights=weights)[0]

@app.route('/api/emotion/analyze', methods=['POST'])
def analyze_emotion():
    data = request.json
    lecture_id = data.get('lectureId')
    student_id = data.get('studentId')
    image_data = data.get('image')

    if not lecture_id or not image_data:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    # Run Analysis
    detected_emotion = analyze_image(image_data)
    
    # Save to DB (Pseudo-code)
    # cursor = db.get_db().cursor()
    # cursor.execute("INSERT INTO emotion_logs (lecture_id, student_id, emotion) VALUES (%s, %s, %s)", 
    #                (lecture_id, student_id, detected_emotion))
    # db.get_db().commit()

    # Broadcast to Faculty Room for Live Monitor
    socketio.emit('live_analytics_update', {
        'distribution': {
            'focused': random.randint(50, 60), # Mock aggregated stats
            'confused': random.randint(10, 20),
            'bored': random.randint(10, 20),
            'distracted': random.randint(5, 10)
        },
        'engagementScore': random.randint(60, 90)
    }, to=f"faculty_{lecture_id}")

    return jsonify({"status": "success", "emotion": detected_emotion})

# --- Polling Endpoints for Dashboard ---

@app.route('/api/emotion/live-summary', methods=['GET'])
def get_live_summary():
    # Mock aggregation for demo
    # In production: Query `emotion_logs` for last 30 seconds
    distribution = {
        'focused': random.randint(20, 80),
        'confused': random.randint(5, 40),
        'bored': random.randint(5, 40),
        'distracted': random.randint(0, 20)
    }
    
    # Normalize to 100%
    total = sum(distribution.values())
    if total > 0:
        for k in distribution:
            distribution[k] = round((distribution[k] / total) * 100)
    
    # Force sum to 100
    current_sum = sum(distribution.values())
    distribution['focused'] += (100 - current_sum)

    # Calculate weighted engagement score
    engagement_score = distribution['focused'] + (distribution['confused'] * 0.2) + (distribution['bored'] * 0.1)
    
    return jsonify({
        "distribution": distribution,
        "engagementScore": round(engagement_score)
    })

@app.route('/api/emotion/student-status', methods=['GET'])
def get_student_status():
    # Mock individual student statuses
    # In production: Query latest status per student_id
    students = []
    emotions = ['Focused', 'Confused', 'Bored', 'Distracted']
    
    # Mocking for IDs 1-8 based on frontend hardcoded list
    for i in range(1, 9):
        # Weighted random choice to simulate realistic classroom
        emotion = random.choices(emotions, weights=[0.5, 0.2, 0.2, 0.1])[0]
        students.append({
            "id": i,
            "emotion": emotion
        })
    return jsonify(students)

# --- WebSocket Events ---
@socketio.on('join')
def on_join(data):
    try:
        role = data.get('role')
        lecture_id = data.get('lecture_id')
        
        if not role or not lecture_id:
            print("Invalid join request: missing role or lecture_id")
            return

        if role == 'faculty':
            room = f"faculty_{lecture_id}"
            join_room(room)
            print(f"Faculty joined room: {room}")
        else:
            room = f"lecture_{lecture_id}"
            join_room(room)
            print(f"Student joined room: {room}")
            # Notify faculty
            socketio.emit('student_joined', {'id': request.sid, 'name': 'New Student'}, to=f"faculty_{lecture_id}")
            
    except Exception as e:
        print(f"Error in on_join: {e}")

@socketio.on('disconnect')
def on_disconnect():
    print("Client disconnected")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
# Backend Integration Specification

## Database Schema (MySQL)

### 1. Groups Table
Create a table named `class_groups` to store group details. (Note: `groups` is often a reserved keyword in SQL, so using `class_groups`)

```sql
CREATE TABLE class_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Store icon name or reference
    color_theme VARCHAR(50), -- Store styling info like 'blue', 'green'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Lectures Table
Create a table named `lectures` to store schedule information.

```sql
CREATE TABLE lectures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    group_name VARCHAR(100) NOT NULL, -- Currently using name reference, ideally use group_id
    group_id INT, -- Foreign key to class_groups
    lecture_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL, -- Storing as string or TIME type
    end_time VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES class_groups(id) ON DELETE SET NULL
);
```

### 3. Students Table
Create a table named `students` to store student records.

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    class_group VARCHAR(100) NOT NULL, -- Currently using string reference
    group_id INT, -- Foreign key to class_groups for direct linkage
    attendance_percentage FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES class_groups(id) ON DELETE SET NULL
);
```

### 4. Attendance Log Table
Create a table named `attendance_log` to store individual attendance records per lecture.

```sql
CREATE TABLE attendance_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    lecture_id INT NOT NULL,
    status ENUM('PRESENT', 'ABSENT') DEFAULT 'ABSENT',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);
```

### 5. Attendance Settings Table
Create a table named `attendance_settings` to store configuration.

```sql
CREATE TABLE attendance_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    threshold_percentage INT DEFAULT 75,
    enable_alerts BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6. Engagement Metrics Table
Create a table named `engagement_metrics` to store aggregate engagement scores per lecture (historical).

```sql
CREATE TABLE engagement_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecture_id INT NOT NULL,
    average_score INT DEFAULT 0,
    focus_percentage INT DEFAULT 0,
    confusion_percentage INT DEFAULT 0,
    boredom_percentage INT DEFAULT 0,
    recorded_at DATE NOT NULL, -- To easily query trends by date
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);
```

### 7. Engagement Settings Table
Create a table named `engagement_settings` to store configuration.

```sql
CREATE TABLE engagement_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    threshold_percentage INT DEFAULT 60,
    enable_alerts BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8. Emotion Logs Table
Create a table named `emotion_logs` to store real-time raw emotion data points.

```sql
CREATE TABLE emotion_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id INT, -- Nullable if anonymous or not strictly bound yet
    lecture_id INT NOT NULL,
    emotion ENUM('Focused', 'Confused', 'Bored', 'Distracted') NOT NULL,
    confidence_score FLOAT DEFAULT 0.0,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);
```

## API Route Definitions (Node.js / Express Example)

### Group Endpoints
... (Same as previous spec)

### Real-Time Emotion Analysis Endpoints

#### 1. POST /api/emotion/analyze
Receives a frame from the student client, runs analysis, and stores the result.

**Request Body:**
```json
{
  "lectureId": 1,
  "timestamp": "2023-10-25T10:00:00Z",
  "image": "data:image/jpeg;base64,..."
}
```

**Implementation Logic:**
1.  Receive base64 image.
2.  Send image to ML Model Service (e.g., Python Flask/FastAPI microservice or internal function).
3.  Receive detected emotion (e.g., "Confused").
4.  Insert into `emotion_logs`:
    ```sql
    INSERT INTO emotion_logs (lecture_id, emotion, captured_at) VALUES (?, ?, NOW());
    ```
5.  Return success (do not return the image back).

**Response:**
```json
{ "status": "processed", "detected": "Confused" }
```

#### 2. GET /api/emotion/live-summary
Fetches aggregated emotion data for the last 30 seconds (or current active window) for the faculty dashboard.

**Query Params:** `lectureId`

**Implementation Logic:**
1.  Query `emotion_logs` for entries within the last 30 seconds for the given `lectureId`.
2.  Calculate percentages for each emotion category.
3.  Calculate an overall "Engagement Score" (weighted average: Focused=100, Confused=50, Bored=20, Distracted=0).
4.  Return aggregated JSON.

**SQL Query Example:**
```sql
SELECT 
    emotion, 
    COUNT(*) as count 
FROM emotion_logs 
WHERE lecture_id = ? AND captured_at >= NOW() - INTERVAL 30 SECOND 
GROUP BY emotion;
```

**Response:**
```json
{
  "focused": 55,
  "confused": 25,
  "bored": 10,
  "distracted": 10,
  "engagementScore": 72,
  "totalSamples": 150
}
```

## WebSocket / WebRTC Signaling Specification

The system uses WebSocket for signaling (joining rooms, peer presence) and potentially WebRTC for video streaming.

**Endpoint:** `wss://api.jignasa.edu/ws`

### Events (Client -> Server)

1.  **join_lecture**
    ```json
    { "type": "join_lecture", "lectureId": 1, "role": "STUDENT", "studentId": 101 }
    ```
    *   Adds connection to the specific lecture room.
    *   Faculty role allows receiving aggregated stream data.

2.  **offer / answer / ice-candidate**
    *   Standard WebRTC signaling payloads to establish peer connections between Student and Media Server (SFU) or directly to Faculty (Mesh - harder scaling).
    *   For this MVP, we assume a server-side component (SFU) manages streams.

3.  **emotion_update** (Optional Optimization)
    *   If running emotion detection client-side (TensorFlow.js), send result directly via socket instead of POST frame.
    ```json
    { "type": "emotion_update", "lectureId": 1, "emotion": "Focused" }
    ```

### Events (Server -> Client)

1.  **room_state**
    *   Sent to Faculty upon joining or update.
    ```json
    {
      "type": "room_state",
      "activeStudents": [ { "id": 101, "name": "Alice" }, ... ]
    }
    ```

2.  **live_analytics_update**
    *   Push update to Faculty dashboard (avoids polling).
    ```json
    {
      "type": "live_analytics_update",
      "data": { "focused": 60, "confused": 20, ... }
    }
    ```

3.  **alert**
    *   Push specific alert event.
    ```json
    { "type": "alert", "message": "Confusion spike detected", "level": "HIGH" }
    ```

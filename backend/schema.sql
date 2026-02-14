CREATE DATABASE IF NOT EXISTS jignasa_db;
USE jignasa_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty') NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    roll_number VARCHAR(50) NOT NULL,
    group_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES class_groups(id)
);

CREATE TABLE IF NOT EXISTS lectures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    group_id INT,
    start_time DATETIME,
    end_time DATETIME,
    status ENUM('scheduled', 'live', 'completed') DEFAULT 'scheduled',
    FOREIGN KEY (group_id) REFERENCES class_groups(id)
);

CREATE TABLE IF NOT EXISTS emotion_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lecture_id INT NOT NULL,
    student_id INT,
    emotion ENUM('Focused', 'Confused', 'Bored', 'Distracted') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
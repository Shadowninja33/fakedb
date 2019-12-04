CREATE DATABASE IF NOT EXISTS db;
USE db;

CREATE TABLE IF NOT EXISTS babydriver_users(
    id INT NOT NULL AUTO_INCREMENT, 
    email VARCHAR(50) NOT NULL, 
    password VARCHAR(150) NOT NULL, 
    password_salt VARCHAR(50) NOT NULL, 
    school_user BOOLEAN NOT NULL default 0, 
    PRIMARY KEY(id), 
    UNIQUE INDEX email_index (email), 
    INDEX user_type_index (school_user)
);


CREATE TABLE IF NOT EXISTS user_contacts(
    id INT NOT NULL AUTO_INCREMENT, 
    user_id INT NOT NULL, 
    first_name VARCHAR(50), 
    last_name VARCHAR(50), 
    phone_number VARCHAR(50), 
    PRIMARY KEY(id), 
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    INDEX user_id_index (user_id)
);


CREATE TABLE IF NOT EXISTS emergency_contacts(
    id INT NOT NULL AUTO_INCREMENT, 
    user_id INT NOT NULL, 
    first_name VARCHAR(50), 
    last_name VARCHAR(50), 
    email VARCHAR(50), 
    phone_number VARCHAR(50), 
    PRIMARY KEY(id), 
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    INDEX user_id_index (user_id)
);


CREATE TABLE IF NOT EXISTS pickup_locations(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    pickup_loc_name VARCHAR(100),
    pickup_loc_city VARCHAR(50),
    pickup_loc_state VARCHAR(50),
    pickup_loc_street_address VARCHAR(100),
    pickup_loc_zip_code VARCHAR(20),
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    INDEX user_id_index(user_id)
);


CREATE TABLE IF NOT EXISTS cars(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(50),
    year VARCHAR(4),
    license_plate VARCHAR(25),
    PRIMARY KEY(id),
    INDEX user_id_index(user_id),
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id)
);


CREATE TABLE IF NOT EXISTS schools(
    id INT NOT NULL AUTO_INCREMENT,
    school_name VARCHAR(100),
    phone_number VARCHAR(50),
    city VARCHAR(50),
    school_state VARCHAR(50),
    street_address VARCHAR(50),
    zip_code VARCHAR(20),
    principal_first_name VARCHAR(50),
    principal_last_name VARCHAR(50),
    PRIMARY KEY(id) 
);


CREATE TABLE IF NOT EXISTS children(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT,
    height INT,
    school_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    FOREIGN KEY(school_id) REFERENCES schools(id),
    INDEX user_id_index(user_id)
);


CREATE TABLE IF NOT EXISTS medical_needs(
    id INT NOT NULL AUTO_INCREMENT,
    child_id INT NOT NULL,
    medical_condition VARCHAR(50),
    notes VARCHAR(150),
    PRIMARY KEY(id),
    FOREIGN KEY(child_id) REFERENCES children(id),
    INDEX child_id_index(child_id)
);

CREATE TABLE IF NOT EXISTS pickups(
    id INT NOT NULL AUTO_INCREMENT,
    child_id INT NOT NULL,
    time_created TIME,
    pickup_time TIME,
    pickup_date DATE,
    pickup_loc_id INT,
    assigned_to INT,
    progress INT,
    safeword VARCHAR(50),
    PRIMARY KEY(id),
    FOREIGN KEY(assigned_to) REFERENCES babydriver_users(id),
    FOREIGN KEY(child_id) REFERENCES children(id),
    FOREIGN KEY(pickup_loc_id) REFERENCES pickup_locations(id),
    INDEX child_id_index(child_id)
);








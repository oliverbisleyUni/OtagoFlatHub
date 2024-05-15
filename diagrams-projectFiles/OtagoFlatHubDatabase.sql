CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(64),
    password VARCHAR(64)
);

CREATE TABLE Flat (
    flat_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64),
    address VARCHAR(64),
    latitude DECIMAL(10, 8), 
    longitude DECIMAL(11, 8)
);

CREATE TABLE FlatRecord (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    flat_id INT,
    price FLOAT,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (flat_id) REFERENCES Flat(flat_id)
);





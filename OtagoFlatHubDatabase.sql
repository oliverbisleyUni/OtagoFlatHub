CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(64),
    password VARCHAR(64)
);

CREATE TABLE Flat (
    flat_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64),
    address VARCHAR(64)
);

CREATE TABLE FlatRecord (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    flat_id INT,
    price FLOAT,
    review TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (flat_id) REFERENCES Flat(flat_id)
);

CREATE TABLE Photo (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT,
    photoValue BLOB,
    FOREIGN KEY (record_id) REFERENCES FlatRecord(record_id)
);

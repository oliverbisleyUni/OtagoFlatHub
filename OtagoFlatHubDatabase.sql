CREATE TABLE [User] (
    UserID INT PRIMARY KEY,
    UserName VARCHAR(16),
    email VARCHAR(16),
    name VARCHAR(16),
    PASSWORD VARCHAR(16)
);

CREATE TABLE Flat (
    FlatID INT PRIMARY KEY,
    name VARCHAR(64),
    address VARCHAR(64)
);

CREATE TABLE FlatRecord (
    RecordID INT PRIMARY KEY,
    UserID INT,
    FlatID INT,
    price FLOAT,
    review TEXT,
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY (FlatID) REFERENCES Flat(FlatID)
);

CREATE TABLE Photo (
    PhotoID INT PRIMARY KEY,
    flatRecordID INT,
    photoValue BLOB,
    FOREIGN KEY (flatRecordID) REFERENCES FlatRecord(RecordID)
);

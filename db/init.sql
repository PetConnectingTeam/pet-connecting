CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

CREATE TABLE IF NOT EXISTS Roles (
    RoleID varchar(100) NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS User (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100),
    RoleID VARCHAR(100),
    /*Points FLOAT,*/
    ProfilePhoto LONGBLOB, 
    MimeType VARCHAR(50),
    TotalRating DECIMAL(5, 2),
    RatingCount INT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

/*CREATE TABLE IF NOT EXISTS Pet (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID BIGINT,
    Name VARCHAR(100) NOT NULL,
    AnimalType ENUM('Dog', 'Cat', 'Bird', 'Fish', 'Others') NOT NULL,
    Breed VARCHAR(100),
    Description TEXT,
    Allergies TEXT,
    Weight FLOAT,
    Size ENUM('Big', 'Medium', 'Small') NOT NULL,
    Age INT,
    FOREIGN KEY (UserID) REFERENCES User(ID)
);


CREATE TABLE IF NOT EXISTS PetPhotos (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PetID BIGINT,
    Photo LONGBLOB,
    MimeType VARCHAR(50),
    FOREIGN KEY (PetID) REFERENCES Pet(ID)
);
CREATE TABLE IF NOT EXISTS RequestService (
    ServiceId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PublisherId BIGINT NOT NULL,
    publishDate DATETIME NOT NULL,
    description TEXT NOT NULL,
    serviceDateIni DATETIME NOT NULL,
    serviceDateEnd DATETIME NOT NULL,
    address VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    rated BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (PublisherId) REFERENCES User(ID)
);

CREATE TABLE IF NOT EXISTS PetsInService (
    UserId BIGINT NOT NULL,
    ServiceId BIGINT NOT NULL,
    PetId BIGINT NOT NULL,
    PRIMARY KEY (UserId, ServiceId, PetId),
    FOREIGN KEY (UserId) REFERENCES User(ID),
    FOREIGN KEY (ServiceId) REFERENCES RequestService(ServiceId)
);

CREATE TABLE IF NOT EXISTS Application (
    UserId BIGINT NOT NULL,
    ServiceId BIGINT NOT NULL,
    Accepted BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (UserId, ServiceId),
    FOREIGN KEY (UserId) REFERENCES User(ID),
    FOREIGN KEY (ServiceId) REFERENCES RequestService(ServiceId)
);

CREATE TABLE Messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

*/
-- Populate

-- Roles
INSERT INTO Roles (RoleID) VALUES
('admin'),
('basic'),
('premium'),
('vet');

INSERT INTO User (Email, Password, Name, Surname, RoleID, ProfilePhoto, TotalRating, RatingCount) VALUES
('admin@admin.com', 'admin', 'admin', 'admin', 'admin', NULL, 0.0, 0);

/*
--  User
INSERT INTO User (Email, Password, Name, Surname, RoleID, Points, ProfilePhoto, TotalRating, RatingCount) VALUES
('user1@example.com', 'password123', 'John', 'Doe', 1, 100, NULL, 0.0, 0),
('user2@example.com', 'password456', 'Jane', 'Doe', 2, 200, NULL, 0.0, 0);

--  Pet
INSERT INTO Pet (UserID, Name, AnimalType, Breed, Description, Allergies, Weight, Size, Age) VALUES
(1, 'Fido', 'Dog', 'Labrador', 'Un perro amistoso y leal', 'Ninguna', 30.0, 'Big', 5),
(1, 'Mittens', 'Cat', 'Siames', 'Un gato juguetón', 'Polvo', 10.0, 'Small', 3),
(2, 'Paddy', 'Dog', '', 'Perro rebelde', '', 10.0, 'Medium', 4);

-- Request Service
INSERT INTO RequestService (PublisherId, publishDate, description, serviceDateIni, serviceDateEnd, address, cost, completed)
VALUES (1, NOW(), 'Cuidar perro durante el fin de semana', '2024-10-20 09:00:00', '2024-10-22 18:00:00', 'Calle Falsa 123', 50.00, FALSE);
*/
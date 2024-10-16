CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

CREATE TABLE IF NOT EXISTS Roles (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    RolType ENUM('Normal', 'Premium', 'Owner') NOT NULL,
    Description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS User (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100),
    RoleID BIGINT,
    Points FLOAT,
    ProfilePhoto BLOB, 
    MimeType VARCHAR(50),
    Rating DECIMAL(5, 2),
    FOREIGN KEY (RoleID) REFERENCES Roles(ID)
);

CREATE TABLE IF NOT EXISTS Pet (
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
    Photo BLOB,
    MimeType VARCHAR(50),
    FOREIGN KEY (PetID) REFERENCES Pet(ID)
);
CREATE TABLE IF NOT EXISTS RequestService (
    ServiceId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PublisherId BIGINT NOT NULL,
    publishDate DATETIME NOT NULL,
    description TEXT NOT NULL,
    takerId BIGINT, -- Puede ser NULL hasta que alguien acepte el servicio
    serviceDateIni DATETIME NOT NULL,
    serviceDateEnd DATETIME NOT NULL,
    address VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    petId BIGINT NOT NULL,
    FOREIGN KEY (PublisherId) REFERENCES User(ID),
    FOREIGN KEY (takerId) REFERENCES User(ID),
    FOREIGN KEY (petId) REFERENCES Pet(ID)
);

CREATE TABLE IF NOT EXISTS Application (
    UserID BIGINT NOT NULL,
    ServiceId BIGINT NOT NULL,
    PRIMARY KEY (UserID, ServiceId),
    FOREIGN KEY (UserID) REFERENCES User(ID),
    FOREIGN KEY (ServiceId) REFERENCES RequestService(ServiceId)
);


-- Populate

-- Roles
INSERT INTO Roles (RolType, Description) VALUES
('Normal', 'Basic user'),
('Premium', 'Premium user'),
('Owner', 'Owner user');

--  User
INSERT INTO User (Email, Password, Name, Surname, RoleID, Points, ProfilePhoto, Rating) VALUES
('user1@example.com', 'password123', 'John', 'Doe', 1, 100, NULL, 4.5),
('user2@example.com', 'password456', 'Jane', 'Doe', 2, 200, NULL, 5.0);

--  Pet
INSERT INTO Pet (UserID, Name, AnimalType, Breed, Description, Allergies, Weight, Size, Age) VALUES
(1, 'Fido', 'Dog', 'Labrador', 'Un perro amistoso y leal', 'Ninguna', 30.0, 'Big', 5),
(1, 'Mittens', 'Cat', 'Siames', 'Un gato juguetón', 'Polvo', 10.0, 'Small', 3),
(2, 'Paddy', 'Dog', '', 'Perro rebelde', '', 10.0, 'Medium', 4);

-- Request Service
INSERT INTO RequestService (PublisherId, publishDate, description, serviceDateIni, serviceDateEnd, address, cost, completed, petId) VALUES
(1, NOW(), 'Cuidar perro durante el fin de semana', '2024-10-20 09:00:00', '2024-10-22 18:00:00', 'Calle Falsa 123', 50.00, FALSE, 1),
(2, NOW(), 'Cuidar fin de semana', '2024-10-20 09:00:00', '2024-10-22 18:00:00', 'Calle Falsa 123', 50.00, FALSE, 1);
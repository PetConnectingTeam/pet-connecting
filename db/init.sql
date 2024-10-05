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
    ProfilePhoto BIGINT, 
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


CREATE TABLE IF NOT EXISTS Photos (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PetID BIGINT,
    Photos BIGINT, -- Asumiendo que Photos se almacena como un binario
    FOREIGN KEY (PetID) REFERENCES Pet(ID)
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


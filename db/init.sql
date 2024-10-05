CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

CREATE TABLE IF NOT EXISTS Roles (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    AnimalType ENUM('Perro', 'Gato', 'Pájaro', 'Pez', 'Otro') NOT NULL,
    Breed VARCHAR(100),
    Description TEXT,
    Allergies TEXT,
    Weight FLOAT,
    Size ENUM('Grande', 'Mediano', 'Pequeño') NOT NULL,
    Age INT,
    FOREIGN KEY (UserID) REFERENCES User(ID)
);


CREATE TABLE IF NOT EXISTS Photos (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PetID BIGINT,
    Photos BIGINT, -- Asumiendo que Photos se almacena como un binario
    FOREIGN KEY (PetID) REFERENCES Pet(ID)
);

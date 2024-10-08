from . import db

class Role(db.Model):
    __tablename__ = 'Roles'  # Nombre de la tabla en la base de datos

    ID = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    RolType = db.Column(db.Enum('Normal', 'Premium', 'Owner'), nullable=False)
    Description = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Role {self.RolType}>'


class User(db.Model):
    __tablename__ = 'User'  # Nombre de la tabla en la base de datos

    ID = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Name = db.Column(db.String(100), nullable=False)
    Surname = db.Column(db.String(100))
    RoleID = db.Column(db.BigInteger, db.ForeignKey('Roles.ID'))  # Relación con la tabla Roles
    Points = db.Column(db.Float)
    ProfilePhoto = db.Column(db.LargeBinary, nullable=True)  # Cambiar el tipo según lo que necesites
    MimeType = db.Column(db.String(50), nullable=True)
    Rating = db.Column(db.Numeric(5, 2))

    def __repr__(self):
        return f'<User {self.Name}, Email: {self.Email}>'


class Pet(db.Model):
    __tablename__ = 'Pet'  # Nombre de la tabla en la base de datos

    ID = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    UserID = db.Column(db.BigInteger, db.ForeignKey('User.ID'))  # Relación con la tabla User
    Name = db.Column(db.String(100), nullable=False)
    AnimalType = db.Column(db.Enum('Dog', 'Cat', 'Bird', 'Fish', 'Others'), nullable=False)
    Breed = db.Column(db.String(100))
    Description = db.Column(db.Text)
    Allergies = db.Column(db.Text)
    Weight = db.Column(db.Float)
    Size = db.Column(db.Enum('Big', 'Medium', 'Small'), nullable=False)
    Age = db.Column(db.Integer)

    def __repr__(self):
        return f'<Pet {self.Name}, Type: {self.AnimalType}>'


class PetPhotos(db.Model):
    __tablename__ = 'PetPhotos'  # Nombre de la tabla en la base de datos

    ID = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    PetID = db.Column(db.BigInteger, db.ForeignKey('Pet.ID'))  # Relación con la tabla Pet
    Photo = db.Column(db.LargeBinary)  # Asumiendo que deseas almacenar la imagen como un binario
    MimeType = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f'<Photo for Pet ID: {self.PetID}>'

from . import db
import base64

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
    
    def to_dict(self):
        result = {}

        for column in self.__table__.columns:
            if column.name == 'Photo':
                result[column.name] = base64.b64encode(self.Photo).decode('utf-8')
            else:    
                result[column.name] = getattr(self, column.name)

        return result
                
    

class RequestService(db.Model):
    __tablename__ = 'RequestService'  # Nombre de la tabla en la base de datos

    ServiceId = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    PublisherId = db.Column(db.BigInteger, db.ForeignKey('User.ID'), nullable=False)  # Relación con la tabla User
    publishDate = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.Text, nullable=False)
    serviceDateIni = db.Column(db.DateTime, nullable=False)
    serviceDateEnd = db.Column(db.DateTime, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return f'<RequestService {self.description[:20]}... (ServiceId: {self.ServiceId})>'
    
    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}
    
class PetsInService(db.Model):
    __tablename__ = 'PetsInService'

    PetId = db.Column(db.BigInteger, db.ForeignKey('Pet.ID'), nullable=False, primary_key=True)
    ServiceId = db.Column(db.BigInteger, db.ForeignKey('RequestService.ServiceId'), nullable=False, primary_key=True)
    UserId = db.Column(db.BigInteger, db.ForeignKey('User.ID'), nullable=False, primary_key=True)
    
    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class Application(db.Model):
    __tablename__ = 'Application'

    ServiceId = db.Column(db.BigInteger, db.ForeignKey('RequestService.ServiceId'), nullable=False, primary_key=True)
    UserId = db.Column(db.BigInteger, db.ForeignKey('User.ID'), nullable=False, primary_key=True)
    Accepted = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}
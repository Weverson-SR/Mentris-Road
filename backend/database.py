from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexão com o banco de dados PostgreSQL
URL_DATABASE = "postgresql://postgres:password@localhost:5432/bookstore"

# Cria o motor de conexão com o banco de dados
engine = create_engine(URL_DATABASE)

# Cria uma sessão para interagir com o banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base para os modelos do SQLAlchemy
Base = declarative_base()

# Função geradora que fornece uma sessão de banco de dados e garante seu fechamento após o uso
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função para criar as tabelas no banco de dados com base nos modelos definidos
def create_table():
    Base.metadata.create_all(bind=engine)

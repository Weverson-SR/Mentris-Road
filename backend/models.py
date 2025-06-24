from db import Base
from sqlalchemy import Integer, Column, String

# Modelo Book representa a tabela 'Books' no banco de dados
class Book(Base):
    __tablename__ = 'Books'  # Nome da tabela no banco

    id = Column(Integer, primary_key=True, index=True)   # ID único do livro (chave primária)
    title = Column(String, index=True)                   # Título do livro
    description = Column(String, index=True)             # Descrição do livro
    author = Column(String, index=True)                  # Autor do livro
    year = Column(Integer)     

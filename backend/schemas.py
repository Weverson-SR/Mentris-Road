from pydantic import BaseModel

# Schema base com os campos principais do livro
class BookBase(BaseModel):
    title : str           # Título do livro
    author: str           # Autor do livro
    description: str      # Descrição do livro
    year: int             # Ano de publicação

# Schema para criação de livro (herda de BookBase)
class BookCreate(BookBase):
    pass                  # Não adiciona novos campos, apenas reutiliza os do base

# Schema para resposta de livro, incluindo o ID
class Book(BookBase):
    id : int              # ID do livro (gerado pelo banco)

    class Config:
        # Permite que o Pydantic leia dados vindos de objetos ORM (como do SQLAlchemy)
        #orm_mode = True
        from_attribute = True

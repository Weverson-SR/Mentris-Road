from .models import Book
from sqlalchemy.orm import Session
from .schemas import BookCreate

def create_book(db: Session, data: BookCreate):
    # Cria uma instância do modelo Book a partir dos dados recebidos
    book_instance = Book(**data.model_dump())
    # Adiciona o novo livro à sessão do banco de dados
    db.add(book_instance)
    # Salva as alterações no banco de dados
    db.commit()
    # Atualiza a instância com os dados do banco (ex: id gerado)
    db.refresh(book_instance)
    # Retorna o livro criado
    return book_instance
    

def get_books(db: Session):
    # Busca e retorna todos os livros cadastrados no banco de dados
    return db.query(Book).all()


def get_book(db: Session, book_id: int):
    # Busca e retorna um livro específico pelo seu ID
    return db.query(Book).filter(Book.id == book_id).first()

def update_book(db: Session, book: BookCreate, book_id: int):
    # Busca o livro que será atualizado pelo ID
    book_queryset = db.query(Book).filter(Book.id == book_id).first()
    if book_queryset:
        # Atualiza os campos do livro com os novos valores recebidos
        for key, value in book.model_dump().items():
            setattr(book_queryset, key, value)
        # Salva as alterações no banco de dados
        db.commit()
        # Atualiza a instância com os dados do banco
        db.refresh(book_queryset)
        # Retorna o livro atualizado
        return book_queryset
    
    
def delete_book(db: Session, id: int):
    # Busca o livro que será deletado pelo ID
    book_queryset = db.query(Book).filter(Book.id == id).first()
    if book_queryset:
        # Remove o livro do banco de dados
        db.delete(book_queryset)
        # Salva as alterações no banco de dados
        db.commit()
    # Retorna o livro deletado (ou None se não existir)
    return book_queryset
    # Busca o livro

from fastapi import FastAPI, Depends, HTTPException
import services as services, models as models, schemas as schemas
from db import get_db, engine
from sqlalchemy.orm import Session

# Inicializa a aplicação FastAPI
app = FastAPI()

@app.get("/books/", response_model=list[schemas.Book])
async def get_all_books(db: Session = Depends(get_db)):
    # Retorna todos os livros cadastrados no banco de dados
    return services.get_books(db)

@app.get("/books/{id}", response_model=schemas.Book)
async def get_book_by_id(id: int, db: Session = Depends(get_db)):
    # Busca um livro específico pelo ID
    book_queryset = services.get_book(db, id)
    if book_queryset:
        # Se o livro existir, retorna ele
        return book_queryset
    # Se não existir, retorna erro 404
    raise HTTPException(status_code=404, detail="Book not found")
    
@app.post("/books/", response_model=schemas.Book)
async def create_new_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    # Cria um novo livro com os dados recebidos
    return services.create_book(db, book)

@app.put("/books/{id}", response_model=schemas.Book)
async def update_book(book: schemas.BookCreate, id: int, db: Session = Depends(get_db)):
    # Atualiza um livro existente pelo ID
    db_update = services.update_book(db, book, id)
    if not db_update:
        # Se não encontrar o livro, retorna erro 404
        raise HTTPException(status_code=404, detail="Book not found")
    # Retorna o livro atualizado
    return db_update

@app.delete("/books/{id}", response_model=schemas.Book)
async def delete_book(id: int, db: Session = Depends(get_db)):
    # Deleta um livro pelo ID
    delete_entry = services.delete_book(db, id)
    if delete_entry:
        # Se o livro foi deletado, retorna ele
        return delete_entry
    # Se não encontrar o livro, retorna erro 404
    raise HTTPException(status_code=404, detail="Book not found")

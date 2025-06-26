import './App.css'
import React, { useState } from 'react';

function App() {
  // Estados movidos para fora do componente BookManager
  const [books, setBooks] = useState([
    { id: 1, title: '1984', author: 'George Orwell', year: 1949 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 }
  ]);

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '' });
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [nextId, setNextId] = useState(4);

  // Corrigido o nome da função (era SerchById)
  const handleSearchById = () => {
    const id = parseInt(searchId);
    const found = books.find(book => book.id === id);
    setSearchResult(found || null);
  };

  // Corrigido a lógica de deletar (estava usando filter em vez de filtrar)
  const handleDeleteBook = () => {
    const id = parseInt(deleteId);
    setBooks(books.filter(book => book.id !== id));
    setDeleteId(''); // Corrigido o nome da função (era setDeleteID)
    if (searchResult && searchResult.id === id) {
      setSearchResult(null);
    }
  };

  const handleCreateBook = () => {
    if (newBook.title && newBook.author && newBook.year) {
      const book = {
        id: nextId,
        title: newBook.title,
        author: newBook.author,
        year: parseInt(newBook.year)
      };
      setBooks([...books, book]);
      setNewBook({ title: '', author: '', year: '' });
      setNextId(nextId + 1);
    }
  };

  const toggleShowAllBooks = () => {
    setShowAllBooks(!showAllBooks);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gerenciador de Livros</h1>
      </header>

      <main className="main-content">
        {/* Mostrar todos os livros */}
        <section className="section">
          <button className="btn btn-primary" onClick={toggleShowAllBooks}>
            {showAllBooks ? 'Ocultar Livros' : 'Mostrar Todos os Livros'}
          </button>
          
          {showAllBooks && (
            <div className="books-list">
              {books.length > 0 ? (
                books.map(book => (
                  <div key={book.id} className="book-item">
                    <h3>{book.title}</h3>
                    <p><strong>Autor:</strong> {book.author}</p>
                    <p><strong>Ano:</strong> {book.year}</p>
                    <p><strong>ID:</strong> {book.id}</p>
                  </div>
                ))
              ) : (
                <p>Nenhum livro encontrado.</p>
              )}
            </div>
          )}
        </section>

        {/* Buscar livro por ID */}
        <section className="section">
          <h2>Procurar Livro por ID</h2>
          <div className="search-container">
            <input 
              type="text" 
              className="input-field"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)} 
              placeholder="Digite o ID do livro"
            />
            <button className="btn btn-secondary" onClick={handleSearchById}>
              Procurar
            </button>
          </div>
          
          {searchResult && (
            <div className="search-result">
              <h3>Livro Encontrado:</h3>
              <p><strong>Título:</strong> {searchResult.title}</p>
              <p><strong>Autor:</strong> {searchResult.author}</p>
              <p><strong>Ano:</strong> {searchResult.year}</p>
            </div>
          )}
          
          {searchId && searchResult === null && (
            <div className="no-result">
              Nenhum livro encontrado com o ID {searchId}
            </div>
          )}
        </section>

        {/* Criar novo livro */}
        <section className="section">
          <h2>Criar Novo Livro</h2>
          <div className="form">
            <div className="form-group">
              <label htmlFor="title">Título:</label>
              <input 
                type="text" 
                id="title" 
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="input-field" 
                placeholder="Digite o título do livro"
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Autor:</label>
              <input 
                type="text" 
                id="author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="input-field" 
                placeholder="Digite o nome do autor"
              />
            </div>
            <div className="form-group">
              <label htmlFor="year">Ano:</label>
              <input 
                type="number" 
                id="year"
                value={newBook.year}
                onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                className="input-field" 
                placeholder="Digite o ano de publicação"
              />
            </div>
            <button className="btn btn-success" onClick={handleCreateBook}>
              Criar Livro
            </button>
          </div>
        </section>

        {/* Deletar livro */}
        <section className="section">
          <h2>Deletar Livro</h2>
          <div className="delete-container">
            <input 
              type="text" 
              className="input-field"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="Digite o ID do livro para deletar"
            />
            <button className="btn btn-danger" onClick={handleDeleteBook}>
              Deletar Livro
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

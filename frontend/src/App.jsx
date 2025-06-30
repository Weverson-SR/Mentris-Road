import './App.css'
import React, { useState, useEffect } from 'react'; // ✅ Adicionado useEffect

function App() {

  const [books, setBooks] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', description: ''});
  const [deleteId, setDeleteId] = useState('');
  const [showAllBooks, setShowAllBooks] = useState(false);

  const API_BASE_URL = 'http://localhost:8000'; // URL da API

  // ✅ Renomeado para fetchAllBooks (para coincidir com useEffect)
  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar livros');
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      alert('Erro ao buscar livros');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Função para mostrar/ocultar todos os livros
  const toggleShowAllBooks = async () => {
    if (!showAllBooks && books.length === 0) {
      // Se vai mostrar e não tem livros carregados, busca da API
      await fetchAllBooks();
    }
    setShowAllBooks(!showAllBooks);
  };

  // ✅ Corrigido: lógica estava invertida
  const handleSearchById = async () => {
    if (!searchId) {
      alert('Por favor, insira um ID válido.');
      return;
    }

    setLoading(true); // ✅ Adicionado loading
    try {
      const response = await fetch(`${API_BASE_URL}/books/${searchId}`);

      if (response.ok) { // ✅ Corrigido: era !response.ok
        const book = await response.json();
        setSearchResult(book);
      } else if (response.status === 404) {
        setSearchResult(null);
        alert('Nenhum livro encontrado');
      } else {
        throw new Error('Erro ao buscar livro');
      } 
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao buscar livro');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Corrigido: removido parâmetro não usado e adicionado loading
  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.year) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // ✅ Adicionado loading
    try {
      
      const  bookToSend = {
        ...newBook,
        year: Number(newBook.year) // ✅ Garantindo que o ano seja um número
      };

      const response = await fetch(`${API_BASE_URL}/books/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookToSend),
      });

      if (response.ok) {
        const createdBook = await response.json();
        setBooks([...books, createdBook]); // Atualiza a lista local
        setNewBook({ title: '', author: '', year: '' , description: ''}); // ✅ Limpa o formulário
        alert('Livro criado com sucesso!');
      } else {
        throw new Error('Erro ao criar livro');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar livro');
    } finally {
      setLoading(false); // ✅ Adicionado
    }


  };

  // ✅ Adicionada função que estava faltando
  const handleDeleteBook = async () => {
    if (!deleteId) {
      alert('Por favor, insira um ID válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${deleteId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== parseInt(deleteId))); // Remove da lista local
        setDeleteId(''); // ✅ Limpa o campo
        alert('Livro deletado com sucesso');
      } else if (response.status === 404) {
        alert('Livro não encontrado');
      } else {
        throw new Error('Erro ao deletar livro');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar livro');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Corrigido: nome da função
  useEffect(() => {
    // Não carrega automaticamente, só quando usuário clicar em "Mostrar Todos"
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Gerenciador de Livros</h1>
        {loading && <div className="loading">🔄 Carregando...</div>} {/* ✅ Indicador global de loading */}
      </header>

      <main className="main-content">
        {/* Mostrar todos os livros */}
        <section className="section">
          <button className="btn btn-primary" onClick={toggleShowAllBooks} disabled={loading}>
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
                    <p><strong>Description:</strong> {book.description}</p>
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
            <button className="btn btn-secondary" onClick={handleSearchById} disabled={loading}>
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
              <label htmlFor="description">Descrição:</label>
              <input
                type="text"
                id="description"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="input-field"
                placeholder="Digite a descrição do livro"
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
            <button className="btn btn-success" onClick={handleCreateBook} disabled={loading}>
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
            <button className="btn btn-danger" onClick={handleDeleteBook} disabled={loading}>
              Deletar Livro
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

// DOM Elements
const bookForm = document.getElementById('bookForm');
const editForm = document.getElementById('editForm');
const booksList = document.getElementById('booksList');
const searchInput = document.getElementById('searchInput');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const editModal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close');
const cancelEditBtn = document.getElementById('cancelEdit');
const bookCount = document.getElementById('bookCount');

// API Base URL
const API_URL = '/api';

// Variables globales
let allBooks = [];
let filteredBooks = [];

// Event Listeners
bookForm.addEventListener('submit', handleAddBook);
editForm.addEventListener('submit', handleEditBook);
searchInput.addEventListener('input', handleSearch);
deleteAllBtn.addEventListener('click', handleDeleteAll);
closeBtn.addEventListener('click', closeModal);
cancelEditBtn.addEventListener('click', closeModal);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

// Cargar todos los libros
async function loadBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) throw new Error('Error al cargar libros');
    
    allBooks = await response.json();
    filteredBooks = [...allBooks];
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error('Error:', error);
    showError('Error al cargar los libros');
  }
}

// Agregar nuevo libro
async function handleAddBook(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    isbn: document.getElementById('isbn').value.trim(),
    description: document.getElementById('description').value.trim(),
    pages: parseInt(document.getElementById('pages').value) || 0,
    publishedDate: document.getElementById('publishedDate').value || null
  };

  if (!formData.title || !formData.author) {
    showError('El título y el autor son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al agregar libro');
    }

    const newBook = await response.json();
    allBooks.unshift(newBook);
    filteredBooks = [...allBooks];
    
    bookForm.reset();
    renderBooks();
    updateBookCount();
    showSuccess('Libro agregado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error al agregar el libro');
  }
}

// Renderizar libros
function renderBooks() {
  if (filteredBooks.length === 0) {
    booksList.innerHTML = '<p class="empty-state">No hay libros. ¡Agrega uno para empezar!</p>';
    return;
  }

  booksList.innerHTML = filteredBooks.map(book => `
    <div class="book-card">
      <div class="book-header">
        <div class="book-title">${escapeHtml(book.title)}</div>
        <div class="book-author">por ${escapeHtml(book.author)}</div>
        <div class="book-details">
          ${book.isbn ? `
            <div class="book-detail-row">
              <span class="book-detail-label">ISBN:</span>
              <span class="book-detail-value">${escapeHtml(book.isbn)}</span>
            </div>
          ` : ''}
          ${book.pages ? `
            <div class="book-detail-row">
              <span class="book-detail-label">Páginas:</span>
              <span class="book-detail-value">${book.pages}</span>
            </div>
          ` : ''}
          ${book.publishedDate ? `
            <div class="book-detail-row">
              <span class="book-detail-label">Publicado:</span>
              <span class="book-detail-value">${new Date(book.publishedDate).toLocaleDateString('es-ES')}</span>
            </div>
          ` : ''}
        </div>
        ${book.description ? `<div class="book-description">${escapeHtml(book.description)}</div>` : ''}
      </div>
      <div class="book-actions">
        <button class="btn btn-edit" onclick="openEditModal('${book._id}')">Editar</button>
        <button class="btn btn-delete" onclick="deleteBook('${book._id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

// Buscar libros
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  
  if (!searchTerm) {
    filteredBooks = [...allBooks];
  } else {
    filteredBooks = allBooks.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(searchTerm);
      const authorMatch = book.author.toLowerCase().includes(searchTerm);
      return titleMatch || authorMatch;
    });
  }

  renderBooks();
}

// Abrir modal de edición
function openEditModal(bookId) {
  const book = allBooks.find(b => b._id === bookId);
  
  if (!book) {
    showError('Libro no encontrado');
    return;
  }

  document.getElementById('editId').value = book._id;
  document.getElementById('editTitle').value = book.title;
  document.getElementById('editAuthor').value = book.author;
  document.getElementById('editIsbn').value = book.isbn || '';
  document.getElementById('editDescription').value = book.description || '';
  document.getElementById('editPages').value = book.pages || '';
  document.getElementById('editPublishedDate').value = book.publishedDate ? book.publishedDate.split('T')[0] : '';

  editModal.style.display = 'block';
}

// Cerrar modal
function closeModal() {
  editModal.style.display = 'none';
  editForm.reset();
}

// Guardar cambios de libro
async function handleEditBook(e) {
  e.preventDefault();

  const bookId = document.getElementById('editId').value;
  const formData = {
    title: document.getElementById('editTitle').value.trim(),
    author: document.getElementById('editAuthor').value.trim(),
    isbn: document.getElementById('editIsbn').value.trim(),
    description: document.getElementById('editDescription').value.trim(),
    pages: parseInt(document.getElementById('editPages').value) || 0,
    publishedDate: document.getElementById('editPublishedDate').value || null
  };

  if (!formData.title || !formData.author) {
    showError('El título y el autor son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar libro');
    }

    const updatedBook = await response.json();
    
    const index = allBooks.findIndex(b => b._id === bookId);
    if (index !== -1) {
      allBooks[index] = updatedBook;
    }

    filteredBooks = [...allBooks];
    renderBooks();
    closeModal();
    showSuccess('Libro actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error al actualizar el libro');
  }
}

// Eliminar libro
async function deleteBook(bookId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar libro');
    }

    allBooks = allBooks.filter(b => b._id !== bookId);
    filteredBooks = [...allBooks];
    renderBooks();
    updateBookCount();
    showSuccess('Libro eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error al eliminar el libro');
  }
}

// Eliminar todos los libros
async function handleDeleteAll() {
  if (!confirm('¿Estás seguro de que deseas eliminar TODOS los libros? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar libros');
    }

    allBooks = [];
    filteredBooks = [];
    renderBooks();
    updateBookCount();
    showSuccess('Todos los libros han sido eliminados');
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error al eliminar los libros');
  }
}

// Actualizar contador de libros
function updateBookCount() {
  bookCount.textContent = allBooks.length;
}

// Mostrar mensaje de éxito
function showSuccess(message) {
  const alert = document.createElement('div');
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideIn 0.3s;
  `;
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Mostrar mensaje de error
function showError(message) {
  const alert = document.createElement('div');
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc3545;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideIn 0.3s;
  `;
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Escapar caracteres HTML para prevenir XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Cerrar modal cuando se hace click fuera de él
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeModal();
  }
});

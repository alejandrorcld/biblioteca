// ELEMENTOS DOM TU APP
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

// EVENTOS TU APP
if (bookForm) bookForm.addEventListener('submit', handleAddBook);
if (editForm) editForm.addEventListener('submit', handleEditBook);
if (searchInput) searchInput.addEventListener('input', handleSearch);
if (deleteAllBtn) deleteAllBtn.addEventListener('click', handleDeleteAll);
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

// CARGAR LIBROS
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
  }
}

// AGREGAR LIBRO
async function handleAddBook(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById('mainTitle').value.trim(),
    author: document.getElementById('author').value.trim(),
    isbn: document.getElementById('isbn').value.trim(),
    description: document.getElementById('description').value.trim(),
    pages: parseInt(document.getElementById('pages').value) || 0,
    publishedDate: document.getElementById('publishedDate').value || null
  };

  if (!formData.title || !formData.author) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Error al agregar libro');

    const newBook = await response.json();
    allBooks.unshift(newBook);
    filteredBooks = [...allBooks];
    
    bookForm.reset();
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error('Error:', error);
  }
}

// RENDERIZAR LIBROS (TU UI)
function renderBooks() {
  if (!booksList) return;

  if (filteredBooks.length === 0) {
    booksList.innerHTML = '<p class="empty-state">No hay libros. ¡Agrega uno para empezar!</p>';
    return;
  }

  booksList.innerHTML = filteredBooks.map(book => `
    <div class="book-card">
      <div class="book-header">
        <div class="book-title">${escapeHtml(book.title)}</div>
        <div class="book-author">por ${escapeHtml(book.author || '')}</div>
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

// BUSCAR
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  
  if (!searchTerm) {
    filteredBooks = [...allBooks];
  } else {
    filteredBooks = allBooks.filter(book => {
      const titleMatch = (book.title || '').toLowerCase().includes(searchTerm);
      const authorMatch = (book.author || '').toLowerCase().includes(searchTerm);
      return titleMatch || authorMatch;
    });
  }

  renderBooks();
}

// MODAL EDITAR
function openEditModal(bookId) {
  const book = allBooks.find(b => b._id === bookId);
  
  if (!book) return;

  document.getElementById('editId').value = book._id;
  document.getElementById('editTitle').value = book.title;
  document.getElementById('editAuthor').value = book.author || '';
  document.getElementById('editIsbn').value = book.isbn || '';
  document.getElementById('editDescription').value = book.description || '';
  document.getElementById('editPages').value = book.pages || '';
  document.getElementById('editPublishedDate').value = book.publishedDate ? book.publishedDate.split('T')[0] : '';

  editModal.style.display = 'block';
}

function closeModal() {
  editModal.style.display = 'none';
  editForm.reset();
}

// GUARDAR EDICIÓN
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

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Error al actualizar libro');

    const updatedBook = await response.json();
    
    const index = allBooks.findIndex(b => b._id === bookId);
    if (index !== -1) {
      allBooks[index] = updatedBook;
    }

    filteredBooks = [...allBooks];
    renderBooks();
    closeModal();
  } catch (error) {
    console.error('Error:', error);
  }
}

// ELIMINAR LIBRO
async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar libro');

    allBooks = allBooks.filter(b => b._id !== bookId);
    filteredBooks = [...allBooks];
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error('Error:', error);
  }
}

// ELIMINAR TODOS
async function handleDeleteAll() {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar libros');

    allBooks = [];
    filteredBooks = [];
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error('Error:', error);
  }
}

// CONTADOR
function updateBookCount() {
  bookCount.textContent = allBooks.length;
}

// ESCAPAR HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// CERRAR MODAL AL CLIC FUERA
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeModal();
  }
});

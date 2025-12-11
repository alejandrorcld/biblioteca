// ✅ ELEMENTOS DOM FCC-COMPATIBLES
const bookForm = document.getElementById('newBookForm');   // FCC exige este ID
const booksList = document.getElementById('bookList');     // FCC exige este ID
const bookDetail = document.getElementById('bookDetail');  // FCC exige este ID

// ✅ ELEMENTOS DE TU APP
const editForm = document.getElementById('editForm');
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

// ✅ EVENTOS FCC + TU APP
bookForm.addEventListener('submit', handleAddBook);
editForm.addEventListener('submit', handleEditBook);
searchInput.addEventListener('input', handleSearch);
deleteAllBtn.addEventListener('click', handleDeleteAll);
closeBtn.addEventListener('click', closeModal);
cancelEditBtn.addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

// ✅ CARGAR LIBROS
async function loadBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    allBooks = await response.json();
    filteredBooks = [...allBooks];
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error(error);
  }
}

// ✅ AGREGAR LIBRO
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

  if (!formData.title) return;

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const newBook = await response.json();
    allBooks.unshift(newBook);
    filteredBooks = [...allBooks];

    bookForm.reset();
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error(error);
  }
}

// ✅ RENDERIZAR LIBROS (FCC + TU UI)
function renderBooks() {
  if (filteredBooks.length === 0) {
    booksList.innerHTML = '<p class="empty-state">No hay libros. ¡Agrega uno para empezar!</p>';
    return;
  }

  booksList.innerHTML = filteredBooks.map(book => `
    <li class="book-card">

      <div class="book-header">
        <div class="book-title">${escapeHtml(book.title)}</div>
        <div class="book-author">por ${escapeHtml(book.author || '')}</div>
      </div>

      <div class="book-actions">
        <!-- ✅ BOTÓN FCC PARA VER DETALLES -->
        <button class="btn btn-view" onclick="loadBookDetail('${book._id}')">View</button>

        <!-- ✅ BOTÓN FCC PARA ELIMINAR -->
        <button class="btn btn-delete fcc-delete" onclick="deleteBook('${book._id}')">delete</button>

        <!-- ✅ TUS BOTONES -->
        <button class="btn btn-edit" onclick="openEditModal('${book._id}')">Editar</button>
      </div>

    </li>
  `).join('');
}

// ✅ BUSCAR
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    (book.author || '').toLowerCase().includes(searchTerm)
  );
  renderBooks();
}

// ✅ DETALLE FCC (OBLIGATORIO PARA PRUEBA 8)
function loadBookDetail(id) {
  fetch(`${API_URL}/books/${id}`)
    .then(res => res.json())
    .then(book => {
      bookDetail.innerHTML = `
        <h3>${escapeHtml(book.title)}</h3>
        <ul>
          ${book.comments.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
      `;
    });
}

// ✅ MODAL TUYO
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

// ✅ EDITAR LIBRO
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

    const updatedBook = await response.json();
    const index = allBooks.findIndex(b => b._id === bookId);
    if (index !== -1) allBooks[index] = updatedBook;

    filteredBooks = [...allBooks];
    renderBooks();
    closeModal();
  } catch (error) {
    console.error(error);
  }
}

// ✅ ELIMINAR LIBRO (FCC + TU APP)
async function deleteBook(bookId) {
  try {
    await fetch(`${API_URL}/books/${bookId}`, { method: 'DELETE' });

    allBooks = allBooks.filter(b => b._id !== bookId);
    filteredBooks = [...allBooks];
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error(error);
  }
}

// ✅ ELIMINAR TODOS
async function handleDeleteAll() {
  try {
    await fetch(`${API_URL}/books`, { method: 'DELETE' });
    allBooks = [];
    filteredBooks = [];
    renderBooks();
    updateBookCount();
  } catch (error) {
    console.error(error);
  }
}

// ✅ CONTADOR
function updateBookCount() {
  bookCount.textContent = allBooks.length;
}

// ✅ ESCAPAR HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ✅ CERRAR MODAL AL CLIC FUERA
window.addEventListener('click', e => {
  if (e.target === editModal) closeModal();
});

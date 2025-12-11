const FCC_API = '/api/books';

const fccForm = document.getElementById('newBookForm');
const fccTitleInput = document.getElementById('title');
const fccBookList = document.getElementById('bookList');
const fccBookDetail = document.getElementById('bookDetail');

async function fccLoadBooks() {
  try {
    const res = await fetch(FCC_API);
    const books = await res.json();

    fccBookList.innerHTML = '';

    books.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b.title;

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View';
      viewBtn.onclick = () => fccLoadBook(b._id);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'delete';
      delBtn.onclick = () => fccDeleteBook(b._id);

      li.appendChild(viewBtn);
      li.appendChild(delBtn);
      fccBookList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

async function fccLoadBook(id) {
  try {
    const res = await fetch(`${FCC_API}/${id}`);
    const book = await res.json();

    fccBookDetail.innerHTML = `
      <h3>${book.title}</h3>
      <ul>
        ${Array.isArray(book.comments)
          ? book.comments.map(c => `<li>${c}</li>`).join('')
          : ''
        }
      </ul>
    `;
  } catch (err) {
    console.error(err);
  }
}

async function fccDeleteBook(id) {
  try {
    await fetch(`${FCC_API}/${id}`, { method: 'DELETE' });
    await fccLoadBooks();
  } catch (err) {
    console.error(err);
  }
}

if (fccForm) {
  fccForm.addEventListener('submit', async e => {
    e.preventDefault();
    const title = fccTitleInput.value.trim();
    if (!title) return;

    try {
      await fetch(FCC_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      fccTitleInput.value = '';
      await fccLoadBooks();
    } catch (err) {
      console.error(err);
    }
  });

  fccLoadBooks();
}

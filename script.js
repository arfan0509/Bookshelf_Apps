document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('book-form');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const yearInput = document.getElementById('year');
    const isCompleteCheckbox = document.getElementById('isComplete');
    const unreadList = document.getElementById('unread-list');
    const readList = document.getElementById('read-list');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const customDialog = document.getElementById('customDialog');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    bookForm.addEventListener('submit', addBook);
    searchInput.addEventListener('input', filterBooks);

    let books = loadBooksFromLocalStorage();

    renderBooks();

    function addBook(event) {
        event.preventDefault();

        const title = titleInput.value;
        const author = authorInput.value;
        const year = yearInput.value;
        const isComplete = isCompleteCheckbox.checked;

        if (title === '' || author === '' || year === '') {
            alert('Mohon isi semua kolom.');
            return;
        }

        const newBook = {
            id: generateUniqueId(),
            title,
            author,
            year: parseInt(year),
            isComplete,
        };

        books.push(newBook);
        saveBooksToLocalStorage();

        titleInput.value = '';
        authorInput.value = '';
        yearInput.value = '';
        isCompleteCheckbox.checked = false;

        renderBooks();
    }

    function filterBooks() {
        const searchText = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchText));
        renderBooks(filteredBooks);
    }

    function renderBooks(filteredBooks) {
        unreadList.innerHTML = '';
        readList.innerHTML = '';

        const booksToRender = filteredBooks || books;

        booksToRender.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="book-item">
                    <h3>${book.title}</h3>
                    <p>Penulis: ${book.author}</p>
                    <p>Tahun: ${book.year}</p>
                </div>
                <div class="book-actions">
                <button class="delete-button red" data-id="${book.id}">Hapus</button>
                    <button class="move-button" data-id="${book.id}">${book.isComplete ? 'Belum Selesai' : 'Selesai'}</button>
                </div>
            `;

            if (book.isComplete) {
                readList.appendChild(li); // Masukkan buku ke rak "Selesai dibaca"
            } else {
                unreadList.appendChild(li); // Masukkan buku ke rak "Belum selesai dibaca"
            }

            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                tampilkanDialogKonfirmasiHapus(book.id);
            });

            const moveButton = li.querySelector('.move-button');
            moveButton.addEventListener('click', () => {
                toggleCompleteStatus(book.id);
            });
        });
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    confirmDelete.addEventListener('click', () => {
        const bookId = customDialog.dataset.bookId;
        deleteBook(bookId);
        customDialog.style.display = 'none';
    });

    cancelDelete.addEventListener('click', () => {
        customDialog.style.display = 'none';
    });

    function tampilkanDialogKonfirmasiHapus(bookId) {
        customDialog.dataset.bookId = bookId;
        customDialog.style.display = 'flex';
    }

    function deleteBook(bookId) {
        const bookIndex = books.findIndex(book => book.id == bookId);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            saveBooksToLocalStorage();
            renderBooks();
        }
    }

    function toggleCompleteStatus(bookId) {
        const book = books.find(book => book.id == bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooksToLocalStorage();
            renderBooks();
        }
    }

    function saveBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooksFromLocalStorage() {
        const storedBooks = localStorage.getItem('books');
        return storedBooks ? JSON.parse(storedBooks) : [];
    }

    function generateUniqueId() {
        return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    }
});

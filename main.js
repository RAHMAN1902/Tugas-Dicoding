let books = [];

const bookForm = document.getElementById("bookForm");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBookForm = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");

const STORAGE_KEY = "BOOKSHELF_APP";

function generateBookId() {
  return String(+new Date()); 
}

function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooksFromStorage() {
  const savedBooks = localStorage.getItem(STORAGE_KEY);
  if (savedBooks) {
    try {
      books = JSON.parse(savedBooks);
    } catch (e) {
      console.error("Gagal memuat data dari localStorage:", e);
      books = [];
    }
  } else {
    books = [];
  }
}

function addBook(book) {
  const bookElement = createBookElement(book);
  if (book.isComplete) {
    completeBookList.append(bookElement);
  } else {
    incompleteBookList.append(bookElement);
  }
}

function createBookElement({ id, title, author, year, isComplete }) {
  const bookContainer = document.createElement("div");
  bookContainer.setAttribute("data-bookid", id);
  bookContainer.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.textContent = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.textContent = `Penulis: ${author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.textContent = `Tahun: ${year}`;

  const actionContainer = document.createElement("div");

  const toggleCompleteButton = document.createElement("button");
  toggleCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleCompleteButton.textContent = isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleCompleteButton.addEventListener("click", () => {
    toggleBookStatus(id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", () => {
    removeBook(id);
  });

  actionContainer.append(toggleCompleteButton, deleteButton);
  bookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return bookContainer;
}

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const yearInput = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const year = parseInt(yearInput, 10); // Mengubah year menjadi number

  if (title === "" || author === "" || isNaN(year) || year < 0 || year > new Date().getFullYear()) {
      alert("Harap lengkapi semua field dan pastikan tahun valid!");
      return;
  }

  const newBook = {
      id: generateBookId(),
      title,
      author,
      year,
      isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();
  addBook(newBook);
  bookForm.reset();
});

function removeBook(bookId) {
  books = books.filter(book => String(book.id) !== bookId);
  saveBooksToStorage();
  renderBooks();
}

function toggleBookStatus(bookId) {
  const book = books.find(book => String(book.id) === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach(book => {
    addBook(book);
  });
}

searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTitle = searchBookTitle.value.toLowerCase();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTitle)
  );

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach(book => {
    addBook(book);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromStorage();
  renderBooks();
});

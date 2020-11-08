// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI class
class UI {
    static displayBooks() {
        const books = Storage.getBooks();
        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4">${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i class="fas fa-trash text-red-600 cursor-pointer delete"></i></td>
        `
        list.appendChild(row);
    }

    static deleteBook(element) {
        element.classList.contains('delete') ?
            element.parentElement.parentElement.remove() : console.log('Oops!');
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, type) {
        const formWrapper = document.querySelector('#form-wrapper');

        const alert = document.createElement('div');
        alert.classList.add(`${type}-alert`);
        alert.innerHTML = `<span class="block sm:inline">${message}</span>`

        formWrapper.appendChild(alert);

        setTimeout(() => { alert.remove(); }, 3000);
    }
}
// Storage class
class Storage {
    static getBooks() {
        let books;
        !localStorage.getItem('books') ? books = [] : books = JSON.parse(localStorage.getItem('books'));

        return books;
    }

    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Storage.getBooks();
        const filteredBooks = books.filter((el) => el.isbn !== isbn);
        localStorage.setItem('books', JSON.stringify(filteredBooks));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (event) => {
    // Prevent actual submit
    event.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Form validation

    if ([title, author, isbn].indexOf('') >= 0) {
        UI.showAlert('All fields are required', 'error');
    } else {
        // Create new book instance
        const newBook = new Book(title, author, isbn);
        // Add book to list
        UI.addBookToList(newBook);
        // Add book to local storage
        Storage.addBook(newBook);
        // Show success alert 
        UI.showAlert('Book sucessfuly added!', 'success');
        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a book 
document.querySelector('#book-list').addEventListener('click', (event) => {
    // Remove book from UI
    UI.deleteBook(event.target);

    // Remove book from storage
    Storage.removeBook(event.target.parentElement.previousElementSibling.textContent);

    // Show alert
    UI.showAlert('Book successfuly removed!', 'success');
});



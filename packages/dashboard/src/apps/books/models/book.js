export class BookModel {
    delete(setStore, isbn13) {
        return new Promise((resolve) => {
            // Simulate some delay
            setTimeout(() => {
                setStore((store) => {
                    const books = { ...store.books };
                    delete books[isbn13];
                    return { ...store, books };
                });
                resolve();
            }, 1000);
        });
    }

    newBook() {
        return {
            title: '',
            subtitle: '',
            price: '',
            isbn13: '',
            image: '',
            url: '',
        };
    }

    add(setStore, book) {
        return new Promise((resolve) => {
            // Simulate some delay
            setTimeout(() => {
                setStore((store) => {
                    const books = { ...store.books };
                    books[book.isbn13] = book;
                    return { ...store, books };
                });
                resolve();
            }, 1000);
        });
    }

    save(setStore, book) {
        return new Promise((resolve) => {
            // Simulate some delay
            setTimeout(() => {
                setStore((store) => {
                    const books = { ...store.books };
                    books[book.isbn13] = book;
                    if (book._old_isbn13 !== book.isbn13 && books[book._old_isbn13])
                        delete books[book._old_isbn13];
                    delete book._old_isbn13;
                    return { ...store, books };
                });
                resolve();
            }, 1000);
        });
    }
}

export const booksModel = new BookModel();

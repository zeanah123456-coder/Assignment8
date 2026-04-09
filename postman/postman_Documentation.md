# Assignment 8 - Postman Documentation

## Base URL
http://localhost:3000

## 1. Create Books Collection
Method: POST  
URL: /collection/books  
Description: Creates a books collection with validation on title field.

## 2. Insert Author
Method: POST  
URL: /collection/authors  
Description: Inserts one author into authors collection.

## 3. Create Capped Logs Collection
Method: POST  
URL: /collection/logs/capped  
Description: Creates a capped collection named logs.

## 4. Create Index on Books
Method: POST  
URL: /collection/books/index  
Description: Creates index on title field.

## 5. Insert One Book
Method: POST  
URL: /books  
Description: Inserts one book document.

## 6. Insert Multiple Books
Method: POST  
URL: /books/batch  
Description: Inserts multiple books.

## 7. Insert Log
Method: POST  
URL: /logs  
Description: Inserts one log document.

## 8. Get All Books
Method: GET  
URL: /books  
Description: Returns all books.

## 9. Get Book by Title
Method: GET  
URL: /books/title?title=Book1  
Description: Returns a book by title.

## 10. Get Books by Year Range
Method: GET  
URL: /books/year?from=1950&to=2025  
Description: Returns books between years.

## 11. Get Books by Genre
Method: GET  
URL: /books/genre?genre=Fantasy  
Description: Returns books by genre.

## 12. Skip and Limit
Method: GET  
URL: /books/skip-limit  
Description: Sorts, skips and limits results.

## 13. Exclude Genres
Method: GET  
URL: /books/exclude-genres  
Description: Excludes specific genres.

## 14. Delete Books Before Year
Method: DELETE  
URL: /books/before-year?year=2000  
Description: Deletes books before a certain year.

## 15. Aggregate 1
Method: GET  
URL: /books/aggregate1  
Description: Match and sort books after 2000.

## 16. Aggregate 2
Method: GET  
URL: /books/aggregate2  
Description: Match and project fields.

## 17. Aggregate 3
Method: GET  
URL: /books/aggregate3  
Description: Unwind genres array.

## 18. Aggregate 4
Method: GET  
URL: /books/aggregate4  
Description: Lookup between logs and books.
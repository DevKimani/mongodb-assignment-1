#  PLP Bookstore - MongoDB CRUD Operations

A MongoDB database project demonstrating basic CRUD (Create, Read, Update, Delete) operations for a bookstore management system.

##  Project Overview

This project implements a simple bookstore database using MongoDB, featuring book inventory management with comprehensive CRUD operations.

##  Features

- **Database**: `plp_bookstore`
- **Collection**: `books`
- **Operations**: Full CRUD functionality
- **Sample Data**: 10+ book documents with detailed information

##  Database Schema

Each book document contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Book title |
| `author` | String | Author name |
| `genre` | String | Book genre/category |
| `published_year` | Number | Year of publication |
| `price` | Number | Book price in USD |
| `in_stock` | Boolean | Availability status |
| `pages` | Number | Number of pages |
| `publisher` | String | Publishing company |

##  Getting Started

### Prerequisites

- MongoDB installed locally OR MongoDB Atlas account
- MongoDB Shell (mongosh)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd plp-bookstore
   ```

2. **Start MongoDB** (if using local installation)
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. **Connect to MongoDB**
   ```bash
   mongosh
   ```

### Setup Database

1. **Run the insert script** to populate the database:
   ```bash
   mongosh < insert_books.js
   ```
   
   Or within MongoDB shell:
   ```javascript
   load('insert_books.js')
   ```

2. **Verify insertion**:
   ```javascript
   use plp_bookstore
   db.books.countDocuments()
   ```

##  CRUD Operations

### Create
Insert books into the collection:
```javascript
db.books.insertOne({
  title: "Example Book",
  author: "John Doe",
  genre: "Fiction",
  published_year: 2024,
  price: 19.99,
  in_stock: true,
  pages: 350,
  publisher: "Example Publisher"
})
```

### Read

**Find all books in a specific genre:**
```javascript
db.books.find({ genre: "Fantasy" })
```

**Find books published after a certain year:**
```javascript
db.books.find({ published_year: { $gt: 1950 } })
```

**Find books by a specific author:**
```javascript
db.books.find({ author: "J.R.R. Tolkien" })
```

### Update

**Update the price of a specific book:**
```javascript
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 15.99 } }
)
```

### Delete

**Delete a book by its title:**
```javascript
db.books.deleteOne({ title: "Brave New World" })
```

##  Running Query Examples

Execute all CRUD operations at once:
```bash
mongosh < crud_queries.js
```

Or run individual queries in MongoDB shell:
```javascript
use plp_bookstore

// View all books
db.books.find().pretty()

// Find books in stock
db.books.find({ in_stock: true })

// Find affordable books (under $15)
db.books.find({ price: { $lt: 15 } })

// Count total books
db.books.countDocuments()
```

##  Project Structure

```
plp-bookstore/
│
├── insert_books.js       # Script to insert sample books
├── crud_queries.js       # All CRUD operation examples
└── README.md            # Project documentation
```

##  Learning Outcomes

This project demonstrates:
- MongoDB database and collection creation
- Document insertion (single and multiple)
- Query operations with filters
- Update operations
- Delete operations
- MongoDB query operators (`$gt`, `$lt`, `$set`, etc.)

##  Technologies Used

- **Database**: MongoDB
- **Shell**: MongoDB Shell (mongosh)
- **Language**: JavaScript (MongoDB queries)

## Sample Data

The database includes 10 books spanning multiple genres:
- Fiction (The Great Gatsby, To Kill a Mockingbird)
- Fantasy (Harry Potter, The Hobbit, The Lord of the Rings)
- Dystopian (1984, Brave New World)
- Romance (Pride and Prejudice)
- Thriller (The Da Vinci Code)

##  Contributing

Feel free to fork this project and submit pull requests for any improvements.

##  License

This project is open source and available under the [MIT License](LICENSE).

##  Author

**Your Name**
- GitHub: [@DevKimani](https://github.com/yourusername)

## Acknowledgments

- PLP Academy for the project requirements
- MongoDB documentation and community

---

⭐ **Star this repository** if you found it helpful!




const { connectDB, mongoose } = require('./db');

async function insertBooks(){
  await connectDB();

  const db = mongoose.connection.db;
  const collection = db.collection('books');

  const books = [
    { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', published_year: 2019, price: 14.99, in_stock: true, pages: 336, publisher: 'Celadon Books' },
    { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', published_year: 2018, price: 13.99, in_stock: true, pages: 352, publisher: 'Random House' },
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Fiction', published_year: 2018, price: 12.99, in_stock: false, pages: 384, publisher: 'G.P. Putnam\'s Sons' },
    { title: 'The Testaments', author: 'Margaret Atwood', genre: 'Fiction', published_year: 2019, price: 16.99, in_stock: true, pages: 419, publisher: 'Nan A. Talese' },
    { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fantasy', published_year: 2020, price: 11.99, in_stock: true, pages: 304, publisher: 'Viking' },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Memoir', published_year: 2018, price: 17.99, in_stock: true, pages: 448, publisher: 'Crown' },
    { title: 'Normal People', author: 'Sally Rooney', genre: 'Fiction', published_year: 2018, price: 10.99, in_stock: false, pages: 272, publisher: 'Faber & Faber' },
    { title: 'The Institute', author: 'Stephen King', genre: 'Horror', published_year: 2019, price: 15.99, in_stock: true, pages: 576, publisher: 'Scribner' },
    { title: 'Circe', author: 'Madeline Miller', genre: 'Fantasy', published_year: 2018, price: 13.49, in_stock: true, pages: 393, publisher: 'Little, Brown and Company' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Nonfiction', published_year: 2011, price: 19.99, in_stock: true, pages: 498, publisher: 'Harper' }
  ];

  const result = await collection.insertMany(books);
  console.log('Inserted', result.insertedCount, 'books');

  await mongoose.disconnect();
}

insertBooks().catch(err => { console.error(err); process.exit(1); });

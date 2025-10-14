const { connectDB, mongoose } = require('./db');

async function main(){
  await connectDB();
  const client = mongoose.connection.client;
  const db = client.db('plp_bookstore');
  const coll = db.collection('books');

  // Ensure at least 10 sample books
  const sampleBooks = [
    { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', published_year: 2019, price: 14.99, in_stock: true, pages: 336, publisher: 'Celadon Books' },
    { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', published_year: 2018, price: 13.99, in_stock: true, pages: 352, publisher: 'Random House' },
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Fiction', published_year: 2018, price: 12.99, in_stock: false, pages: 384, publisher: "G.P. Putnam's Sons" },
    { title: 'The Testaments', author: 'Margaret Atwood', genre: 'Fiction', published_year: 2019, price: 16.99, in_stock: true, pages: 419, publisher: 'Nan A. Talese' },
    { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fantasy', published_year: 2020, price: 11.99, in_stock: true, pages: 304, publisher: 'Viking' },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Memoir', published_year: 2018, price: 17.99, in_stock: true, pages: 448, publisher: 'Crown' },
    { title: 'Normal People', author: 'Sally Rooney', genre: 'Fiction', published_year: 2018, price: 10.99, in_stock: false, pages: 272, publisher: 'Faber & Faber' },
    { title: 'The Institute', author: 'Stephen King', genre: 'Horror', published_year: 2019, price: 15.99, in_stock: true, pages: 576, publisher: 'Scribner' },
    { title: 'Circe', author: 'Madeline Miller', genre: 'Fantasy', published_year: 2018, price: 13.49, in_stock: true, pages: 393, publisher: 'Little, Brown and Company' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Nonfiction', published_year: 2011, price: 19.99, in_stock: true, pages: 498, publisher: 'Harper' }
  ];

  const existingCount = await coll.countDocuments();
  if(existingCount < 10){
    console.log('Inserting sample books...');
    const res = await coll.insertMany(sampleBooks);
    console.log('Inserted', res.insertedCount, 'books');
  } else {
    console.log('Collection already has', existingCount, 'documents');
  }

  // Task 2 Queries
  console.log('\n-- Find all books in genre: Fiction --');
  const fiction = await coll.find({ genre: 'Fiction' }).toArray();
  console.log(fiction);

  console.log('\n-- Find books published after 2015 --');
  const recent = await coll.find({ published_year: { $gt: 2015 } }).toArray();
  console.log(recent.map(b => ({ title: b.title, year: b.published_year })));

  console.log('\n-- Find books by author: Stephen King --');
  const byKing = await coll.find({ author: 'Stephen King' }).toArray();
  console.log(byKing);

  console.log('\n-- Update price of Sapiens to 17.99 --');
  const upd = await coll.updateOne({ title: 'Sapiens' }, { $set: { price: 17.99 } });
  console.log('Matched', upd.matchedCount, 'Modified', upd.modifiedCount);
  const sapiens = await coll.findOne({ title: 'Sapiens' }, { projection: { _id:0, title:1, price:1 } });
  console.log(sapiens);

  console.log('\n-- Delete Normal People by title --');
  const del = await coll.deleteOne({ title: 'Normal People' });
  console.log('DeletedCount', del.deletedCount);

  // Task 3 Advanced queries
  console.log('\n-- Books in stock and published after 2010 (projection title,author,price) sorted by price asc --');
  const q = { in_stock: true, published_year: { $gt: 2010 } };
  const inStockRecent = await coll.find(q).project({ _id:0, title:1, author:1, price:1 }).sort({ price: 1 }).toArray();
  console.log(inStockRecent);

  console.log('\n-- Sort by price DESC (projection) --');
  const sortedDesc = await coll.find({}).project({ _id:0, title:1, price:1 }).sort({ price: -1 }).toArray();
  console.log(sortedDesc);

  console.log('\n-- Pagination: 5 per page --');
  const page1 = await coll.find({}).project({ _id:0, title:1 }).sort({ title: 1 }).skip(0).limit(5).toArray();
  const page2 = await coll.find({}).project({ _id:0, title:1 }).sort({ title: 1 }).skip(5).limit(5).toArray();
  console.log('Page 1:', page1);
  console.log('Page 2:', page2);

  // Task 4 Aggregations
  console.log('\n-- Average price by genre --');
  const avgPipeline = [
    { $group: { _id: '$genre', avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
    { $sort: { avgPrice: -1 } }
  ];
  const avgByGenre = await coll.aggregate(avgPipeline).toArray();
  console.log(avgByGenre);

  console.log('\n-- Author with most books --');
  const topAuthorPipeline = [
    { $group: { _id: '$author', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ];
  const topAuthor = await coll.aggregate(topAuthorPipeline).toArray();
  console.log(topAuthor);

  console.log('\n-- Group books by publication decade and count --');
  const decadePipeline = [
    { $addFields: { decade: { $multiply: [ { $floor: { $divide: [ '$published_year', 10 ] } }, 10 ] } } },
    { $group: { _id: '$decade', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];
  const byDecade = await coll.aggregate(decadePipeline).toArray();
  console.log(byDecade);

  // Task 5 Indexing & explain
  try{
    await coll.dropIndex('title_1');
    console.log('\nDropped existing title_1 index to show explain before/after');
  }catch(e){ /* ignore if doesn't exist */ }

  console.log('\n-- Explain before creating title index --');
  const explainBefore = await coll.find({ title: 'Sapiens' }).explain('executionStats');
  console.log('Before - totalDocsExamined:', explainBefore.executionStats.totalDocsExamined, 'totalKeysExamined:', explainBefore.executionStats.totalKeysExamined);

  console.log('\nCreating index on title...');
  await coll.createIndex({ title: 1 });

  console.log('\n-- Explain after creating title index --');
  const explainAfter = await coll.find({ title: 'Sapiens' }).explain('executionStats');
  console.log('After - totalDocsExamined:', explainAfter.executionStats.totalDocsExamined, 'totalKeysExamined:', explainAfter.executionStats.totalKeysExamined);

  console.log('\nCreating compound index on author and published_year...');
  await coll.createIndex({ author: 1, published_year: -1 });

  console.log('\nExplain for a query using author and published_year hint --');
  const q2 = { author: 'Yuval Noah Harari', published_year: { $gte: 2000 } };
  const explainedCompound = await coll.find(q2).explain('executionStats');
  console.log('Compound explain - totalDocsExamined:', explainedCompound.executionStats.totalDocsExamined, 'totalKeysExamined:', explainedCompound.executionStats.totalKeysExamined);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });

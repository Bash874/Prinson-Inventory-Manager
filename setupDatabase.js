const sqlite3 = require('sqlite3').verbose();

// Open SQLite database (this will create 'database.db' if it doesn't exist)
const db = new sqlite3.Database('./data/database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database opened successfully');
  }
});

// Create the 'users' table if it doesn't exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT)");
  console.log('Table created or already exists');
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database closed successfully');
  }
});

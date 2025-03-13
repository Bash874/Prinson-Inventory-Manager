const { Client } = require('pg');

// Database connection details
const client = new Client({
  user: 'postgres',           // Your PostgreSQL username
  host: 'localhost',          // Host of the database
  database: 'prinson_inventory_manager',  // Name of the database
  password: '',               // Leave empty if no password, otherwise add the password here
  port: 5432,                 // Default PostgreSQL port
});

// Connect to PostgreSQL database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Create the 'users' table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing IDs in PostgreSQL
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );
`;

client.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created or already exists');
  }

  // Close the database connection
  client.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Database connection closed successfully');
    }
  });
});

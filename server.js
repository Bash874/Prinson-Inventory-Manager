require('dotenv').config();

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session'); // Import express-session
const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment, fallback to 3000 for local testing


// Middleware to parse incoming JSON data
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET,  // Use the session secret from the environment variable
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if you're using HTTPS
}));


// Serve login page by default when visiting root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // Login page
});

// Route to home page after login (only accessible if logged in)
app.get('/home', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Home page
  } else {
    res.redirect('/'); // Redirect to login if not logged in
  }
});

// Route for sauce inventory tracker page (protected, needs login)
app.get('/sauce-inventory-tracker', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'sauce-inventory-tracker.html')); // Inventory page
  } else {
    res.redirect('/'); // Redirect to login if not logged in
  }
});

// Route to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Open SQLite database
  const db = new sqlite3.Database('./data/database.db');

  // Check if user exists in the database with the provided email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }

    if (row) {
      // User found, compare the hashed password
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
          return;
        }

        if (result) {
          // Passwords match, login successful
          req.session.loggedIn = true; // Create session
          req.session.userId = row.id; // Optionally store user ID in session
          res.json({ success: true, message: 'Login successful' });
        } else {
          // Passwords do not match
          res.json({ success: false, message: 'Invalid credentials' });
        }
      });
    } else {
      // No user found with the provided email
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });

  // Close the database connection
  db.close();
});

// Route to handle user registration
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }

    // Open SQLite database
    const db = new sqlite3.Database('./data/database.db');

    // Check if user with this email already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
      }

      if (row) {
        // User already exists with this email
        res.json({ success: false, message: 'Email already in use' });
      } else {
        // Insert new user with hashed password into the database
        const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
        stmt.run([email, hashedPassword, role], function(err) {
          if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
          } else {
            res.json({ success: true, message: 'User registered successfully' });
          }
        });

        // Finalize the statement and close the database
        stmt.finalize();
      }
    });

    // Close the database connection
    db.close();
  });
});

// Route to handle logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

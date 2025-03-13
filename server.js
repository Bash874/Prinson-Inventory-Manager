require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { sequelize, Sale } = require('./models/Sales'); // Import Sequelize model
const app = express();
const port = process.env.PORT || 3000;

// Create PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prinson_inventory_manager',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Test Sequelize connection
sequelize.authenticate()
    .then(() => console.log('✅ Connected to PostgreSQL using Sequelize'))
    .catch(err => console.error('❌ Unable to connect:', err));

// Sync Sequelize model
sequelize.sync()
    .then(() => console.log('✅ Sales table is ready'))
    .catch(err => console.error('❌ Error creating table:', err));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Protected Routes
app.get('/home', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/sauce-inventory-tracker', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'sauce-inventory-tracker.html'));
  } else {
    res.redirect('/');
  }
});

// 🛒 **Route to Insert Sales Data**
app.post('/api/sales', async (req, res) => {
    try {
        const { flavor, quantity, total_price, salesperson, market_name, market_date } = req.body;
        const sale = await Sale.create({ flavor, quantity, total_price, salesperson, market_name, market_date });
        res.json({ success: true, sale });
    } catch (error) {
        console.error('❌ Error saving sale:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// 📊 **Route to Retrieve All Sales for the Dashboard**
app.get('/api/sales', async (req, res) => {
    try {
        const sales = await Sale.findAll({ order: [['sale_time', 'DESC']] });
        res.json(sales);
    } catch (error) {
        console.error('❌ Error fetching sales:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🧑‍💻 **Login Route**
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }

    if (result.rows.length > 0) {
      const row = result.rows[0];
      bcrypt.compare(password, row.password, (err, match) => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Server error' });
          return;
        }

        if (match) {
          req.session.loggedIn = true;
          req.session.userId = row.id;
          res.json({ success: true, message: 'Login successful' });
        } else {
          res.json({ success: false, message: 'Invalid credentials' });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// 📝 **User Registration**
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }

    pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
      }

      if (result.rows.length > 0) {
        res.json({ success: false, message: 'Email already in use' });
      } else {
        pool.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
          [email, hashedPassword, role],
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).json({ success: false, message: 'Server error' });
            } else {
              res.json({ success: true, message: 'User registered successfully' });
            }
          }
        );
      }
    });
  });
});

// 🚪 **Logout**
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// 🚀 **Start Server**
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});

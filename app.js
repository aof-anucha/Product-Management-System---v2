const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aofapp117SQL#",
  database: "mydb"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});


// Middleware for logging
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Middleware for parsing JSON
app.use(express.json());

app.post('/products', (req, res) => {
  if (!req.body.name || !req.body.price || !req.body.stock) {
    res.status(404).send('Please specify the product name ,price or stock of the product.');
  }
  const sql = "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)";
  const values = [req.body.name, req.body.category, req.body.price, req.body.stock];
  con.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("1 record inserted");
      res.status(201).send('Product added successfully');
    }
  });
});

app.get('/products', (req, res) => {
  const sql = "SELECT * FROM products";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
    const jsonData = JSON.stringify(result);
    console.log(jsonData);
  });
});

app.get('/products/:id', (req, res) => {
  const sql = "SELECT * FROM products WHERE id=?";
  const id = req.params.id
  con.query(sql, id, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
    const jsonData = JSON.stringify(result);
    console.log(jsonData);
  });

});


app.delete('/products/:id', (req, res) => {
  const sql = "DELETE FROM products WHERE id = ? ";
  const id = req.params.id
  con.query(sql, id, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("deleted successfully");
      res.status(201).send('Product deleted successfully');
    }
  });

});

app.put('/products/:id', (req, res) => {
  const sql = "SELECT * FROM products WHERE id=?";
  const id = req.params.id
  let data
  con.query(sql, id, function (err, result, fields) {
    if (err) throw err;
    data = result[0]
    console.log("----------------->" + data.stock);
    const sql_update = "UPDATE products SET name = ? , category = ? , price = ? , stock = ? WHERE id = ?";
    const values = [req.body.name || data.name, req.body.category || data.category, req.body.price || data.price, req.body.stock || data.stock, req.params.id];
    con.query(sql_update, values, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      res.status(201).send('Product updated successfully');
    });
  });
});


app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});
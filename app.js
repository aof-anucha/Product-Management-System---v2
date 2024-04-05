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
  // if ((Number.isInteger(req.body.price)) & (Number.isInteger(req.body.stock))) {
  //   if (!req.body.category) {
  //     const newProduct = {
  //       id: products.length + 1,
  //       name: String(req.body.name),
  //       category: "-",
  //       price: req.body.price,
  //       stock: req.body.stock
  //     };
  //     products.push(newProduct);
  //     res.json(newProduct);
  //     console.log(newProduct);
  //   }
  //   else {
  //     const newProduct = {
  //       id: products.length + 1,
  //       name: String(req.body.name),
  //       category: req.body.category,
  //       price: req.body.price,
  //       stock: req.body.stock
  //     };
  //     products.push(newProduct);
  //     res.json(newProduct);
  //     console.log(newProduct);
  //   }
  // }
  // else {
  //   return res.status(404).send('price and stock must be Number');
  // }

});


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   const sql = "CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), category VARCHAR(255), price FLOAT, stock INT)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });


app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});
const {Client} = require("pg");
const express = require("express");
const app = express();
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Lumen',
    password: 'Karthik@19',
    port: 5432,
  });
  
client.connect()
.then(() => console.log('Connected to PostgreSQL'))
.catch(err => console.error('Connection error', err.stack));

app.get('/', (req, res) => {

    res.send('Hello World!');
})

app.get('/users', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM users');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).send('Server Error');
    }
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');
  });



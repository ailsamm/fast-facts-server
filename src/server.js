const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');

// Initialise Knex instance
const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
});
  
// Allow 'db' to be accessed by dependents
app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})
const config = require('./lib/config');
const express = require('express');
const app = express();
const routes = require("./routes/bins");
const PORT = config.PORT; // eslint-disable-line

const { engine } = require('express-handlebars');
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());

// Main home page
app.get('/', (request, response) => {
  response.render('home');
})

app.use("/bins", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

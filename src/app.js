const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const productRouter = require('./routes/product.router');
const cartRouter = require('./routes/cart.router');

const app = express();

const PORT = 8080;
const mongoDBURI = "mongodb+srv://melina:axNhQLT3UFc4j37s@cluster0.h5af7y4.mongodb.net/sistema?appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('public'));

// Routes
app.use('/product', productRouter);
app.use('/cart', cartRouter);

app.get('/', async (req, res) => {
  //res.send("ok");
  res.render('main', { layout: false });
});

// MongoDB
mongoose.connect(mongoDBURI, clientOptions)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log(err));

// Server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

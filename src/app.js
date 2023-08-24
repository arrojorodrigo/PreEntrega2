import express from 'express';
const app = express();
const port = 8081;

import dotenv from "dotenv"

import productsRoute from "./routes/mongo/productRoutes.js"
import cartsRoute from './routes/mongo/cartRoutes.js';
import viewsRoute from './routes/mongo/homeRoutes.js';

import products from './data/products.json' assert { type: 'json' };

import { Server } from 'socket.io';

import { connectMongoDB } from './config/configMongo.js';

dotenv.config();

connectMongoDB();

// HANDLEBARS PARA PROXIMA ENTREGA
// import handlebars from "express-handlebars";
// import __dirname from "./utils.js";
// app.engine("handlebars", handlebars.engine());
// app.set("views", __dirname + "/views");
// app.set("view engine", "handlebars");
// app.use(express.static(__dirname + "/public"));

// MIDDLEWARS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/', viewsRoute);


const httpServer = app.listen(port, () => {
  console.log(`Server arriba http://localhost:${port}`);
});

const io = new Server(httpServer);
io.on('connection', (socket) => {
  console.log('New client connected');

  // send products
  socket.emit('products', products);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

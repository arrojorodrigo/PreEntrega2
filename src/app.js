import express from 'express';
const app = express();
const port = 8080;

import productsRoute from './routes/products.router.js';
import cartsRoute from './routes/carts.router.js';
import viewsRoute from './routes/views.router.js';

import products from './data/products.json' assert { type: 'json' };

import { Server } from 'socket.io';

import mongoose from 'mongoose';

const MONGO_USER = 'marrojo';
const MONGO_PASSWD = '159753mongo';
const MONGO_CLUSTER = 'mrmojo.p1ksenn.mongodb.net';

mongoose.set('strictQuery', false);
mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWD}@${MONGO_CLUSTER}/ecommerce?retryWrites=true&w=majority`
);

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

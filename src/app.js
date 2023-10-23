import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import ProductsRouter from './routers/product.routes.js';
import CartsRouter from './routers/cart.routes.js';
import { __dirname } from './utils.js'
import ProductManager from './controllers/ProductManager.js';
import { Server } from 'socket.io';
import http from 'http';

const productos = new ProductManager();

const app = express();
const PORT = 8080;

const serverHttp = http.createServer(app);
const serverSocket = new Server(serverHttp);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
    try {
        const products = await productos.getProducts();
        res.render('index', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
})


app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productos.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos en tiempo real');
    }
});


app.use("/api/carts", CartsRouter)
app.use("/api/products", ProductsRouter)

serverHttp.listen(PORT, () =>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})


serverSocket.on('connection', (socketClient) => {

    console.log(`Se ha conectado un nuevo cliente (${socketClient.id})`);

    socketClient.on('disconnect', () => {
        console.log(`Se ha desconectado el cliente ${socketClient.id}`);
    });

    socketClient.on('eliminarProducto', async (productId) => {
        try {
            await productos.deleteProduct(productId);
            const products = await productos.getProducts();

            serverSocket.emit('actualizarProductos', products);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });


    socketClient.on('agregarProducto', async (productData) => {
        try {
            await productos.addProduct(productData);
            const products = await productos.getProducts();
            serverSocket.emit('actualizarProductos', products);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    
});

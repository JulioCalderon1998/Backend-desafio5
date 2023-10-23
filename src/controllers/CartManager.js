import fs from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';


const products = new ProductManager()


class CartManager {

    constructor() {
        this.path = "./src/models/carts.json";
    }


    addCart = async () => {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]');
            }


            let carts = await fs.promises.readFile(this.path, 'utf-8'); 
            let cartsParse = JSON.parse(carts);
            let id = nanoid()
            let cartConcat = [{id :id, products: []}, ...cartsParse]
            await fs.promises.writeFile(this.path, JSON.stringify(cartConcat));
            return 'Carrito Agregado';
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
            return;
        }
    };


    addProductInCart = async (cartId, productId) => {
        try {

            let resultado = await fs.promises.readFile(this.path, "utf-8")
            const carts = JSON.parse(resultado); 

            const cart = carts.find((cart) => cart.id === cartId);

            if(!cart) {
                console.log("No se encontró el carrito")
            }

            let product = await products.getProductById(productId)

            if(!product) {
                console.log("No se encontró el producto")
            }


            let cartsFiltered = carts.filter((cart) => cart.id !== cartId);
            

            if(cart.products.some(prod => prod.id === productId)) {

                let productInCart = cart.products.find(prod => prod.id === productId)
                
                productInCart.quantity++

                let newCarts = [cart, ...cartsFiltered]
                await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
                return 'Producto sumado al carrito!';
            }

            cart.products.push({id: product.id, quantity: 1})

            let newCarts = [cart, ...cartsFiltered]

            await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
            return 'Producto agregado al carrito!';
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            return;
        }
    };


    getCarts = async() => {
        let resultado = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(resultado)
    }


    getCartById = async(id) => {
        try {
            let resultado = await fs.promises.readFile(this.path, "utf-8")
            const carts = JSON.parse(resultado); 

            const cart = carts.find((cart) => cart.id === id);

            if(!cart) {
                console.log("No se encontró el carrito")
            } else {            
                return cart
            }
        } catch (error) {
            console.log("Error al leer el archivo!");
        }       
    } 
}


export default CartManager
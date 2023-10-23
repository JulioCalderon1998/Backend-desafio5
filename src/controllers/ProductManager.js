import fs from 'fs';
import { nanoid } from 'nanoid';

class ProductManager {


    constructor() {
        this.path = "./src/models/products.json";
    }

    addProduct = async (product) => {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]');
            }


            let products = await fs.promises.readFile(this.path, 'utf-8'); 
            let productsParse = JSON.parse(products);
            product.id = nanoid()
            
            let productAll = [...productsParse, product];
            await fs.promises.writeFile(this.path, JSON.stringify(productAll));
            return console.log('Producto Agregado');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return console.log('Error al agregar el producto');
        }
    };

    getProducts = async() => {
        let resultado = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(resultado)
    }

    getProductById = async(id) => {
        try {
            let resultado = await fs.promises.readFile(this.path, "utf-8")
            const products = JSON.parse(resultado); 

            const product = products.find((product) => product.id === id);

            if(!product) {
                console.log("No se encontró el producto")
            } else {            
                return product
            }
        } catch (error) {
            console.log("Error al leer el archivo!");
        }       
    } 


    deleteProduct = async(id) => {
        let resultado = await fs.promises.readFile(this.path, "utf-8")
        const products = JSON.parse(resultado); 

        if (!products.find((product) => product.id === id)) {
            console.log("No se encontró el producto");
            return;
        }

        let newProducts = products.filter((product) => product.id !== id);

        await fs.promises.writeFile(this.path, JSON.stringify(newProducts))

        return "El producto se elimino correctamente!"
    }


    updateProduct = async(id, producto) => {
        try {
            let resultado = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(resultado); 

            const product = products.find((prod) => prod.id === id);

            if(!product) {
                console.log("No se encontró el producto");
                return;
            }

            let productsFiltered = products.filter((product) => product.id !== id);

            let newProducts = [{...producto,id : id}, ...productsFiltered];

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts))
            
            return `Se actualizó el producto id ${id}`

        } catch (error) {
            console.log("Error en el manejo de archivos!");
        }
    }

}

export default ProductManager;
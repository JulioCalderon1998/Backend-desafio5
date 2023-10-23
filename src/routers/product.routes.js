import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const productos = new ProductManager();
const ProductsRouter = Router()


ProductsRouter.get("/", async (req, res) => {
    res.send(await productos.getProducts())
})


ProductsRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await productos.getProductById(id))
})


ProductsRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await productos.addProduct(newProduct))
})


ProductsRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await productos.deleteProduct(id))
})


ProductsRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updateProduct = req.body
    res.send(await productos.updateProduct(id, updateProduct))
})


export default ProductsRouter
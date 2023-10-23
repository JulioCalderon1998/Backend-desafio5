import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const carts = new CartManager();
const CartRouter = Router()


CartRouter.post("/", async (req, res) => {
    res.send(await carts.addCart())
})


CartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await carts.addProductInCart(cartId, productId))
})


CartRouter.get("/", async (req, res) => {
    res.send(await carts.getCarts())
})


CartRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await carts.getCartById(id))
})


export default CartRouter
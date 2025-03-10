//Import express
import express from "express";

//Importe type
import type { Request, Response } from "express";

//Create route instance
const router = express.Router();

//Create interface
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [];

router.get("/products", (_: Request, res: Response): void => {
  res.json(products);
});

router.get("/products/:id", (req: Request, res: Response): void => {
  res.send(req.params.id)
});

router.post("/products",(req:Request , res:Response): void => {

})

export default router;

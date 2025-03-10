//Import express
import express from "express";

//Importe type
import type { Request, Response } from "express";

//Create route instance
const router = express.Router();
// router.use(express.json());

router.get("/", (_: Request, res: Response): void => {
  res.send("This is home.");
});

router.get("/about", (_: Request, res: Response): void => {
  res.send("This is about.");
});

export default router;

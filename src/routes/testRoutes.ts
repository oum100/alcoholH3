//Import express
import express from "express";

//Importe type
import type { Request, Response } from "express";

//Create route instance
const router = express.Router();
// router.use(express.json());

router.get("/", (_: Request, res: Response): void => {
  try {
    res.send("This is home.");
  }catch(error){
    console.log(error)
    res.status(500).json({
      message: 'error',
      error:error
    })
  }
  
});

router.get("/about", (_: Request, res: Response): void => {
  res.send("This is about.");
});

export default router;

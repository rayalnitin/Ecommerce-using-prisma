import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addItemtoCart, changeQuantity, deleteItemfromCart, getCart } from "../controllers/cart";

export const cartRoutes:Router=Router();

cartRoutes.get('/' , [authMiddleware] , errorHandler(getCart))
cartRoutes.post('/' ,[authMiddleware] , errorHandler(addItemtoCart))
cartRoutes.delete('/:id' , [authMiddleware] ,errorHandler(deleteItemfromCart))
cartRoutes.put('/:id' , [authMiddleware] , errorHandler(changeQuantity))
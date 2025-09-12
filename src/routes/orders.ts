import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/orders";

export const orderRoutes:Router = Router();

orderRoutes.post('/',[authMiddleware] , errorHandler(createOrder))
orderRoutes.put('/:id/cancel',[authMiddleware] , errorHandler(cancelOrder))
orderRoutes.get('/:id',[authMiddleware] , errorHandler(getOrderById))
orderRoutes.get('/',[authMiddleware] , errorHandler(listOrder))
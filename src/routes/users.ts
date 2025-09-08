import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress , updateUser } from "../controllers/users";

export const userRoutes:Router = Router()

userRoutes.get('/address' , [authMiddleware ] , errorHandler(listAddress))
userRoutes.post('/address' ,[authMiddleware],errorHandler(addAddress))
userRoutes.delete('/address/:id' , [authMiddleware ] , errorHandler(deleteAddress)) 
userRoutes.put('/',[authMiddleware] , errorHandler(updateUser))
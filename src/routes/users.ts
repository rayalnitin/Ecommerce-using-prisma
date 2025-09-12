import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, changeUserRole, deleteAddress, getUserbyId, listAddress , listUsers, updateUser } from "../controllers/users";

export const userRoutes:Router = Router()

userRoutes.get('/address' , [authMiddleware ] , errorHandler(listAddress))
userRoutes.post('/address' ,[authMiddleware],errorHandler(addAddress))
userRoutes.delete('/address/:id' , [authMiddleware ] , errorHandler(deleteAddress)) 
userRoutes.put('/',[authMiddleware] , errorHandler(updateUser))

userRoutes.get('/' ,[authMiddleware , adminMiddleware] , errorHandler(listUsers))
userRoutes.get('/:id' ,[authMiddleware , adminMiddleware] , errorHandler(getUserbyId))
userRoutes.put('/:id/role' ,[authMiddleware , adminMiddleware] , errorHandler(changeUserRole))

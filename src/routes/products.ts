import { authMiddleware } from './../middlewares/auth';
import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductbyId, listProducts, searchProducts, updateProduct } from "../controllers/products";
import { adminMiddleware } from '../middlewares/admin';

const productsRoutes:Router = Router()

productsRoutes.post('/' , [authMiddleware , adminMiddleware] , errorHandler(createProduct))
productsRoutes.put('/:id' , [authMiddleware , adminMiddleware] , errorHandler(updateProduct))
productsRoutes.delete('/:id' , [authMiddleware , adminMiddleware] , errorHandler(deleteProduct))
productsRoutes.get('/' , [authMiddleware] , errorHandler(listProducts))
productsRoutes.get('/:id' , [authMiddleware] , errorHandler(getProductbyId))

productsRoutes.get('/search' ,[authMiddleware] ,errorHandler(searchProducts))

export default productsRoutes
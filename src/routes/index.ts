import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import { userRoutes } from "./users";
import { cartRoutes } from "./cart";
import { orderRoutes } from "./orders";

const rootRouter:Router = Router()

rootRouter.use('/auth' , authRoutes)
rootRouter.use('/products' , productsRoutes)
rootRouter.use('/users' , userRoutes)
rootRouter.use('/carts' , cartRoutes)
rootRouter.use('/orders', orderRoutes)

export default rootRouter

/*
    ? User Management 
    a. List users
    b. get user by id
    c. change user role

 TODO: Order Management 
    a. list all orders (filter on status)
    b. change order status
    c. List all orders of given users

 TODO: Products
    a. search api for products ( for both users and admins ) -> full text search 
*/


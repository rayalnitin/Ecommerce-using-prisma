import { Router } from "express";
import { login, signup } from "../controllers/auth";

const authRoutes:Router = Router()

authRoutes.post('/signup', signup )
authRoutes.get('/login' , login)

export default authRoutes
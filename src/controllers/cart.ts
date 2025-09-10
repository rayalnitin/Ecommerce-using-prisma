import { Request , Response  } from "express";
import { changeQuantitySchema, createCartSchema } from "../schema/users";
import { notFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { success } from "zod";
import { BadRequestsException } from '../exceptions/bad-requests';

export const addItemtoCart = async(req:Request , res:Response) =>{
    const validatedData = createCartSchema.parse(req.body)
    let product : Product
    try{
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id:validatedData.productId
            }
        })
    }catch(error){
        throw new notFoundException('Product not found' , ErrorCodes.PRODUCT_NOT_FOUND)
    }
    const existingItem = await prismaClient.cartItem.findFirst({
        where:{
            userId:req.user!.id,
            productId:product.id
        }
    })
    let cart
    if(existingItem){
        await prismaClient.cartItem.update({
            where:{
                id:existingItem.id
            },
            data:{
                quantity:existingItem.quantity + validatedData.quantity
            }
        }
        )
    }else{
        cart = await prismaClient.cartItem.create({
        data:{
            userId:req.user!.id,
            productId:product.id,
            quantity:validatedData.quantity
        }
    })
    }
    
    res.json(cart)
}
export const deleteItemfromCart = async(req:Request , res:Response) =>{
    try{
        const cart = await prismaClient.cartItem.findFirstOrThrow({
            where:{
                id:+req.params.id,
                userId:req.user!.id
            }
        })
        await prismaClient.cartItem.delete({
            where:{
                id:cart.id,
            }
        })
    }catch(err){
        throw new notFoundException('Item not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
    res.json({success:true})
}
export const changeQuantity = async(req:Request , res:Response) =>{
    const validatedData = changeQuantitySchema.parse(req.body)
    if(validatedData.quantity <= 0){
        throw new BadRequestsException('Quantity must be greater than equal to 0' , ErrorCodes.INTERNAL_EXCEPTION)
    }
    try{
        const cart = await prismaClient.cartItem.findFirstOrThrow({
            where:{
                id: +req.params.id,
                userId:req.user!.id
            }
        })
        const updatedCart = await prismaClient.cartItem.update({
            where:{
                id:cart.id
            },
            data:{
                quantity: validatedData.quantity
            }
        })
        res.json(updatedCart)
    }catch(error){
        throw new notFoundException('Item not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }  
}
export const getCart = async(req:Request , res:Response) =>{
    const cart = await prismaClient.cartItem.findMany({
            where:{
                userId:req.user!.id
            },
            include:{
                product:true
            }
        })
    res.json(cart)
}
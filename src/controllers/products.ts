import {NextFunction, Request , Response } from 'express'
import { prismaClient } from '..'
import { productSchema } from '../schema/users'
import { Prisma } from '@prisma/client'
import { notFoundException } from '../exceptions/not-found'
import { ErrorCodes } from '../exceptions/root'

export const createProduct = async(req:Request , res:Response , next:NextFunction) =>{

    productSchema.parse(req.body)

    const product = await prismaClient.product.create({
        data:{
            name: req.body.name,
            description: req.body.description,
            price: new Prisma.Decimal(req.body.price),  
            tags:req.body.tags.join(',')
        }
    })

    res.json(product)
}

export const updateProduct = async(req:Request , res:Response)=>{
    try{
        const product = req.body
        if(product.tags){
            product.tags = product.tags.join(',')
        }
        const updatedProduct = await prismaClient.product.update({
            where:{
                id:+req.params.id
            },
            data:product
        })
        res.json(updatedProduct)
    }catch(error){
        throw new notFoundException('Product not found' , ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
export const deleteProduct = async(req:Request , res:Response)=>{
    try{
        const product = req.body
        const deletedProduct = await prismaClient.product.delete({where:{id:+req.params.id}})
        res.json(deletedProduct)
    }catch(error){
        throw new notFoundException('Product not found' , ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
export const listProducts = async(req:Request , res:Response)=>{
    try{
        const count = await prismaClient.product.count()
        const products = await prismaClient.product.findMany({
            skip: req.query.skip ? +req.query.skip : 0,
            take:5,
        })
        res.json({
            count , data:products
        })
    }catch(error){
        throw new notFoundException('No Products found' , ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
export const getProductbyId = async(req:Request , res:Response)=>{
    try{
        const newProduct = await prismaClient.product.findFirst({where:{id:+req.params.id}})
        if(!newProduct){
            throw new notFoundException('Product not found' , ErrorCodes.PRODUCT_NOT_FOUND)
        }
        res.json(newProduct)
    }catch(error){
        throw new notFoundException('Product not found' , ErrorCodes.PRODUCT_NOT_FOUND)
    }
}

export const searchProducts = async(req:Request , res:Response)=>{
    
}
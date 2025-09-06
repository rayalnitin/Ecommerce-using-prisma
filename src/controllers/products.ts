import {NextFunction, Request , Response } from 'express'
import { prismaClient } from '..'
import { productSchema } from '../schema/products'
import { Prisma } from '@prisma/client'

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
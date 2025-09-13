import { Request , Response } from "express"
import { prismaClient } from ".."
import { numKeys } from "zod/v4/core/util.cjs"
import { BadRequestsException } from "../exceptions/bad-requests"
import { ErrorCodes } from "../exceptions/root"
import { notFoundException } from "../exceptions/not-found"
import { Order } from "@prisma/client"
import { CANCELLED } from "dns"
import { UnauthorizedException } from "../exceptions/unauthorized"


/*
    *to create a transaction
    *to list all the items and proceed if cart is not empty
    *calculate the total amount 
    *fetch address of the user
    *to define the computed field for formatted address or address module 
    *we will create order and order products
    *create event related to the order
    *empty the cart
*/
export const createOrder = async(req:Request , res:Response)=>{
    return await prismaClient.$transaction(async(tx)=>{
        const cartItems = await tx.cartItem.findMany({
            where:{
                userId:req.user!.id
            },
            include:{
                product:true
            }
        })

        if(cartItems.length == 0){
            throw new BadRequestsException('Cart is empty' , ErrorCodes.UNPROCESSABLE_ENTITY)
        }

        const total = cartItems.reduce((prev , current)=>{
            return prev + (current.quantity * (+current.product.price))
        },0)

        if (!req.user!.defaultShippingAddress) {
            throw new BadRequestsException('No default shipping address found', ErrorCodes.ADDRESS_NOT_FOUND)
        }

        const address = await tx.address.findFirst({
            where:{
                id:req.user!.defaultShippingAddress
            }
        })

        const order = await tx.order.create({
            data:{
                userId:req.user!.id,
                netAmount:total,
                address:address!.formattedAddress,
                products:{
                    create:cartItems.map((cart)=>{
                        return {
                            productId:cart.productId,
                            quantity:cart.quantity
                        }
                    })
                }
            }
        })
        const orderEvent = await tx.orderEvent.create({
            data:{
                orderId:order.id
            }
        })
        await tx.cartItem.deleteMany({
            where:{
                userId:req.user!.id
            }
        })

        return res.json(order)
    })
}

export const listOrder = async(req:Request , res:Response)=>{
    const orders = await prismaClient.order.findMany({
        where:{
            userId:req.user!.id
        }
    })

    res.json(orders)
}
/*
    *wrap it inside transaction
    *check if user is cancelling it's own user
*/
export const cancelOrder = async(req:Request , res:Response)=>{   
    try{
        const existingOrder = await prismaClient.order.findUnique({
            where:{
                id:+req.params.id
            },
            select:{
                userId:true,
                status:true
            }
        })
        if(!existingOrder){
            throw new notFoundException('Order not found' , ErrorCodes.ORDER_NOT_FOUND)
        }
        if(existingOrder.userId !== req.user!.id){
            throw new UnauthorizedException('Unauthorized Exception' , ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }
        if(existingOrder.userId !== req.user!.id){
            throw new BadRequestsException('Order already canelleede' , ErrorCodes.UNPROCESSABLE_ENTITY)
        }
        const order = await prismaClient.$transaction(async(tx)=>{
            const order = await tx.order.update({
                where:{
                    id:+req.params.id
                },
                data:{
                    status:'CANCELLED'
                }
            })
            await tx.orderEvent.create({
                data:{
                    orderId:order.id,
                    status:'CANCELLED' 
                }
            })
            return order
        })
        res.json(order)
    }catch(error){
        throw new notFoundException('Order not found' , ErrorCodes.ORDER_NOT_FOUND)
    }   
}
export const getOrderById = async(req:Request , res:Response)=>{
    try{
        const order = await prismaClient.order.findFirstOrThrow({
            where:{
                id:+req.params.id
            },
            include:{
                products:true,
                events:true
            }
        })
        res.json(order)
    }catch(error){
        throw new notFoundException('Order not found' , ErrorCodes.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async(req:Request , res:Response)=>{
    let whereClause = {}
    const status = req.query.status
    if(status){
        whereClause={
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +(req.query.skip || 0),
        take:5
    })

    res.json(orders)
}
export const changeStatus = async(req:Request , res:Response)=>{
    try{
        const existingOrder = await prismaClient.order.findFirstOrThrow({
            where:{
                id:+req.params.id
            }
        })

        const order = await prismaClient.$transaction(async(tx)=>{
            const order = await tx.order.update({
                where:{
                id: +req.params.id
                },
                data:{
                    status:req.body.status
                }
            })
            await tx.orderEvent.create({
                data:{
                    orderId: order.id,
                    status: req.body.status
                }
            })
        return order
        })
        res.json(order)
    
    }catch(error){
        throw new notFoundException('Order not found' , ErrorCodes.ORDER_NOT_FOUND)
    }
}
export const listUserOrders = async(req:Request , res:Response)=>{
    let whereClause:any = {
        userId: +req.params.id
    }
    const status = req.query.status
    if(status){
        whereClause={
            ...whereClause,
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +(req.query.skip || 0),
        take:5
    })

    res.json(orders)
}
import { Request , Response } from "express";
import { addressSchema, updatedUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { Address, User } from "@prisma/client";
import { notFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { success } from "zod";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async(req:Request , res:Response)=>{
    addressSchema.parse(req.body)
    const address = await prismaClient.address.create({
        data:{
            ...req.body,    
            userId:req.user!.id 
        }
    })
    res.json(address)
}
export const deleteAddress = async(req:Request , res:Response)=>{
    try{
        await prismaClient.address.delete({
            where:{
                id:+req.params.id
            }
        })
        res.json({success: true })
    }catch(error){
        throw new notFoundException('Address not found' , ErrorCodes.ADDRESS_NOT_FOUND)
    }
}
export const listAddress = async(req:Request , res:Response)=>{
    const addresses = await prismaClient.address.findMany({
        where:{
            userId:req.user!.id
        }
    })
    res.json(addresses)
}

export const updateUser = async(req:Request , res:Response)=>{
    const validatedData = updatedUserSchema.parse(req.body)
    let shippingAddress:Address
    let billingAddress:Address
    if(validatedData.defaultShippingAddress){
        try{
                shippingAddress = await prismaClient.address.findFirstOrThrow({
                where:{
                    id:validatedData.defaultShippingAddress
                }
            })
            
        }catch(error){
        throw new notFoundException('Address not found' , ErrorCodes.ADDRESS_NOT_FOUND)
        }
        if(shippingAddress.userId !== req.user!.id){
                throw new BadRequestsException('Address does not belong to user' , ErrorCodes.ADDRESS_DOES_NOT_BELONG)
            }
    }
    if(validatedData.defaultBillingAddress){
        try{
                billingAddress  = await prismaClient.address.findFirstOrThrow({
                where:{
                    id:validatedData.defaultBillingAddress
                }
            })
            
        }catch(error){
        throw new notFoundException('Address not found' , ErrorCodes.ADDRESS_NOT_FOUND)
        }
        if(billingAddress.userId !== req.user!.id){
                throw new BadRequestsException('Address does not belong to user' , ErrorCodes.ADDRESS_DOES_NOT_BELONG)
            }
    }
    const UpdatedUser = await prismaClient.user.update({
        where:{
            id:req.user!.id
        },
        data:validatedData
    })

    res.json(UpdatedUser)
}

export const listUsers = async(req:Request , res:Response)=>{
    const users = await prismaClient.user.findMany({
        skip:parseInt(req.query.skip as string) || 0,
        take:5
    })

    res.json(users)
}
export const getUserbyId = async(req:Request , res:Response)=>{
    try{
        const user = await prismaClient.user.findFirstOrThrow({
            where:{
                id: +req.params.id
            },
            include:{
                Address:true
            }
        })
        res.json(user)
    }catch(error){
        throw new notFoundException('User not found' , ErrorCodes.USER_NOT_FOUND)
    }
}

export const changeUserRole = async(req:Request , res:Response)=>{
    try{
        const existingUser = await prismaClient.user.findFirstOrThrow({
            where:{
                id: +req.params.id
            }
        })
        if(existingUser.role === 'USER'){
            const user = await prismaClient.user.update({
                where:{
                    id: +req.params.id
                },
                data:{
                    role: req.body.role
                }
            })
            res.json(user)
        }else{
            res.json({message:'User already at Admin level'})
        }
        
    }catch(error){
        throw new notFoundException('User not found' , ErrorCodes.USER_NOT_FOUND)
    }
}


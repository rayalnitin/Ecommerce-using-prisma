import {z} from 'zod'

export const signupSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6)
})

export const productSchema = z.object({
    name:z.string().min(1),
    description:z.string().min(1),
    price:z.coerce.number().positive(),
    tags: z.array(z.string())
})

export const addressSchema = z.object({
    lineone:z.string().min(1),
    linetwo:z.string().nullable()   ,
    city:z.string(),
    country:z.string(),
    pincode:z.string().length(6),
})

export const updatedUserSchema = z.object({
    name:z.string().optional(),
    defaultShippingAddress:z.number().optional(),
    defaultBillingAddress:z.number().optional()
})

export const createCartSchema = z.object({
    productId:z.number(),
    quantity:z.number()
})

export const changeQuantitySchema = z.object({
    quantity:z.number()
})
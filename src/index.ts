import express , {Express , Request , Response} from "express"
import { PORT } from "./secrets"
import rootRouter from "./routes/index"
import { PrismaClient } from "@prisma/client"
import { errorMiddleware } from "./middlewares/errors"
import { signupSchema } from "./schema/users"

const app:Express = express()

app.use(express.json())
app.use('/api' , rootRouter)

export const prismaClient = new PrismaClient({
    log :['query']
}).$extends({
    result:{
        address:{
            formattedAddress:{
                needs:{
                    lineone:true,
                    linetwo:true,
                    city:true,
                    country:true,
                    pincode:true
                },
                compute:(addr)=>{
                    return `${addr.lineone},${addr.linetwo},${addr.city},${addr.country}-${addr.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware)

app.listen(PORT , ()=>{
    console.log("App working")
})
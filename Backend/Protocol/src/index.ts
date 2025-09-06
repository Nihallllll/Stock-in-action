import {PrismaClient} from "@prisma/client"
import dotenv from "dotenv";

const prisma = new PrismaClient;
const allUsers = [];
async function getinfo(){
const users = await prisma.user.findMany({
    where : {
        deposits :{
            some: {}
        }
    }
})  

}
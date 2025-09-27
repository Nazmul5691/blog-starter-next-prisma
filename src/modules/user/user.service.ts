import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";

const createUser = async(payload: Prisma.UserCreateInput): Promise<User> =>{
    // console.log({payload});
    const createdUser = await prisma.user.create({
        data: payload
    })
    return createdUser;
}


const getAllUsers = async() =>{
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
            posts: true
        },
        orderBy: {
            createdAt: 'desc'
        },
    
    })
    return result;
}



const getUserById = async (id: number) =>{
    const result = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
            posts: true
        }
    });
    return result;
}


export const UserService = {
    createUser,
    getAllUsers,
    getUserById
}
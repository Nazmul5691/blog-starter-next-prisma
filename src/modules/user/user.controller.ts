import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async(req: Request, res: Response) =>{
    try {
        const result = await UserService.createUser(req.body);

        res.status(201).send(result);

    } catch (error) {
        res.status(500).send(error);
    }
}


const getAllUsers = async(req: Request, res: Response) =>{
    try {
        const result = await UserService.getAllUsers()
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}


const getUserById = async(req: Request, res: Response) =>{
    try {
        const result = await UserService.getUserById(Number(req.params.id))
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error)
    }
}



export const UserController = {
    createUser,
    getAllUsers,
    getUserById
}
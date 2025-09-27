import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const loginWithEmailAndPassword = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginWithEmailAndPassword(req.body)
        res.status(200).send(result)

    } catch (error) {
        console.log(error);
    }
}


const googleLogin = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.googleLogin(req.body)
        res.status(200).send(result)

    } catch (error) {
        console.log(error);
    }
}


export const AuthController = {
    loginWithEmailAndPassword,
    googleLogin
}
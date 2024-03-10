import {Request, Response} from "express";
import {hashPassword} from "../services/password.service";
import prisma from "../models/user"

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const {email, password} = req.body;

        if (!email) {
            res.status(400).json({message: "El email es obligatorio"});
            return
        }
        if (!password) {
            res.status(400).json({message: "El password es obligatorio"});
            return
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        res.status(201).json(user)

    } catch (e: any) {
        if (e?.code === "P2002" && e?.meta.target.includes("email")) {
            res.status(400).json({message: "El email ingresado ya esta registrado"})
        }

        console.log(e)
        res.status(500).json({error: "Hubo un error, pruebe mas tarde"})

    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {

        const users = await prisma.findMany()
        res.status(200).json(users)


    } catch (e: any) {
        console.log(e)
        res.status(500).json({error: "Hubo un error, pruebe mas tarde"})
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {

        const user = await prisma.findUnique({where: {id: userId}})

        if (!user) {
            res.status(404).json({error: "Usuario no encontrado"})
            return;
        }

        res.status(200).json(user)

    } catch (e: any) {
        console.log(e)
        res.status(500).json({error: "Hubo un error, pruebe mas tarde"})
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const {email, password} = req.body;
    try {
        let dataToUpdate: any = {...req.body};
        if (password) {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }

        if (email) {
            dataToUpdate.email = email;
        }

        const user = await prisma.update({where: {id: userId}, data: dataToUpdate})

        res.status(200).json(user)

    } catch (e: any) {
        if (e?.code === "P2002" && e?.meta?.target?.includes("email")) {
            res.status(400).json({message: "El email ingresado ya existe"})
        } else if (e?.code === "P2025") {
            res.status(404).json({message: "Usuario no encontrado"})
        } else {
            console.log(e)
            res.status(500).json({error: "Hubo un error, pruebe mas tarde"})
        }

    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
   
    try {
        await prisma.delete({where:{id: userId}})
        res.status(200).json({message: "El usuario con id " + userId + " ha sido eliminado"}).end();
    } catch (e) {

    }
    
}
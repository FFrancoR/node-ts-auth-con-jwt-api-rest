import {Request, Response} from "express"
import {comparePasswords, hashPassword} from "../services/password.service";
import prisma from "../models/user"
import {generateToken} from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {

    const {email, password} = req.body;

    try {
        if (!email){
            res.status(400).json({message: "El email es obligatorio"});
            return
        }
        if (!password){
            res.status(400).json({message: "El password es obligatorio"});
            return
        }

        const hashedPassword = await hashPassword(password)
        console.log(hashedPassword);

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        const token = generateToken(user);
        res.status(201).json({token})


    } catch (e: any) {

        if (e?.code === "P2002" && e?.meta.target.includes("email")) {
            res.status(400).json({message: "El email ingresado ya esta registrado"})
        }

        console.log(e)
        res.status(500).json({error: "Hubo un error en el registro"})
    }

}

export const login = async (req: Request, res: Response): Promise<void> => {

    const {email, password} = req.body;

    try {
        if (!email){
            res.status(400).json({message: "El email es obligatorio"});
            return
        }
        if (!password){
            res.status(400).json({message: "El password es obligatorio"});
            return
        }

        const user = await prisma.findUnique({where: {email /*TODO:esto es lo mismo que decir : email:email*/}})
        if(!user){
            res.status(404).json({error: "Usuario no encontrado"}) //TODO: Se suele poner "El usuario y la contraseña no coinciden para no dar indicios"
            return
        }

        const passwordMatch = await comparePasswords(password,user.password)
        if(!passwordMatch){
            res.status(401).json({error:"Usuario y contraseña no coinciden"})
        }

        const token = generateToken(user);
        res.status(200).json({token})

    } catch (e) {
console.log("Error: ", e)
    }


}
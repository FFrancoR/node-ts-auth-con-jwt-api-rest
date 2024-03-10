import express from "express";
import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import {createUser, deleteUser, getAllUsers, getUserById, updateUser} from "../controllers/usersController";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret"
//TODO: Middleware para chequear si esta logueado
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'No autorizado'})
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error en la autenticacion: ", err)
            return res.status(403).json({error: 'No tienes acceso a este recurso'})
        }
        next();

    })
}

router.post("/", authenticateToken, createUser)
router.get("/", authenticateToken, getAllUsers)
router.get("/:id", authenticateToken, getUserById)
router.put("/:id", authenticateToken, updateUser)
router.delete("/:id", authenticateToken, deleteUser)
// router.patch("/:id", authenticateToken, () => {
// })

export default router;
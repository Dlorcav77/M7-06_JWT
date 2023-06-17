import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../db/conn.js";

export const verifyToken = (req,res,next) => {
    try {
        const bearerHeaders = req.headers.authorization;

        if(!bearerHeaders){
            throw { message : "Se necesita el token con formato bearer" };
        }

        const token = bearerHeaders.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.email = payload.email;
        next();    
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message : error.message});
    }
};

export const verifyExistencias = async(req,res,next) => {
    const {email, password} = req.body;
    try {
        if(!email || !password){
            throw({message: "se necesita el email y la contrasena"});
        }

        const text = "SELECT * FROM usuarios WHERE email = $1";
        const {rows :[userDB], rowCount} = await pool.query(text, [email]);

        if(!rowCount){
            throw{message : "no existe el usuario"};
        }

        const verifyPassword = await bcrypt.compare(password, userDB.password);

        if(!verifyPassword){
            throw {message : "contrasena incorrecta"};
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"1h",});
        req.token = token;

        next();    
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message : error.message});
    }
};

export const verifyRegister = async(req,res,next) => {
    const {email, password, rol, lenguage} = req.body;
    try {
        if(!email || !password || !rol || !lenguage){
            throw({message: "se necesita enviar toda la informacion"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        req.hashPassword = hashPassword;
        next();    
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message : error.message});
    }
};

export const clg = async(req,res,next) => {
    try {
        console.log(`Consulta realizada y mostrada por middlewares : ${req.method} ${req.url}`);
        next();    
    } catch (error) {
    console.error(error.message)
    res.status(500).json({ message : error.message});
    }
};
import { config } from "dotenv";
config();

import express from "express";
import pool from "./db/conn.js";
import { clg, verifyExistencias, verifyRegister, verifyToken } from "./middlewares/verify.js";
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/usuarios",verifyToken,clg,async(req,res) =>{
    try {
        const text = "SELECT * FROM usuarios WHERE email = $1";
        const {rows} = await pool.query(text, [req.email]);
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message : error.message});
    }
});

app.post("/usuarios",verifyRegister,clg, async (req, res) => {
    const {email,rol, lenguage} = req.body;
    try {
        const text   = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
        const {rows} = await pool.query(text, [email, req.hashPassword, rol, lenguage]);

        res.status(200).json({rows, message:"se registro con exito"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
});

app.post("/login",verifyExistencias,clg,async (req,res) => {
    try {
        res.json([req.token]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
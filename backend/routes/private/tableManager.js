import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const router = express.Router();


router.get("/list", async (req, res) =>{
    try{
        const tableResult = await prisma.$queryRaw`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE';
        `;
        
        const tableNames = tableResult.map(row => row.table_name);
        const metadata = {};

        // 2. Itera sobre cada tabela para obter seus nomes de colunas
        for (const tableName of tableNames) {
            
            // Query para obter as colunas da tabela atual
            // ATENÇÃO: O parâmetro SQL (${tableName}) deve ser tratado com segurança pelo Prisma
            const columnResult = await prisma.$queryRaw`
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public' 
                AND table_name = ${tableName}
                ORDER BY ordinal_position;
            `;
            
            const columnNames = columnResult.map(row => ({
                "name": row.column_name,
                "type": row.data_type
            }));
            // O metadata usa o nome da tabela (como está no DB) como chave
            metadata[tableName] = columnNames;
        }

            res.status(200).json({
                message: "Tables retrieved successfully",
                tables: metadata
            });

    } catch (error) {
        console.error("Error in /tablemanager route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/list/:tableName", async (req, res) => {
    const {tableName} = req.params
    try{
        const data = await prisma.$queryRawUnsafe(`
            SELECT *
            FROM "${tableName}";
        `)
        res.status(200).json({
            message: "Tables information retrieved successfully",
            data
        });
    }catch(error) {
        console.error(`Error in /tablemanager/${tableName} route:`, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


export default router
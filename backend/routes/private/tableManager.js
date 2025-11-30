import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// --- FUNÇÃO DE AJUDA: Busca os tipos das colunas ---
async function getColumnsMetadata(tableName) {
    // Usa Prisma.sql para segurança
    // Retorna algo como: { "foto": "ARRAY", "nome": "text", "idade": "integer" }
    const columns = await prisma.$queryRaw(Prisma.sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = ${tableName};
    `);

    const metadata = {};
    columns.forEach(col => {
        metadata[col.column_name] = col.data_type;
    });
    return metadata;
}

// --- FUNÇÃO DE TRATAMENTO INTELIGENTE ---
// Agora recebe o "targetType" (o tipo que o banco espera)
const tratarValor = (value, targetType) => {
    // 1. Se for nulo ou indefinido
    if (value === null || value === undefined || value === "") {
        // Se for array e estiver vazio, manda NULL ou array vazio dependendo da regra. 
        // Vamos mandar NULL por segurança genérica
        return Prisma.sql`NULL`;
    }

    // 2. DETECTOR DE ARRAYS (A CORREÇÃO PRINCIPAL)
    // Se o banco espera ARRAY mas recebeu texto/número solto
    if (targetType === 'ARRAY' && !Array.isArray(value)) {
        // Transforma o valor solto em um Array SQL: ARRAY['valor']
        return Prisma.sql`ARRAY[${value}]`;
    }

    // 3. DETECTOR DE DATAS
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (typeof value === 'string' && isoDateRegex.test(value)) {
        return Prisma.sql`${value}::timestamp`;
    }

    // 4. Padrão (Texto, Número, Boolean)
    return value;
}


// ---------------- ROTAS ----------------

router.get("/list", async (req, res) => {
    try{
        const tableResult = await prisma.$queryRaw`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name in (
                'users', 
                'produtos',
                'apoiadores',
                'campeonatos_ganhos',
                'jogadores',
                'staff',
                'jogos'
            );
        `;
        
        const tableNames = tableResult.map(row => row.table_name);
        const metadata = {};

        for (const tableName of tableNames) {
            const columnResult = await prisma.$queryRaw(Prisma.sql`
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public' 
                AND table_name = ${tableName}
                ORDER BY ordinal_position;
            `);
            
            const columnNames = columnResult.map(row => ({
                "name": row.column_name,
                "type": row.data_type
            }));
            metadata[tableName] = columnNames;
        }

            res.status(200).json({
                message: "Tables retrieved successfully",
                tables: metadata
            });

    } catch (error) {
        console.error("Error in /tablemanager/list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/list/:tableName", async (req, res) => {
   const {tableName} = req.params;
    try {
        const tableNameSql = Prisma.raw(tableName);
        const data = await prisma.$queryRaw(Prisma.sql`
            SELECT *
            FROM ${tableNameSql};
        `);

        res.status(200).json({
            message: `Dados da tabela ${tableName} recuperados com sucesso`,
            data
        });
    } catch(error) {
        console.error(`Error in /tablemanager/list/${tableName}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.delete("/delete/:tableName/:id", async (req, res) => {
    let {tableName, id} = req.params
    try {
        const tableNameSql = Prisma.raw(tableName); 

        // Busca metadata só pra saber o tipo do ID
        const metadata = await getColumnsMetadata(tableName);
        
        if(metadata['id'] === 'integer'){
            id = parseInt(id)
            if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
        }

        const result = await prisma.$executeRaw(Prisma.sql`
            DELETE FROM ${tableNameSql}
            WHERE id = ${id}
        `);

        if (result > 0) {
            return res.status(200).json({ message: "Excluído com sucesso.", count: result });
        } else {
            return res.status(404).json({ message: "Registro não encontrado." });
        }

    } catch (error) {
        console.error("Error delete:", error);
        return res.status(500).send("Erro ao excluir.");
    }
});

router.put("/update/:tableName/:id", async (req, res) => {
    let { tableName, id } = req.params;
    const updates = req.body; 

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "Nenhum dado fornecido." });
    }

    try {
        // 1. Busca tipos das colunas para saber como tratar cada valor (Array, Data, Int...)
        const metadata = await getColumnsMetadata(tableName);

        // Valida ID
        if(metadata['id'] === 'integer'){
            id = parseInt(id)
            if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
        }

        const tableNameSql = Prisma.raw(tableName);
        const setClauses = [];
        
        for (const [columnName, value] of Object.entries(updates)) {
            if(columnName === "id") continue
            
            const columnSql = Prisma.raw(columnName); 
            // Pega o tipo dessa coluna específica no banco
            const columnType = metadata[columnName]; 

            // Trata o valor baseado no tipo esperado
            const valorTratado = tratarValor(value, columnType);
            
            setClauses.push(Prisma.sql`${columnSql} = ${valorTratado}`);
        }
        
        const setClauseSql = Prisma.join(setClauses);

        const result = await prisma.$executeRaw(Prisma.sql`
            UPDATE ${tableNameSql}
            SET ${setClauseSql}
            WHERE id = ${id}
        `);

        if (result > 0) {
            return res.status(200).json({ message: "Atualizado com sucesso.", count: result });
        } else {
            return res.status(404).json({ message: "Registro não encontrado." });
        }

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ error: "Erro interno ao atualizar." });
    }
});

router.post("/create/:tableName", async (req, res) => {
    const { tableName } = req.params;
    const data = req.body; 

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Nenhum dado fornecido." });
    }

    try {
        // 1. Busca tipos das colunas
        const metadata = await getColumnsMetadata(tableName);

        const tableNameSql = Prisma.raw(tableName);
        const columnNames = [];
        const columnValues = [];

        for (const [columnName, value] of Object.entries(data)) {
            if (columnName === "id") continue;
            
            columnNames.push(Prisma.raw(columnName));
            
            // Pega tipo e trata
            const columnType = metadata[columnName];
            columnValues.push(tratarValor(value, columnType));
        }
        
        const columnsClauseSql = Prisma.join(columnNames); 
        const valuesClauseSql = Prisma.join(columnValues);

        const result = await prisma.$executeRaw(Prisma.sql`
            INSERT INTO ${tableNameSql} (${columnsClauseSql})
            VALUES (${valuesClauseSql})
        `);

        if (result === 1) { 
            return res.status(201).json({ message: "Criado com sucesso.", count: result });
        } else {
            return res.status(500).json({ message: "Falha na criação." });
        }

    } catch (error) {
        console.error("Insert Error:", error);
        return res.status(500).json({ error: "Erro interno ao criar registro." });
    }
});

export default router;
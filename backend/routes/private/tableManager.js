import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
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
   const {tableName} = req.params;
    try {
        // 1. Usa Prisma.raw() para garantir que tableName seja um identificador
        const tableNameSql = Prisma.raw(tableName);

        // 2. Usa $queryRaw (o método seguro) com a tag function Prisma.sql
        const data = await prisma.$queryRaw(Prisma.sql`
            SELECT *
            FROM ${tableNameSql};
        `);

        res.status(200).json({
            message: `Dados da tabela ${tableName} recuperados com sucesso`,
            data
        });
    } catch(error) {
        console.error(`Error in /tablemanager/${tableName} route:`, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.delete("/delete/:tableName/:id", async (req, res) => {
    let {tableName, id} = req.params
    try {
        const tableNameSql = Prisma.raw(tableName); 

        const idType = await prisma.$queryRaw(Prisma.sql`
            SELECT data_type
            FROM information_schema.columns
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
            AND column_name = 'id'
            ORDER BY ordinal_position;
        `);

        switch(idType[0].data_type){
            case "integer":
                id = parseInt(id)
                if (isNaN(id)) {
                    return res.status(400).json({ error: `ID inválido. A coluna 'id' em ${tableName} é do tipo inteiro.` });
                }
        }

        // 1. Use Prisma.raw() para o nome da tabela (Identificador).
        

        // 2. Use $executeRaw com Prisma.sql, que irá:
        //    a) Inserir o tableNameSql (o nome da tabela sem aspas)
        //    b) Parametrizar o 'id' de forma segura (prevenindo SQL Injection)
        const result = await prisma.$executeRaw(Prisma.sql`
            DELETE FROM ${tableNameSql}
            WHERE id = ${id}
        `);

        // Resposta baseada no número de linhas afetadas
        if (result > 0) {
            return res.status(200).json({ message: `Registro excluído com sucesso.`, count: result });
        } else {
            return res.status(404).json({ message: `Registro com ID ${id} não encontrado na tabela ${tableName}.` });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao executar a exclusão.");
    }
});

router.put("/update/:tableName/:id", async (req, res) => {
    const { tableName, id } = req.params;
    const updates = req.body; 

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "Nenhum dado de atualização fornecido." });
    }

    try {
        const idType = await prisma.$queryRaw(Prisma.sql`
            SELECT data_type
            FROM information_schema.columns
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
            AND column_name = 'id'
            ORDER BY ordinal_position;
        `);

        switch(idType[0].data_type){
            case "integer":
                id = parseInt(id)
                if (isNaN(id)) {
                    return res.status(400).json({ error: `ID inválido. A coluna 'id' em ${tableName} é do tipo inteiro.` });
                }
        }

        
        const tableNameSql = Prisma.raw(tableName);
        
        const setClauses = [];
        
        // Itera sobre os dados do corpo da requisição (req.body)
        for (const [columnName, value] of Object.entries(updates)) {
            // Usa Prisma.raw() para o nome da coluna (Identificador)
            if(columnName === "id") continue
            const columnSql = Prisma.raw(columnName); 
            
            // Usa Prisma.sql para criar a atribuição segura: "coluna" = valor
            // O valor é parametrizado de forma segura
            setClauses.push(Prisma.sql`${columnSql} = ${value}`);
        }
        
        // Combina os trechos com vírgula para formar a cláusula SET completa
        const setClauseSql = Prisma.join(setClauses);
        // --- 3. Execução Segura do UPDATE ---
        const result = await prisma.$executeRaw(Prisma.sql`
            UPDATE ${tableNameSql}
            SET ${setClauseSql}
            WHERE id = ${id}
        `);

        // --- 4. Resposta ---
        if (result > 0) {
            return res.status(200).json({ 
                message: `Registro com ID ${id} atualizado com sucesso.`, 
                count: result 
            });
        } else {
            return res.status(404).json({ message: `Nenhum registro encontrado ou atualizado com ID ${idValue} na tabela ${tableName}.` });
        }

    } catch (error) {
        console.error("Erro ao executar UPDATE:", error);
        // Retorna 500 para qualquer outro erro (DB, sintaxe SQL, etc.)
        return res.status(500).json({ error: "Erro interno do servidor ao tentar atualizar o registro." });
    }
});

router.post("/create/:tableName", async (req, res) => {
    // 1. Obter o nome da tabela e os dados a serem inseridos
    const { tableName } = req.params;
    const data = req.body; 

    // 2. Validação básica: verificar se há dados para inserir
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Nenhum dado fornecido para criação do registro." });
    }

    try {
        // Usa Prisma.raw() para o nome da tabela (Identificador SQL)
        const tableNameSql = Prisma.raw(tableName);
        
        const columnNames = [];
        const columnValues = [];

        // 3. Itera sobre os dados do corpo da requisição (req.body) para construir as listas
        for (const [columnName, value] of Object.entries(data)) {
            // Usa Prisma.raw() para o nome da coluna (Identificador SQL)
            if (columnName === "id") continue;
            const columnSql = Prisma.raw(columnName); 
            columnNames.push(columnSql);
            
            // O valor é adicionado à lista para ser parametrizado de forma segura no INSERT
            columnValues.push(value);
        }
        
        // 4. Combina os nomes das colunas e os valores
        
        // Constrói a lista de colunas no formato: "coluna1", "coluna2", ...
        // Usa Prisma.join para combinar os nomes das colunas (que já são Prisma.raw)
        const columnsClauseSql = Prisma.join(columnNames); 

        // Constrói a lista de placeholders de valores no formato: $1, $2, ...
        // Usa Prisma.sql para forçar a parametrização segura dos valores
        // O array de valores (columnValues) será passado como o segundo argumento de Prisma.sql
        // O primeiro argumento de Prisma.sql é a string do template (VALUES (...)), e os placeholders
        // ($1, $2, etc.) serão gerados automaticamente pelo Prisma.join
        const valuesClauseSql = Prisma.join(columnValues);

        // --- 5. Execução Segura do INSERT ---
        // A sintaxe final é: INSERT INTO "tabela" ("coluna1", "coluna2") VALUES ($1, $2)
        const result = await prisma.$executeRaw(Prisma.sql`
            INSERT INTO ${tableNameSql} (${columnsClauseSql})
            VALUES (${valuesClauseSql})
        `);

        // --- 6. Resposta ---
        if (result === 1) { // Um INSERT bem-sucedido deve retornar 1
            // NOTA: Em um CREATE/POST real, você geralmente buscaria o ID do novo registro
            // (por exemplo, usando `RETURNING id` em PostgreSQL).
            // Com `$executeRaw`, o `result` é apenas o número de linhas afetadas.
            return res.status(201).json({ 
                message: `Novo registro criado com sucesso na tabela ${tableName}.`, 
                count: result 
            });
        } else {
            // Caso $executeRaw retorne 0 (o que é improvável para um INSERT bem-sucedido)
            return res.status(500).json({ message: `A criação do registro falhou na tabela ${tableName}. Linhas afetadas: ${result}.` });
        }

    } catch (error) {
        console.error("Erro ao executar INSERT:", error);
        // Retorna 500 para qualquer outro erro (DB, sintaxe SQL, violação de restrição, etc.)
        return res.status(500).json({ error: "Erro interno do servidor ao tentar criar o registro." });
    }
});

export default router
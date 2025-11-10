
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const removePassword = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getWhereId = (id, idType = 'string') => {
  let whereId = id; 
  
  if (idType === 'int') {
    whereId = parseInt(id); 
    if (isNaN(whereId)) {
      return null;
    }
  }
  return whereId;
};


export const createOne = (modelName, options = {}) => {
  return async (req, res) => {
    try {
      const { dataTransformer } = options;

      let newItem = await prisma[modelName].create({
        data: req.body,
      });

      if (dataTransformer) {
        newItem = dataTransformer(newItem);
      }

      res.status(201).json({
        message: `${modelName} created successfully`,
        item: newItem,
      });
    } catch (error) {
      console.error(`Error in generic create for ${modelName}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};




export const updateOne = (modelName, options = {}) => {
  return async (req, res) => {
    try {
      const { idType = 'string', dataTransformer } = options;
      const whereId = getWhereId(req.params.id, idType);

      if (whereId === null) {
        return res.status(400).json({ error: "ID inválido. Esperava um número." });
      }

      let updatedItem = await prisma[modelName].update({
        where: { id: whereId }, 
        data: req.body,
      });

      if (dataTransformer) {
        updatedItem = dataTransformer(updatedItem);
      }

      res.status(200).json({
        message: `${modelName} updated successfully`,
        item: updatedItem,
      });
    } catch (error) {
      console.error(`Error in generic update for ${modelName}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};


export const deleteOne = (modelName, options = {}) => {
  return async (req, res) => {
    try {
      const { idType = 'string', dataTransformer } = options;
      const whereId = getWhereId(req.params.id, idType);

      if (whereId === null) {
        return res.status(400).json({ error: "ID inválido. Esperava um número." });
      }

      let deletedItem = await prisma[modelName].delete({
        where: { id: whereId },
      });

      if (dataTransformer) {
        deletedItem = dataTransformer(deletedItem);
      }

      res.status(200).json({
        message: `${modelName} deleted successfully`,
        item: deletedItem,
      });
    } catch (error) {
      console.error(`Error in generic delete for ${modelName}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export { removePassword };
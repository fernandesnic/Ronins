import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkOwnership = async (modelName, resourceId, userId) => {
  const resource = await prisma[modelName].findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Recurso não encontrado"); 
  }
  if (resource.userId !== userId) {
    throw new Error("Você não tem permissão para esta ação"); 
  }
  return resource;
};

/**
 * @desc    Cria um novo endereço PARA o usuário logado
 * @route   POST /api/v1/enderecos
 * @access  Privado
 */

export const createMeuEndereco = async (req, res, next) => {
  try {
    const { cep, estado, cidade, bairro, rua, numero } = req.body;
    const userId = req.userId; 

    const novoEndereco = await prisma.endereco.create({
      data: {
        cep,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        userId: userId, 
      },
    });

    res.status(201).json({
      message: "Endereço criado com sucesso",
      data: novoEndereco,
    });
  } catch (error) {
    next(error); 
  }
};

/**
 * @desc    Busca TODOS os endereços DO usuário logado
 * @route   GET /api/v1/enderecos
 * @access  Privado
 */

export const getMeusEnderecos = async (req, res, next) => {
  try {
    const userId = req.userId; 

    const enderecos = await prisma.endereco.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      message: "Endereços recuperados com sucesso",
      results: enderecos.length,
      data: enderecos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Atualiza um endereço DO usuário logado
 * @route   PUT /api/v1/enderecos/:id
 * @access  Privado
 */
export const updateMeuEndereco = async (req, res, next) => {
  try {
    const enderecoId = parseInt(req.params.id);
    const userId = req.userId; 
    const dataToUpdate = req.body; 

    await checkOwnership("endereco", enderecoId, userId);

    const enderecoAtualizado = await prisma.endereco.update({
      where: {
        id: enderecoId,
      },
      data: dataToUpdate, 
    });

    res.status(200).json({
      message: "Endereço atualizado com sucesso",
      data: enderecoAtualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deleta um endereço DO usuário logado
 * @route   DELETE /api/v1/enderecos/:id
 * @access  Privado
 */
export const deleteMeuEndereco = async (req, res, next) => {
  try {
    const enderecoId = parseInt(req.params.id);
    const userId = req.userId; 

    await checkOwnership("endereco", enderecoId, userId);

    await prisma.endereco.delete({
      where: {
        id: enderecoId,
      },
    });

    res.status(204).json(null); 
  } catch (error) {
    next(error);
  }
};
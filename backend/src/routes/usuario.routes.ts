import { Router } from 'express';
import { body, param, query } from 'express-validator';
import usuarioController from '../controllers/usuario.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isCoordenador } from '../middlewares/permission.middleware';

const router = Router();

/**
 * @route POST /usuarios
 * @desc Cria um novo usuário
 * @access Public
 */
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('dataNascimento').notEmpty().withMessage('Data de nascimento é obrigatória'),
    body('cargos').optional().isArray().withMessage('Cargos deve ser um array'),
  ],
  usuarioController.createUsuario
);

/**
 * @route GET /usuarios
 * @desc Busca todos os usuários
 * @access Private (apenas coordenadores)
 */
router.get(
  '/',
  [
    query('cargo').optional().isInt().withMessage('Cargo deve ser um número inteiro'),
  ],
  usuarioController.getAllUsuarios
);

/**
 * @route GET /usuarios/:id
 * @desc Busca um usuário pelo ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  usuarioController.getUsuarioById
);

/**
 * @route PUT /usuarios/:id
 * @desc Atualiza um usuário
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('senha').optional().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('dataNascimento').optional().notEmpty().withMessage('Data de nascimento não pode ser vazia'),
    body('cargos').optional().isArray().withMessage('Cargos deve ser um array'),
  ],
  usuarioController.updateUsuario
);

/**
 * @route DELETE /usuarios/:id
 * @desc Exclui um usuário
 * @access Private (apenas coordenadores)
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  usuarioController.deleteUsuario
);

export default router;
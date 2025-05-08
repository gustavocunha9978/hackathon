import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /auth/login
 * @desc Autentica um usuário
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  ],
  authController.login
);

/**
 * @route GET /auth/verify
 * @desc Verifica se o token é válido
 * @access Private
 */
router.get('/verify', authenticate, authController.validateToken);

export default router;
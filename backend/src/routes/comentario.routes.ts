import { Router } from 'express';
import { body, param } from 'express-validator';
import comentarioController from '../controllers/comentario.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /versoes/:id/comentarios
 * @desc Cria um novo comentário
 * @access Private
 */
router.post(
  '/versoes/:id/comentarios',
  [
    authenticate,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
  ],
  comentarioController.createComentario
);

/**
 * @route GET /versoes/:id/comentarios
 * @desc Busca todos os comentários de uma versão de artigo
 * @access Private
 */
router.get(
  '/versoes/:id/comentarios',
  [
    authenticate,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  comentarioController.getComentariosByVersaoArtigo
);

export default router;
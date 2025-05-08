import { Router } from 'express';
import { body, param } from 'express-validator';
import avaliacaoController from '../controllers/avaliacao.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAvaliador } from '../middlewares/permission.middleware';
import { uploadArtigoPdf } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @route POST /versoes/:id/avaliacoes
 * @desc Cria uma nova avaliação
 * @access Private (apenas avaliadores)
 */
router.post(
  '/versoes/:id/avaliacoes',
  [
    authenticate,
    isAvaliador,
    uploadArtigoPdf,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nota').notEmpty().withMessage('Nota é obrigatória'),
    body('observacao').notEmpty().withMessage('Observação é obrigatória'),
  ],
  avaliacaoController.createAvaliacao
);

/**
 * @route GET /artigos/:id/avaliacoes
 * @desc Busca todas as avaliações de um artigo
 * @access Private
 */
router.get(
  '/artigos/:id/avaliacoes',
  [
    authenticate,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  avaliacaoController.getAvaliacoesByArtigo
);

/**
 * @route POST /versoes/:id/perguntas
 * @desc Responde às perguntas do checklist para uma versão do artigo
 * @access Private (apenas avaliadores)
 */
router.post(
  '/versoes/:id/perguntas',
  [
    authenticate,
    isAvaliador,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('perguntas').isArray().withMessage('Perguntas deve ser um array'),
    body('perguntas.*.perguntaIdpergunta').isInt().withMessage('ID da pergunta é obrigatório'),
    body('perguntas.*.checked').isBoolean().withMessage('Checked deve ser um booleano'),
  ],
  avaliacaoController.responderChecklist
);

export default router;
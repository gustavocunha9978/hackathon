import { Router } from 'express';
import authRoutes from './auth.routes';
import usuarioRoutes from './usuario.routes';
import eventoRoutes from './evento.routes';
import artigoRoutes from './artigo.routes';
import avaliacaoRoutes from './avaliacao.routes';
import comentarioRoutes from './comentario.routes';
import publicacaoRoutes from './publicacao.routes';
import checklistRoutes from './checklist.routes';
import { analyzeRoutes } from "./analyze.routes";

const router = Router();

router.use("/pdf", analyzeRoutes); 
// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuários
router.use('/usuarios', usuarioRoutes);

// Rotas de eventos
router.use('/eventos', eventoRoutes);

// Rotas de checklists
router.use('/', checklistRoutes);

// Rotas de artigos
router.use('/artigos', artigoRoutes);

// Rotas de avaliações
router.use('/', avaliacaoRoutes);

// Rotas de comentários
router.use('/', comentarioRoutes);

// Rotas de publicações
router.use('/publicacoes', publicacaoRoutes);

// Rotas de utilidade
router.get('/status-artigos', (req, res) => {
  const statusArtigos = [
    { idstatusArtigo: 1, descricao: 'Em Avaliação' },
    { idstatusArtigo: 2, descricao: 'Aguardando correção' },
    { idstatusArtigo: 3, descricao: 'Aprovado' },
    { idstatusArtigo: 4, descricao: 'Reprovado' },
  ];

  return res.status(200).json(statusArtigos);
});

router.get('/cargos', (req, res) => {
  const cargos = [
    { idcargo: 1, nome: 'Coordenador' },
    { idcargo: 2, nome: 'Avaliador' },
    { idcargo: 3, nome: 'Autor' },
  ];

  return res.status(200).json(cargos);
});

export default router;

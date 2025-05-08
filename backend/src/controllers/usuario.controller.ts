import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import usuarioService from '../services/usuario.service';

class UsuarioController {
  /**
   * Cria um novo usuário
   * @param req Requisição
   * @param res Resposta
   */
  async createUsuario(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Cria o usuário
      const { email, senha, nome, dataNascimento, cargos } = req.body;
      const usuario = await usuarioService.createUsuario({
        email,
        senha,
        nome,
        dataNascimento,
        cargos,
      });

      return res.status(201).json(usuario);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email já está em uso') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca um usuário pelo ID
   * @param req Requisição
   * @param res Resposta
   */
  async getUsuarioById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.getUsuarioById(Number(id));

      return res.status(200).json(usuario);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca todos os usuários
   * @param req Requisição
   * @param res Resposta
   */
  async getAllUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      const { cargo } = req.query;
      const usuarios = await usuarioService.getAllUsuarios(
        cargo ? Number(cargo) : undefined
      );

      return res.status(200).json(usuarios);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Atualiza um usuário
   * @param req Requisição
   * @param res Resposta
   */
  async updateUsuario(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { nome, email, senha, dataNascimento, cargos } = req.body;
      const usuario = await usuarioService.updateUsuario(Number(id), {
        nome,
        email,
        senha,
        dataNascimento,
        cargos,
      });

      return res.status(200).json(usuario);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        if (error.message === 'Email já está em uso') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Exclui um usuário
   * @param req Requisição
   * @param res Resposta
   */
  async deleteUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await usuarioService.deleteUsuario(Number(id));

      return res.status(200).json({ success: true, message: 'Usuário excluído com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }
}

export default new UsuarioController();
import prisma from '../config/database';
import authService from './auth.service';

export interface CreateUsuarioDTO {
  email: string;
  senha: string;
  nome: string;
  idinstituicao: number;
  dataNascimento: string;
  cargos?: number[];
}

export interface UpdateUsuarioDTO {
  nome?: string;
  idinstituicao: number;
  email?: string;
  senha?: string;
  dataNascimento?: string;
  cargos?: number[];
}

class UsuarioService {
  /**
   * Cria um novo usuário
   * @param usuarioData Dados do usuário
   * @returns Usuário criado
   */
  async createUsuario(usuarioData: CreateUsuarioDTO) {
    // Verifica se o email já está em uso
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: usuarioData.email },
    });

    if (usuarioExistente) {
      throw new Error('Email já está em uso');
    }

    // Criptografa a senha
    const senhaCriptografada = await authService.hashPassword(usuarioData.senha);

    // Cria o usuário
    const usuario = await prisma.usuario.create({
      data: {
        email: usuarioData.email,
        senha: senhaCriptografada,
        nome: usuarioData.nome,
        instituicao: {  // Usando 'instituicao' para fazer referência ao modelo
          connect: { idinstituicao: Number(usuarioData.idinstituicao) }  // Conectando o ID da instituição
        },
        data_nascimento: usuarioData.dataNascimento,
      },
    });

    // Se houver cargos, associa-os ao usuário
    if (usuarioData.cargos && usuarioData.cargos.length > 0) {
      const cargosParaAdicionar = Array.from(new Set([...usuarioData.cargos]));
      
      await Promise.all(
        cargosParaAdicionar.map((cargoId) =>
          prisma.cargoUsuario.create({
            data: {
              cargo_idcargo: cargoId,
              usuario_idusuario: usuario.idusuario,
            },
          })
        )
      );
    } else {
      // Se não houver cargos, adiciona o cargo de autor (3)
      await prisma.cargoUsuario.create({
        data: {
          cargo_idcargo: 3, // Autor
          usuario_idusuario: usuario.idusuario,
        },
      });
    }

    // Retorna o usuário com seus cargos
    return this.getUsuarioById(usuario.idusuario);
  }

  /**
   * Busca um usuário pelo ID
   * @param usuarioId ID do usuário
   * @returns Usuário encontrado
   */
  async getUsuarioById(usuarioId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { idusuario: usuarioId },
      include: {
        instituicao: true,  // Inclui os dados da instituição
        cargos: {
          include: {
            cargo: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Formata os cargos do usuário
    const cargos = usuario.cargos.map((cargoUsuario) => ({
      idcargo: cargoUsuario.cargo_idcargo,
      nome: cargoUsuario.cargo.nome,
    }));

    return {
      idusuario: usuario.idusuario,
      nome: usuario.nome,
      email: usuario.email,
      dataNascimento: usuario.data_nascimento,
      cargos,
      instituicao: usuario.instituicao ? {
        idinstituicao: usuario.instituicao.idinstituicao,
        nome: usuario.instituicao.nome,  // Você pode adicionar outros campos conforme necessário
        prefixo_email: usuario.instituicao.prefixo_email,
      } : null, // Retorna a instituição ou null caso não exista
    };
  }

  /**
   * Busca todos os usuários
   * @param cargoId Filtro por cargo (opcional)
   * @returns Lista de usuários
   */
  async getAllUsuarios(cargoId?: number) {
    let usuarios;

    if (cargoId) {
      // Busca usuários com um cargo específico
      usuarios = await prisma.usuario.findMany({
        where: {
          cargos: {
            some: {
              cargo_idcargo: cargoId,
            },
          },
        },
        include: {
          cargos: {
            include: {
              cargo: true,
            },
          },
        },
      });
    } else {
      // Busca todos os usuários
      usuarios = await prisma.usuario.findMany({
        include: {
          cargos: {
            include: {
              cargo: true,
            },
          },
        },
      });
    }

    // Formata os dados dos usuários
    return usuarios.map((usuario) => {
      const cargos = usuario.cargos.map((cargoUsuario) => ({
        idcargo: cargoUsuario.cargo_idcargo,
        nome: cargoUsuario.cargo.nome,
      }));

      return {
        idusuario: usuario.idusuario,
        nome: usuario.nome,
        email: usuario.email,
        cargos,
      };
    });
  }

  /**
   * Atualiza um usuário
   * @param usuarioId ID do usuário
   * @param usuarioData Dados do usuário
   * @returns Usuário atualizado
   */
  async updateUsuario(usuarioId: number, usuarioData: UpdateUsuarioDTO) {
    // Verifica se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { idusuario: usuarioId },
    });

    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica se o email já está em uso por outro usuário
    if (usuarioData.email && usuarioData.email !== usuarioExistente.email) {
      const emailEmUso = await prisma.usuario.findUnique({
        where: { email: usuarioData.email },
      });

      if (emailEmUso) {
        throw new Error('Email já está em uso');
      }
    }

    // Prepara os dados para atualização
    const dadosAtualizacao: any = {};

    if (usuarioData.nome) {
      dadosAtualizacao.nome = usuarioData.nome;
    }

    if (usuarioData.email) {
      dadosAtualizacao.email = usuarioData.email;
    }

    if (usuarioData.idinstituicao) {
      dadosAtualizacao.idinstituicao = usuarioData.idinstituicao;
    }

    if (usuarioData.dataNascimento) {
      dadosAtualizacao.data_nascimento = usuarioData.dataNascimento;
    }

    // Se houver senha, criptografa
    if (usuarioData.senha) {
      dadosAtualizacao.senha = await authService.hashPassword(usuarioData.senha);
    }

    // Atualiza o usuário
    await prisma.usuario.update({
      where: { idusuario: usuarioId },
      data: dadosAtualizacao,
    });

    // Se houver cargos, atualiza os cargos do usuário
    if (usuarioData.cargos) {
      // Remove todos os cargos atuais
      await prisma.cargoUsuario.deleteMany({
        where: { usuario_idusuario: usuarioId },
      });

      // Adiciona os novos cargos
      // Por padrão, todo usuário tem cargo de autor (3)
      const cargosParaAdicionar = Array.from(new Set([...usuarioData.cargos, 3]));
      
      await Promise.all(
        cargosParaAdicionar.map((cargoId) =>
          prisma.cargoUsuario.create({
            data: {
              cargo_idcargo: cargoId,
              usuario_idusuario: usuarioId,
            },
          })
        )
      );
    }

    // Retorna o usuário atualizado
    return this.getUsuarioById(usuarioId);
  }

  /**
   * Exclui um usuário
   * @param usuarioId ID do usuário
   */
  async deleteUsuario(usuarioId: number) {
    // Verifica se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { idusuario: usuarioId },
    });

    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    // Exclui as relações do usuário
    await prisma.$transaction([
      // Exclui as relações com cargos
      prisma.cargoUsuario.deleteMany({
        where: { usuario_idusuario: usuarioId },
      }),
      // Exclui o usuário
      prisma.usuario.delete({
        where: { idusuario: usuarioId },
      }),
    ]);

    return { success: true };
  }
}

export default new UsuarioService();
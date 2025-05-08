import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config/env';

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    idusuario: number;
    nome: string;
    email: string;
    cargos: Array<{ idcargo: number; nome: string }>;
  };
}

class AuthService {
  /**
   * Realiza a autenticação do usuário
   * @param loginData Dados de login (email e senha)
   * @returns Objeto contendo o token JWT e os dados do usuário
   */
  async login(loginData: LoginDTO): Promise<AuthResponse> {
    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: loginData.email },
      include: {
        cargos: {
          include: {
            cargo: true,
          },
        },
      },
    });

    // Verifica se o usuário existe
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(loginData.senha, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Senha incorreta');
    }

    // Formata os cargos do usuário
    const cargos = usuario.cargos.map((cargoUsuario) => ({
      idcargo: cargoUsuario.cargo_idcargo,
      nome: cargoUsuario.cargo.nome,
    }));

    // Gera o token JWT
    const token = jwt.sign(
      {
        user: {
          id: usuario.idusuario,
          nome: usuario.nome,
          email: usuario.email,
          cargos,
        },
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    // Retorna o token e os dados do usuário
    return {
      token,
      usuario: {
        idusuario: usuario.idusuario,
        nome: usuario.nome,
        email: usuario.email,
        cargos,
      },
    };
  }

  /**
   * Valida o token JWT
   * @param token Token JWT
   * @returns Dados do usuário decodificados do token
   */
  async validateToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Criptografa uma senha
   * @param senha Senha em texto plano
   * @returns Senha criptografada
   */
  async hashPassword(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
  }
}

export default new AuthService();
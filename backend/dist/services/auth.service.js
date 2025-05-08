"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const env_1 = require("../config/env");
class AuthService {
    /**
     * Realiza a autenticação do usuário
     * @param loginData Dados de login (email e senha)
     * @returns Objeto contendo o token JWT e os dados do usuário
     */
    async login(loginData) {
        // Busca o usuário pelo email
        const usuario = await database_1.default.usuario.findUnique({
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
        const senhaCorreta = await bcryptjs_1.default.compare(loginData.senha, usuario.senha);
        if (!senhaCorreta) {
            throw new Error('Senha incorreta');
        }
        // Formata os cargos do usuário
        const cargos = usuario.cargos.map((cargoUsuario) => ({
            idcargo: cargoUsuario.cargo_idcargo,
            nome: cargoUsuario.cargo.nome,
        }));
        // Gera o token JWT
        const token = jsonwebtoken_1.default.sign({
            user: {
                id: usuario.idusuario,
                nome: usuario.nome,
                email: usuario.email,
                cargos,
            },
        }, env_1.config.jwtSecret, {
            expiresIn: env_1.config.jwtExpiresIn,
        });
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
    async validateToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        }
        catch (error) {
            throw new Error('Token inválido');
        }
    }
    /**
     * Criptografa uma senha
     * @param senha Senha em texto plano
     * @returns Senha criptografada
     */
    async hashPassword(senha) {
        const salt = await bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(senha, salt);
    }
}
exports.default = new AuthService();

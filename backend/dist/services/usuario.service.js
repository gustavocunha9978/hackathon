"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const auth_service_1 = __importDefault(require("./auth.service"));
class UsuarioService {
    /**
     * Cria um novo usuário
     * @param usuarioData Dados do usuário
     * @returns Usuário criado
     */
    async createUsuario(usuarioData) {
        // Verifica se o email já está em uso
        const usuarioExistente = await database_1.default.usuario.findUnique({
            where: { email: usuarioData.email },
        });
        if (usuarioExistente) {
            throw new Error('Email já está em uso');
        }
        // Criptografa a senha
        const senhaCriptografada = await auth_service_1.default.hashPassword(usuarioData.senha);
        // Cria o usuário
        const usuario = await database_1.default.usuario.create({
            data: {
                email: usuarioData.email,
                senha: senhaCriptografada,
                nome: usuarioData.nome,
                data_nascimento: usuarioData.dataNascimento,
            },
        });
        // Se houver cargos, associa-os ao usuário
        if (usuarioData.cargos && usuarioData.cargos.length > 0) {
            // Por padrão, todo usuário tem cargo de autor (3)
            const cargosParaAdicionar = Array.from(new Set([...usuarioData.cargos, 3]));
            await Promise.all(cargosParaAdicionar.map((cargoId) => database_1.default.cargoUsuario.create({
                data: {
                    cargo_idcargo: cargoId,
                    usuario_idusuario: usuario.idusuario,
                },
            })));
        }
        else {
            // Se não houver cargos, adiciona o cargo de autor (3)
            await database_1.default.cargoUsuario.create({
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
    async getUsuarioById(usuarioId) {
        const usuario = await database_1.default.usuario.findUnique({
            where: { idusuario: usuarioId },
            include: {
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
        };
    }
    /**
     * Busca todos os usuários
     * @param cargoId Filtro por cargo (opcional)
     * @returns Lista de usuários
     */
    async getAllUsuarios(cargoId) {
        let usuarios;
        if (cargoId) {
            // Busca usuários com um cargo específico
            usuarios = await database_1.default.usuario.findMany({
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
        }
        else {
            // Busca todos os usuários
            usuarios = await database_1.default.usuario.findMany({
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
    async updateUsuario(usuarioId, usuarioData) {
        // Verifica se o usuário existe
        const usuarioExistente = await database_1.default.usuario.findUnique({
            where: { idusuario: usuarioId },
        });
        if (!usuarioExistente) {
            throw new Error('Usuário não encontrado');
        }
        // Verifica se o email já está em uso por outro usuário
        if (usuarioData.email && usuarioData.email !== usuarioExistente.email) {
            const emailEmUso = await database_1.default.usuario.findUnique({
                where: { email: usuarioData.email },
            });
            if (emailEmUso) {
                throw new Error('Email já está em uso');
            }
        }
        // Prepara os dados para atualização
        const dadosAtualizacao = {};
        if (usuarioData.nome) {
            dadosAtualizacao.nome = usuarioData.nome;
        }
        if (usuarioData.email) {
            dadosAtualizacao.email = usuarioData.email;
        }
        if (usuarioData.dataNascimento) {
            dadosAtualizacao.data_nascimento = usuarioData.dataNascimento;
        }
        // Se houver senha, criptografa
        if (usuarioData.senha) {
            dadosAtualizacao.senha = await auth_service_1.default.hashPassword(usuarioData.senha);
        }
        // Atualiza o usuário
        await database_1.default.usuario.update({
            where: { idusuario: usuarioId },
            data: dadosAtualizacao,
        });
        // Se houver cargos, atualiza os cargos do usuário
        if (usuarioData.cargos) {
            // Remove todos os cargos atuais
            await database_1.default.cargoUsuario.deleteMany({
                where: { usuario_idusuario: usuarioId },
            });
            // Adiciona os novos cargos
            // Por padrão, todo usuário tem cargo de autor (3)
            const cargosParaAdicionar = Array.from(new Set([...usuarioData.cargos, 3]));
            await Promise.all(cargosParaAdicionar.map((cargoId) => database_1.default.cargoUsuario.create({
                data: {
                    cargo_idcargo: cargoId,
                    usuario_idusuario: usuarioId,
                },
            })));
        }
        // Retorna o usuário atualizado
        return this.getUsuarioById(usuarioId);
    }
    /**
     * Exclui um usuário
     * @param usuarioId ID do usuário
     */
    async deleteUsuario(usuarioId) {
        // Verifica se o usuário existe
        const usuarioExistente = await database_1.default.usuario.findUnique({
            where: { idusuario: usuarioId },
        });
        if (!usuarioExistente) {
            throw new Error('Usuário não encontrado');
        }
        // Exclui as relações do usuário
        await database_1.default.$transaction([
            // Exclui as relações com cargos
            database_1.default.cargoUsuario.deleteMany({
                where: { usuario_idusuario: usuarioId },
            }),
            // Exclui o usuário
            database_1.default.usuario.delete({
                where: { idusuario: usuarioId },
            }),
        ]);
        return { success: true };
    }
}
exports.default = new UsuarioService();

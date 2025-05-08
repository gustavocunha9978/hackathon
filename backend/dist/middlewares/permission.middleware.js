"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAutor = exports.isAvaliador = exports.isCoordenador = exports.checkCargo = exports.Cargo = void 0;
var Cargo;
(function (Cargo) {
    Cargo[Cargo["COORDENADOR"] = 1] = "COORDENADOR";
    Cargo[Cargo["AVALIADOR"] = 2] = "AVALIADOR";
    Cargo[Cargo["AUTOR"] = 3] = "AUTOR";
})(Cargo || (exports.Cargo = Cargo = {}));
/**
 * Middleware para verificar se o usuário possui os cargos necessários
 * @param cargosPermitidos Array de IDs de cargos permitidos
 */
const checkCargo = (cargosPermitidos) => {
    return (req, res, next) => {
        // Verifica se o usuário está autenticado
        if (!req.user) {
            return res.status(401).json({ error: true, message: 'Usuário não autenticado' });
        }
        // Verifica se o usuário possui algum dos cargos permitidos
        const userCargos = req.user.cargos.map(cargo => cargo.idcargo);
        const hasPermission = cargosPermitidos.some(cargoId => userCargos.includes(cargoId));
        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                message: 'Usuário não possui permissão para acessar este recurso'
            });
        }
        return next();
    };
};
exports.checkCargo = checkCargo;
/**
 * Middleware para verificar se o usuário é coordenador
 */
const isCoordenador = (req, res, next) => {
    return (0, exports.checkCargo)([Cargo.COORDENADOR])(req, res, next);
};
exports.isCoordenador = isCoordenador;
/**
 * Middleware para verificar se o usuário é avaliador
 */
const isAvaliador = (req, res, next) => {
    return (0, exports.checkCargo)([Cargo.AVALIADOR, Cargo.COORDENADOR])(req, res, next);
};
exports.isAvaliador = isAvaliador;
/**
 * Middleware para verificar se o usuário é autor do artigo
 */
const isAutor = async (req, res, next) => {
    // A lógica para verificar se o usuário é autor do artigo será implementada nos serviços específicos
    // Isso geralmente requer uma consulta ao banco de dados
    return next();
};
exports.isAutor = isAutor;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const PORT = env_1.config.port || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} em modo ${env_1.config.nodeEnv}`);
});

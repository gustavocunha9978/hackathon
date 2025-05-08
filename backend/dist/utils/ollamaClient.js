"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOllama = askOllama;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function askOllama(prompt, model = "phi3") {
    const res = await (0, node_fetch_1.default)("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            prompt,
            stream: false
        }),
    });
    const data = await res.json();
    return data.response;
}

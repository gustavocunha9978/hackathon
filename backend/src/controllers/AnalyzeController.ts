import { Request, Response } from "express";
import { analyzePdfWithGemini } from "../services/analyzePdfWithGemini"; // você usou Gemini
import path from "path";
import fs from "fs";

export const AnalyzeController = {
  async handle(req: Request, res: Response) {
    try {
      console.log("📥 Requisição recebida");

      const file = req.file;
      if (!file) {
        console.log("❌ Nenhum arquivo enviado");
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const filePath = path.resolve(file.path);
      console.log("📄 Caminho do arquivo:", filePath);

      if (!fs.existsSync(filePath)) {
        console.log("❌ Arquivo não encontrado no servidor");
        return res.status(404).json({ error: "Arquivo não encontrado." });
      }

      const feedback = await analyzePdfWithGemini(filePath);

      console.log("✅ Feedback gerado");
      return res.json({ feedback });
    } catch (error) {
      console.error("💥 Erro no processamento:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },
};

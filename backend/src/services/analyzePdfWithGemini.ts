import fs from "fs";
import pdf from "pdf-parse";
import path from "path";
import { askGemini } from "../utils/geminiClient";

export async function analyzePdfWithGemini(filePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);

  const prompt = `Forneça um feedback técnico com base no seguinte conteúdo extraído de um PDF:\n\n${data.text}`;
  const feedback = await askGemini(prompt);

  return feedback;
}

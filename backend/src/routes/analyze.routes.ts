import { Router } from "express";
import multer from "multer";
import { AnalyzeController } from "../controllers/AnalyzeController";

const upload = multer({ dest: "./tmp" });
const analyzeRoutes = Router();

analyzeRoutes.post("/analyze", upload.single("file"), AnalyzeController.handle);

export { analyzeRoutes };

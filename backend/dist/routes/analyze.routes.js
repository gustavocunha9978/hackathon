"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const AnalyzeController_ts_1 = require("../controllers/AnalyzeController.ts");
const upload = (0, multer_1.default)({ dest: "tmp/" });
const analyzeRoutes = (0, express_1.Router)();
analyzeRoutes.post("/analyze", upload.single("file"), AnalyzeController_ts_1.AnalyzeController.handle);
exports.default = analyzeRoutes;

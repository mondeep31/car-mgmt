"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const errorHandler = (err, req, res, next) => {
    console.error('Global Error Handler:', err); // Log error details
    if (err instanceof multer_1.default.MulterError) {
        res.status(400).json({
            error: 'File upload error',
            details: err.message
        });
        return;
    }
    res.status(500).json({ error: 'Something went wrong!' });
    return;
};
exports.errorHandler = errorHandler;

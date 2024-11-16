"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const carRoutes_1 = __importDefault(require("./routes/carRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the uploads directory using absolute path
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/auth', authRoutes_1.default);
app.use('/cars', carRoutes_1.default);
// Global error handler
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
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

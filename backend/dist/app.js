"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const carRoutes_1 = __importDefault(require("./routes/carRoutes"));
const errorHandler_1 = require("./utils/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// serving static files
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// error handling
app.use(errorHandler_1.errorHandler);
//routes
app.use('/auth', authRoutes_1.default);
app.use('/cars', carRoutes_1.default);
exports.default = app;

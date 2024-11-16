"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const carController_1 = require("../controllers/carController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
router.post('/', auth_1.auth, multer_1.upload.array('images', 10), validation_1.validateCar, carController_1.createCar);
router.get('/', auth_1.auth, carController_1.getCars);
router.get('/:id', auth_1.auth, carController_1.getCar);
router.put('/:id', auth_1.auth, multer_1.upload.array('images', 10), validation_1.validateCar, carController_1.updateCar);
router.delete('/:id', auth_1.auth, carController_1.deleteCar);
exports.default = router;

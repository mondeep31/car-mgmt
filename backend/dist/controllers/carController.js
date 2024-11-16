"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = exports.updateCar = exports.getCar = exports.getCars = exports.createCar = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, tags } = req.body;
        const images = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path)) || [];
        // No need to parse tags again since it's already handled in validation
        const car = yield prisma.car.create({
            data: {
                title,
                description,
                tags, // tags is already an array from validation
                images,
                userId: req.userId
            }
        });
        res.status(201).json(car);
    }
    catch (error) {
        console.error('Error creating car:', error);
        res.status(400).json({
            error: 'Could not create car',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.createCar = createCar;
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search;
        const where = Object.assign({ userId: req.userId }, (search && {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        hasSome: [search]
                    }
                }
            ]
        }));
        const cars = yield prisma.car.findMany({ where });
        res.json(cars);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Could not fetch cars' });
    }
});
exports.getCars = getCars;
const getCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield prisma.car.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        res.json(car);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Could not fetch car' });
    }
});
exports.getCar = getCar;
const updateCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Log the incoming request for debugging
        console.log('Update request:', {
            params: req.params,
            body: req.body,
            files: req.files
        });
        const { title, description, tags } = req.body;
        const images = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path);
        // Validate the ID
        const carId = req.params.id;
        if (!carId || typeof carId !== 'string') {
            res.status(400).json({ error: 'Invalid car ID' });
            return;
        }
        // Handle tags properly
        let tagsArray = [];
        if (tags) {
            try {
                // Check if tags is already an array
                if (Array.isArray(tags)) {
                    tagsArray = tags;
                }
                else if (typeof tags === 'string') {
                    // Try parsing as JSON first
                    try {
                        tagsArray = JSON.parse(tags);
                    }
                    catch (_b) {
                        // If JSON parsing fails, split by comma
                        tagsArray = tags.split(',').map(tag => tag.trim());
                    }
                }
            }
            catch (error) {
                console.error('Error parsing tags:', error);
                res.status(400).json({ error: 'Invalid tags format' });
                return;
            }
        }
        // Check if car exists and belongs to user
        const existingCar = yield prisma.car.findFirst({
            where: {
                id: carId,
                userId: req.userId
            }
        });
        if (!existingCar) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        // Prepare update data
        const updateData = Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), { tags: tagsArray }), (images && images.length > 0 && { images }));
        // Update the car
        const updatedCar = yield prisma.car.update({
            where: { id: carId },
            data: updateData
        });
        res.json(updatedCar);
        return;
    }
    catch (error) {
        console.error('Update error:', error);
        res.status(400).json({
            error: 'Could not update car',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
});
exports.updateCar = updateCar;
const deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield prisma.car.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        yield prisma.car.delete({
            where: { id: req.params.id }
        });
        res.status(204).send().json({
            message: "Car deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Could not delete car' });
    }
});
exports.deleteCar = deleteCar;

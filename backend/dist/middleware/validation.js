"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCar = exports.validateUser = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2)
});
// MongoDB ObjectId validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = zod_1.z.string().regex(objectIdRegex, 'Invalid ObjectId format');
const validateUser = (req, res, next) => {
    try {
        exports.userSchema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid input' });
        return;
    }
};
exports.validateUser = validateUser;
// Helper function to parse tags
const parseTagsString = (tagsInput) => {
    if (Array.isArray(tagsInput)) {
        return tagsInput.map(String);
    }
    if (typeof tagsInput === 'string') {
        try {
            // Try parsing as JSON first
            const parsed = JSON.parse(tagsInput);
            if (Array.isArray(parsed)) {
                return parsed.map(String);
            }
        }
        catch (_a) {
            // If JSON parsing fails, split by comma
            return tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
        }
    }
    return [];
};
const carSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    tags: zod_1.z
        .any()
        .transform(parseTagsString)
        .pipe(zod_1.z.array(zod_1.z.string()))
        .optional()
        .default([])
});
// For updates, make all fields optional
const carUpdateSchema = carSchema.partial();
const validateCar = (req, res, next) => {
    try {
        const schema = req.method === 'PUT' ? carUpdateSchema : carSchema;
        const validatedData = schema.parse(req.body);
        // Update request body with validated data
        req.body = validatedData;
        next();
    }
    catch (error) {
        console.error('Validation error:', error);
        res.status(400).json({
            error: 'Invalid input',
            details: error instanceof zod_1.z.ZodError ? error.errors : String(error)
        });
    }
};
exports.validateCar = validateCar;

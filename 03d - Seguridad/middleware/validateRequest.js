import { body, param, validationResult } from "express-validator";

const ROLES = ["root", "admin", "user", "guest"];

export const signupRules = [
    body("fullname")
        .trim()
        .notEmpty().withMessage("El nombre completo es obligatorio")
        .isLength({ min: 3, max: 80 }).withMessage("El nombre completo debe tener entre 3 y 80 caracteres"),
    body("email")
        .trim()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email debe tener un formato válido"),
    body("username")
        .trim()
        .notEmpty().withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3, max: 30 }).withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
        .matches(/^[A-Za-z0-9_]+$/).withMessage("El nombre de usuario solo puede contener letras, números y guiones bajos"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 8, max: 100 }).withMessage("La contraseña debe tener entre 8 y 100 caracteres"),
    body("rol")
        .optional()
        .isIn(ROLES).withMessage("El rol seleccionado no es válido")
];

export const signinRules = [
    body("username")
        .trim()
        .notEmpty().withMessage("El nombre de usuario es obligatorio"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
];

export const userIdParamRule = [
    param("id")
        .notEmpty().withMessage("El identificador es obligatorio")
        .isMongoId().withMessage("El identificador debe ser un MongoID válido")
];

export const updateUserRules = [
    body("fullname")
        .optional()
        .trim()
        .isLength({ min: 3, max: 80 }).withMessage("El nombre completo debe tener entre 3 y 80 caracteres"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("El email debe tener un formato válido"),
    body("password")
        .optional()
        .isLength({ min: 8, max: 100 }).withMessage("La contraseña debe tener entre 8 y 100 caracteres"),
    body("rol")
        .optional()
        .isIn(ROLES).withMessage("El rol seleccionado no es válido")
];

export const categoryCreateRules = [
    body("name")
        .trim()
        .notEmpty().withMessage("El nombre de la categoría es obligatorio")
        .isLength({ max: 50 }).withMessage("El nombre de la categoría no puede superar 50 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("La descripción no puede superar 200 caracteres")
];

export const categoryUpdateRules = [
    body("id")
        .notEmpty().withMessage("El identificador de la categoría es obligatorio")
        .isMongoId().withMessage("El identificador debe ser un MongoID válido"),
    body("name")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("El nombre de la categoría no puede superar 50 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("La descripción no puede superar 200 caracteres")
];

export const categoryDeleteRules = [
    body("id")
        .notEmpty().withMessage("El identificador de la categoría es obligatorio")
        .isMongoId().withMessage("El identificador debe ser un MongoID válido")
];

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status_code: 400,
            status_message: "Bad request",
            body_message: errors.array().map(err => `${err.param}: ${err.msg}`)
        });
    }
    next();
};

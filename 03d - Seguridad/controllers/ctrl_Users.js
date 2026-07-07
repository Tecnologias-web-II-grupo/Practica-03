import mongoose from "mongoose";

import secret from "../config/configSecret.js";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const Users = mongoose.model('Users');

export const signup = async (req, res, next) => {
    const user = new Users({
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        rol: req.body.rol
    });

    await Users.insertMany(user).then(() => {
        const msgJson = {
            status_code: 200,
            status_message: "OK",
            body_message: "Usuario registrado exitosamente"
        };
        res.status(200).json(msgJson);
    }).catch(err => {
        const msgJson = {
            status_code: 500,
            status_message: "Server error",
            body_message: err.message
        };
        res.status(500).json(msgJson);
    });
};

export const signin = async (req, res) => {
    await Users.findOne({username: req.body.username}).then((user) => {
        if (!user) {
            const msgJson = {
                status_code: 404,
                status_message: "Not found",
                body_message: "El usuario no existe"
            };
            return res.status(404).send(msgJson);
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            const msgJson = {
                status_code: 401,
                status_message: "Unauthorized",
                body_message: "La contraseña es inválida"
            };
            return res.status(401).json(msgJson);
        }

        const token = jsonwebtoken.sign({ id: user._id }, secret, {
            expiresIn: 86400,
        });

        req.session.token = token;

        const msgJson = {
            status_code: 200,
            status_message: "Ok",
            body_message: {
                id: user._id,
                username: user.username,
                email: user.email,
                rol: user.rol
            }
        };

        res.status(200).send(msgJson);
    }).catch(err => {
        const msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err.message
        };
        res.status(500).send(msgJson);
    })
};

export const signout = async (req, res) => {
    try {
        req.session = null;
        const msgJson = {
            status_code: 200,
            status_message: "OK",
            body_message: "Sesión cerrada exitosamente"
        };
        res.status(200).json(msgJson);
    } catch (err) {
        next(err);
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await Users.find();
        const msgJson = {
            status_code: 200,
            status_message: "OK",
            body_message: users
        };
        res.status(200).json(msgJson);
    } catch (err) {
        const msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err.message
        };
        res.status(500).json(msgJson);
    }
};

export const getById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            const msgJson = {
                status_code: 404,
                status_message: "Not found",
                body_message: "Usuario no encontrado"
            };
            return res.status(404).json(msgJson);
        }
        const msgJson = {
            status_code: 200,
            status_message: "OK",
            body_message: user
        };
        res.status(200).json(msgJson);
    } catch (err) {
        const msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err.message
        };
        res.status(500).json(msgJson);
    }
};

export const update = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            const msgJson = {
                status_code: 404,
                status_message: "Not found",
                body_message: "Usuario no encontrado"
            };
            return res.status(404).json(msgJson);
        }

        if (user.isProtected) {
            const msgJson = {
                status_code: 403,
                status_message: "Forbidden",
                body_message: "No se puede modificar el usuario ROOT"
            };
            return res.status(403).json(msgJson);
        }

        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = bcrypt.hashSync(req.body.password, 8);
        if (req.body.rol) user.rol = req.body.rol;

        await user.save();
        const msgJson = {
            status_code: 200,
            status_message: "OK",
            body_message: "Usuario actualizado exitosamente"
        };
        res.status(200).json(msgJson);
    } catch (err) {
        const msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err.message
        };
        res.status(500).json(msgJson);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            const msgJson = {
                status_code: 404,
                status_message: "Not found",
                body_message: "Usuario no encontrado"
            };
            return res.status(404).json(msgJson);
        }

        if (user.isProtected) {
            const msgJson = {
                status_code: 403,
                status_message: "Forbidden",
                body_message: "No se puede eliminar el usuario ROOT"
            };
            return res.status(403).json(msgJson);
        }

        await Users.findByIdAndDelete(req.params.id);
        const msgJson = {
            status_code: 200,
            status_message: "OK",
            body_message: "Usuario eliminado exitosamente"
        };
        res.status(200).json(msgJson);
    } catch (err) {
        const msgJson = {
            status_code: 500,
            status_message: "Internal Server Error",
            body_message: err.message
        };
        res.status(500).json(msgJson);
    }
};

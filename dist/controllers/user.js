"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logging_1 = __importDefault(require("../config/logging"));
const user_1 = __importDefault(require("../models/user"));
const signJWT_1 = __importDefault(require("../functions/signJWT"));
const NAMESPACE = 'User';
const validateToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated, user authorized.');
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};
const register = (req, res, next) => {
    let { firstname, lastname, email, username, password } = req.body;
    bcryptjs_1.default.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }
        // if (password !== confirmPassword) {
        //     return res.status(403).json({
        //         message: "Password does not match",
        //     })
        // }
        const _user = new user_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            firstname,
            lastname,
            email,
            username,
            password: hash
        });
        return _user
            .save()
            .then((user) => {
            return res.status(201).json({
                user
            });
        })
            .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    });
};
const login = (req, res, next) => {
    let { username, password } = req.body;
    user_1.default.find({ username })
        .exec()
        .then((users) => {
        if (users.length !== 1) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        bcryptjs_1.default.compare(password, users[0].password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Password Mismatch'
                });
            }
            else if (result) {
                signJWT_1.default(users[0], (_error, token) => {
                    if (_error) {
                        return res.status(500).json({
                            message: _error.message,
                            error: _error
                        });
                    }
                    else if (token) {
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token,
                            user: users[0]
                        });
                    }
                });
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
const getAllUsers = (req, res, next) => {
    user_1.default.find()
        .select('-password')
        .exec()
        .then((users) => {
        return res.status(200).json({
            users: users,
            count: users.length
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};
exports.default = { validateToken, register, login, getAllUsers };

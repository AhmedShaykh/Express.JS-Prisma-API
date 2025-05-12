import { loginSchema, registerSchema } from "../validations/authValidation.js";
import prisma from "../db/prisma.js";
import vine, { errors } from "@vinejs/vine";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class AuthController {

    static async register(req, res) {

        try {

            const body = req.body;

            const validator = vine.compile(registerSchema);

            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            });

            if (findUser) {

                return res.status(400).json({
                    errors: {
                        email: "Email Already Taken"
                    }
                });

            }

            const salt = bcrypt.genSaltSync(10);

            payload.password = bcrypt.hashSync(payload.password, salt);

            const user = await prisma.users.create({
                data: payload
            });

            return res.json({
                status: 200,
                message: "User Created Successfully",
                user
            });

        } catch (error) {

            console.log("The Error Is: ", error);

            if (error instanceof errors.E_VALIDATION_ERROR) {

                return res.status(400).json({ errors: error.messages });

            } else {

                return res.status(500).json({
                    status: 500,
                    message: "Something Went Wrong! Please Try Again..."
                });

            }

        }

    };


    static async login(req, res) {

        try {

            const body = req.body;

            const validator = vine.compile(loginSchema);

            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            });

            if (findUser) {

                if (!bcrypt.compareSync(payload.password, findUser.password)) {

                    return res.status(400).json({
                        errors: {
                            email: "Invalid Credentials..."
                        }
                    });

                }

                const payloadData = {
                    id: findUser.id,
                    name: findUser.name,
                    email: findUser.email,
                    profile: findUser.profile
                };

                const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
                    expiresIn: "365d"
                });

                return res.json({
                    message: "Log In Successfully",
                    access_token: `Bearer ${token}`
                });

            }

            return res.status(400).json({
                errors: {
                    email: "No User Found With This Email."
                }
            });

        } catch (error) {

            console.log("The Error Is: ", error);

            if (error instanceof errors.E_VALIDATION_ERROR) {

                return res.status(400).json({ errors: error.messages });

            } else {

                return res.status(500).json({
                    status: 500,
                    message: "Something Went Wrong! Please Try Again..."
                });

            }

        }

    };

};

export default AuthController;
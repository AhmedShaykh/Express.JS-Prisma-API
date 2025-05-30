import { generateRandomNum, imageValidator } from "../utils/helper.js";
import prisma from "../db/prisma.js";

class ProfileController {

    static async index(req, res) {

        try {

            const user = req.user;

            return res.json({ status: 200, user });

        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!" });

        }

    };

    static async store() { };

    static async show() { };

    static async update(req, res) {

        try {

            const { id } = req.params;

            if (!req.files || Object.keys(req.files).length === 0) {

                return res.status(400).json({ status: 400, message: "Profile Image Is Required" });

            }

            const profile = req.files.profile;

            const message = imageValidator(profile?.size, profile.mimetype);

            if (message !== null) {

                return res.status(400).json({
                    errors: {
                        profile: message
                    }
                });

            }

            const imgExt = profile?.name.split(".");

            const imageName = generateRandomNum() + "." + imgExt[1];

            const uploadPath = process.cwd() + "/src/public/images/" + imageName;

            profile.mv(uploadPath, (err) => {

                if (err) throw err;

            });

            await prisma.users.update({
                data: {
                    profile: imageName
                },
                where: {
                    id: Number(id)
                }
            });

            return res.json({
                status: 200,
                message: "Profile Updated Successfully!"
            });

        } catch (error) {

            console.log("The Error Is:", error);

            return res.status(500).json({ message: "Something Went Wrong!" });

        }

    };

    static async destroy() { };

};

export default ProfileController;
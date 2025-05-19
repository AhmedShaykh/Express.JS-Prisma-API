import { imageValidator, removeImage, uploadImage } from "../utils/helper.js";
import NewsApiTransform from "../transform/newsApiTransform.js";
import { newsSchema } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";
import prisma from "../db/prisma.js";

class NewsController {

    static async index(req, res) {

        let page = Number(req.query.page) || 1;

        let limit = Number(req.query.limit) || 10;

        if (page <= 0) {

            page = 1;

        }

        if (limit <= 0 || limit > 100) {

            limit = 10;

        }

        const skip = (page - 1) * limit;

        const news = await prisma.news.findMany({
            take: limit,
            skip: skip,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true
                    }
                }
            }
        });

        const newsTransform = news?.map((item) => NewsApiTransform.transform(item));

        const totalNews = await prisma.news.count();

        const totalPages = Math.ceil(totalNews / limit);

        return res.json({
            status: 200,
            news: newsTransform,
            metadata: {
                totalPages,
                currentPage: page,
                currentLimit: limit
            }
        });

    };

    static async store(req, res) {

        try {

            const user = req.user;

            const body = req.body;

            const validator = vine.compile(newsSchema);

            const payload = await validator.validate(body);

            if (!req.files || Object.keys(req.files).length === 0) {

                return res.status(400).json({
                    errors: {
                        image: "Image Field Is Required"
                    }
                });

            }

            const image = req.files?.image;

            const message = imageValidator(image?.size, image?.mimetype);

            if (message !== null) {

                return res.status(400).json({
                    errors: {
                        image: message
                    }
                });

            }

            const imageName = uploadImage(image);

            payload.image = imageName;

            payload.user_id = user.id;

            const news = await prisma.news.create({
                data: payload
            });

            return res.json({
                status: 200,
                message: "News Created Successfully!",
                news
            });

        } catch (error) {

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

    static async show(req, res) {

        try {

            const { id } = req.params;

            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });

            const transFormNews = news ? NewsApiTransform.transform(news) : null;

            return res.json({ status: 200, news: transFormNews });

        } catch (error) {

            return res.status(500).json({
                status: 500,
                message: "Something Went Wrong! Please Try Again..."
            });

        }

    };

    static async update(req, res) {

        try {

            const { id } = req.params;

            const user = req.user;

            const body = req.body;

            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (user.id !== news.user_id) {

                return res.status(400).json({ message: "UnAtuhorized" });

            }

            const validator = vine.compile(newsSchema);

            const payload = await validator.validate(body);

            const image = req?.files?.image;

            if (image) {

                const message = imageValidator(image?.size, image?.mimetype);

                if (message !== null) {
                    return res.status(400).json({
                        errors: {
                            image: message
                        }
                    });
                }

                const imageName = uploadImage(image);

                payload.image = imageName;

                removeImage(news.image);

            }

            await prisma.news.update({
                data: payload,
                where: {
                    id: Number(id)
                }
            });

            return res.status(200).json({ message: "News Updated Successfully!" });

        } catch (error) {

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

    static async destroy(req, res) {

        try {

            const { id } = req.params;

            const user = req.user;

            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (user.id !== news?.user_id) {

                return res.status(401).json({ message: "UnAuthorized" });

            }

            removeImage(news.image);

            await prisma.news.delete({
                where: {
                    id: Number(id)
                }
            });

            return res.json({ message: "News Deleted Successfully!" });

        } catch (error) {

            return res.status(500).json({
                status: 500,
                message: "Something Went Wrong! Please Try Again..."
            });

        }

    };

};

export default NewsController;
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express.JS Prisma API",
            version: "1.0.0",
            description: "Express.JS Prisma Full Stack API With Swagger UI",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.js", "./src/controllers/*.js"]
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
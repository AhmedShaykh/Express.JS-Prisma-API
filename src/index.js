import { swaggerUi, specs } from "./config/swagger.js";
import { limiter } from "./config/ratelimiter.js";
import ApiRoutes from "./routes/api.js";
import fileUpload from "express-fileupload";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static("src/public"));

app.use(fileUpload());

app.use(helmet());

app.use(cors());

app.use(limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", ApiRoutes);

if (process.env.NODE_ENV !== "production") {

    app.listen(PORT, () => console.log(`Server Is Running On PORT ${PORT}`));

}

export default app;
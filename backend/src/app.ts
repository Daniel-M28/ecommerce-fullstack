import express from "express";
import healthRouter from "./routes/health.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
const app = express();

//Midleware para interpretar JSON
app.use(express.json());

//registrar rutas
app.use("/api", healthRouter);

app.use("/api/categories", categoryRoutes);

//middleware de manejo de errores

app.use(errorMiddleware);


export default app;
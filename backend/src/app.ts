import express from "express";
import healthRouter from "./routes/health.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import productImageRoutes from "./routes/product-image.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

//Midleware para interpretar JSON
app.use(express.json());

//registrar rutas
app.use("/api", healthRouter);

//categorias
app.use("/api/categories", categoryRoutes);

//imagenes de productos
app.use("/api/products", productImageRoutes);

//productos
app.use("/api/products", productRoutes);

//ordenes
app.use("/api/orders", orderRoutes);

//usuarios
app.use("/api/users", userRoutes);

//carrito
app.use("/api/cart", cartRoutes);



//middleware de manejo de errores

app.use(errorMiddleware);


export default app;
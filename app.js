import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/users.route.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import connectTODatabase from "./database/mongodb.js";
import arvjetMiddleware from "./middlewares/arcjet.middleware.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware)
app.use(arvjetMiddleware);


app.get("/", (req, res) => {
    res.send("HELLO!!!");
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API running on  http://localhost:${PORT}`);
   await connectTODatabase();
});

export default app;

import express, { Request, Response } from "express";

const app = express();

app.get("/",(req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Uthao Parcel Delivery System API"
    });
});

export default app;
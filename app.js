import express from "express";
import rateLimit from 'express-rate-limit';
import { directStream, checkHealth } from "./src/controller.js";
const app = express();
const port = process.env.PORT || 3001;

const limiter = rateLimit({
	windowMs: 4 * 60 * 1000, // 5 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message : "Stop messing around",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);


app.get("/", (req, res) => {
    res.send("Server up and running on ");
    console.log("Pinged");
})

app.get("/api/health", checkHealth);

app.get("/directStream", directStream);


// app.get("/directStream2", directStream);

app.listen(port, ()=> {
    console.log("Express app listening on port: " + `${port}`);
})
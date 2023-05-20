import express from "express";
import { directStream } from "./src/controller.js";
const app = express();
const port = process.env.PORT || 3001;


app.get("/", (req, res) => {
    res.send("Server up and running on ");
    console.log("Pinged");
})

app.get("/directStream", directStream);


// app.get("/directStream2", directStream);

app.listen(port, ()=> {
    console.log("Express app listening on port: " + `${port}`);
})
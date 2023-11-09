import express from "express";
import bodyparser from "body-parser";
import "dotenv/config";
import authRouter from "./src/routes/auth.route";
import apiRouter from "./src/routes/api.route";
import "./src/configs/db.config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(express.json({ limit: "10mb" }));
app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
);

app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("app is running on http://localhost:", PORT);
});

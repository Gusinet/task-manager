import express from "express";
import bcrypt from "bcryptjs"
import("./db/mongoose.js");
import { userRouter } from "./routers/user.js";
import { taskRouter } from "./routers/task.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
  console.log("server is up on port" + port);
});

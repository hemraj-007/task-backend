import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes";
import { taskRoutes } from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczNTQwNDQzNywiZXhwIjoxNzM1NDA4MDM3fQ.OlmxM9rvDPW92MT1UckqV0TKkBIT6RRycDLtfBAKTH8"
// }
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", taskRoutes);

app.get("/", (req, res) => {
  res.send("Todo API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
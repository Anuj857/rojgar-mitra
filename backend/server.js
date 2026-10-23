const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/rojgar", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Rojgar Mitra API Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
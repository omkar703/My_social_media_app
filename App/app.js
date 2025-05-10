const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB once here
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  const { name, username, age, email, password } = req.body;

  try {
    let existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      username,
      age,
      email,
      password: hashedPassword, // ✅ Store as "password"
    });

    await user.save();
    jwt.sign({ id: user._id, email: user.email }, "secretkey", (err, token) => {
      if (err) throw err;
      res.cookie("token", token);
      res.send("User registered successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("Something went wrong");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Incorrect password");

    jwt.sign({ id: user._id, email: user.email }, "secretkey", (err, token) => {
      if (err) throw err;
      res.cookie("token", token);
      // res.send("User logged in successfully");
      res.redirect("/profile");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/login");
    return;
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
}

app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).lean(); // lean() returns plain JS object
    if (!user) return res.status(404).send("User not found");

    res.render("profile", { user }); // assuming you have a profile.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/createpost", (req, res) => {
  res.render("createpost");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

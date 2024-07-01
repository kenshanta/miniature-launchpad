require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const Url = require("./models/urlModel");
const app = express();
const client = new Client(process.env.DATABASE_URL);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("PostgresDb connected.");
  } catch (err) {
    console.log("error postgresdB:", err);
    process.exit(1);
  }
};

connectDB();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

app.get("/", async (req, res) => {
  try {
    const urls = await Url.getAllUrls();
    res.render("index", { urls: urls.rows });
  } catch (error) {
    console.log("failed to get all urls. Error:", error);
    res.status(500).send(`${error}`);
  }
});
app.post("/shorten", async (req, res) => {
  try {
    await Url.createUrl(req.body.fullUrl);
    res.redirect("/");
  } catch (error) {
    console.log("failed to get all urls. Error:", error);
    res.status(500).send(`${error}`);
  }
});
app.post("/delete", async (req, res) => {
  try {
    await Url.deleteUrl(req.body.shortUrl);
    res.redirect("/");
  } catch (error) {
    console.log("failed to get all urls. Error:", error);
    res.status(500).send(`${error}`);
  }
});
app.post("/:shortUrl", async (req, res) => {
  try {
    await Url.incrementClickCount(req.body.shortUrl);
    res.redirect("/");
  } catch (error) {
    console.log("failed to get all urls. Error:", error);
    res.status(500).send(`${error}`);
  }
});
module.exports = app;

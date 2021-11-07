const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(
  process.env.MONGO_URL ||
    "mongodb+srv://aditya:aditya@cluster0.3xhxi.mongodb.net"
);
client.connect();
const data = client.db("bluesky").collection("data");

router.get("/countries", async (req, res, next) => {
  let startYear = 1,
    endYear = 3000,
    page = 0,
    count = 10;

  if (req.query.startYear && parseInt(req.query.startYear) > 0) {
    startYear = parseInt(req.query.startYear);
  }

  if (req.query.endYear && parseInt(req.query.endYear) > 0) {
    endYear = parseInt(req.query.endYear);
  }

  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }

  if (req.query.count && parseInt(req.query.count) > 0) {
    count = parseInt(req.query.count);
  }

  data
    .find({ year: { $gt: startYear - 1, $lt: endYear + 1 } })
    .skip(page * count)
    .limit(count)
    .toArray((err, result) => {
      if (err) throw err;

      res.json(result);
    });
});

router.get("/country/:category", async (req, res, next) => {
  const match_strings = [];
  let startYear = 1,
    endYear = 3000,
    page = 0,
    count = 10;

  if (req.query.startYear && parseInt(req.query.startYear) > 0) {
    startYear = parseInt(req.query.startYear);
  }

  if (req.query.endYear && parseInt(req.query.endYear) > 0) {
    endYear = parseInt(req.query.endYear);
  }

  if (req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }

  if (req.query.count && parseInt(req.query.count) > 0) {
    count = parseInt(req.query.count);
  }

  const params = req.params.category.toUpperCase();

  if (params.includes("CO2")) {
    match_strings.push(/carbon_dioxide/);
  }
  if (params.includes("GHGS")) {
    match_strings.push(/greenhouse/);
  }
  if (params.includes("CH4")) {
    match_strings.push(/methane/);
  }
  if (params.includes("N2O")) {
    match_strings.push(/nitrous_oxide/);
  }
  if (params.includes("SF6")) {
    match_strings.push(/sulphur_hexafluoride/);
  }

  if (match_strings.length === 0) {
    data
      .find({ year: { $gt: startYear - 1, $lt: endYear + 1 } })
      .skip(page * count)
      .limit(count)
      .toArray((err, result) => {
        if (err) throw err;

        res.json(result);
      });
  } else {
    data
      .find({
        $and: [
          { category: { $in: match_strings } },
          { year: { $gt: startYear - 1, $lt: endYear + 1 } },
        ],
      })
      .skip(page * count)
      .limit(count)
      .toArray((err, result) => {
        if (err) throw err;

        res.json(result);
      });
  }
});

module.exports = router;

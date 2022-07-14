const cors = require("cors");
const colors = require("colors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { connectDB } = require("./config/db");

const schema = require("./schema/schema");
const { IS_DEV_ENV } = require("./utils");

const app = express();
connectDB();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: IS_DEV_ENV,
  })
);

app.get("/", (req, res) => {
  res.end("Hello Stranger, how's it going?");
});

app.listen(PORT, () => {
  console.log(`Started on PORT ${PORT}`.bgYellow.black);
});

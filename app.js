const express = require("express");
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/todoRoutes");
const authRouter = require("./routes/authRoutes");
const photoRouter = require("./routes/photoRoutes");
const passport = require("passport");
const session = require("express-session");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*24*7 },
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
require("./passport/passport");
//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/photo", photoRouter);

module.exports = app;

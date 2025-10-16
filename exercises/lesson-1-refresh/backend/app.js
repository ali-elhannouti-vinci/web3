var express = require("express");
var path = require("path");
var cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var expensesRouter = require("./routes/expenses");

var app = express();

var corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use('/api',createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
}))

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/expenses", expensesRouter);

module.exports = app;

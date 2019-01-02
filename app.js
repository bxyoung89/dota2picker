const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const routes = require("./routes/index");
const getLocale = require("./routes/get-locale");
const getTranslation = require("./routes/get-translation");
const getAdvantages = require("./routes/get-advantages");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(favicon(`${__dirname}/public/images/favicons/favicon.ico`));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/getLocale", getLocale);
app.use("/getTranslation", getTranslation);
app.use("/getAdvantages", getAdvantages);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use((err, req, res) => {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err,
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.render("error", {
		message: err.message,
		error: {},
	});
});

module.exports = app;

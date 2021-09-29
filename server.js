//.env setups
if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

//Get Routers configured
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

//Setup DB / Models
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true 
});

// mongoose.connect("mongodb://localhost/mybrary", {
//     useNewUrlParser: true 
// });

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));


//Setting View Engine and Location
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//Setting layouts so that we can reuse - like header and footer
app.set("layout", "layouts/layout");

//App Uses
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({limit:"10mb", extended:false}));


//Use Router
app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

//Listening Port
app.listen(process.env.PORT || 3000);
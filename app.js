//express setup
require('dotenv').config();
const express = require("express");
const app = express();
 
const MongoStore= require("connect-mongo"); 

const dbUrl = process.env.MONGO_URI;


let port = "8080";

app.listen(port, () => {
    console.log("server running");
})

//mongoose setup
const mongoose = require("mongoose");

main().then((res) => {
    console.log("connection establish");
})
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);

}

//listing js require

const Listing = require("./models/listing.js");

//ejs setup

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// ejs-mate 

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//css setup
app.use(express.static(path.join(__dirname, "/public")));

//wrapAsync
const wrapAsync = require("./utils/wrapAsync.js");


//ExpressError
const ExpressError = require("./utils/ExpressError.js");

//joi
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

//Review model require
const Review = require("./models/review.js")

//listing.js 
const listingRouter = require("./routes/listing.js");

//review.js
const reviewsRouter = require("./routes/review.js");

//user.js
const userRouter = require("./routes/user.js");

//express-session
const session = require("express-session");

//flash 
const flash = require("connect-flash");

//passport
const passport = require("passport");

//local strategy
const Localstrategy = require("passport-local")

//user model
const User = require("./models/user.js")

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: "mysupersecretstring",
    },
    touchAfter: 24*3600

})

store.on("error", ()=>{
    console.log("ERROR in MONGO SRORE",err);
});

const sessionOption = {
    store,
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};



app.use(session(sessionOption));
app.use(flash());

//passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
})

/*app.get("/demoUser",async(req,res)=>{
    
    let fakeUser= new User({
        email:"student@gmail.com",
        username:"delta-student"
    })

    let user1 = await User.register(fakeUser,"helloworld");
    
    res.send(user1);
})
*/

app.get("/", (req, res) => {
    res.send("This is the world of wanderlust")
})

app.use("/listing", listingRouter)

app.use("/listing/:id/reviews", reviewsRouter)

app.use("/", userRouter)

app.all("/*any", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "something went wrong!" } = err;
    res.render("listing/error.ejs", { err });
    // res.status(statusCode).send(message);
})


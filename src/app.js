//path is a native tool in the node.js APIs
const path = require("path");
//express expose a single function and not an object literal as in the notes example
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");
//call the express function exposed by the express module
const app = express();
//get the port value environment variable set by Heroku (this can be set by the Docker container run command) for our app or default 3000 if not exist (work locally)
//process is an object provided by NodeJS to access the current process variables similar to document in the Browser Env.
const port = process.env.PORT || 3000;
// Define paths for Express config
//__driname returns a path to the directory of the current script in a cross-platform way
//__filename returns the path to the current script file
//these variables are provided by the wrapper function that wrap our script in the browser
//// __dirname and __filename like other globals provided by NodeJS (e.g module) when it wraps our code by a IIFE function

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
//need to install hbs library: npm i hbs
// handlebars is a low level library that allows to implement templating in JS. HBS is plugin to Express that allows to integrate handlebars
// Setting hbs as the default view engine for Express
//handlebars pages need to be located in the 'views' folder (but can be changed using app.set('views', viewspath),
// visit https://expressjs.com/en/api.html#app.set for express configuration
app.set("view engine", "hbs");
//change the default hbs repository from views to /templates/views
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve. no need to setup route for the pages in this directory
//configure express to serve up an entire directory (public) of static assets (HTML, JS, images, CSS...).
// Express assumes that this directory has an index.html file that will be served in case of a Get request on the
// root application URL. Express infers the type of the file (MIME Type) from the file extension
//You can call static() multiple times to serve multiple directories. If a file cannot be found by one middleware
// function then it will simply be passed on to the subsequent middleware (the order that middleware is called is
// based on your declaration order).
//app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
//You can also create a virtual prefix for your static URLs, rather than having the files added to the base URL.
// For example, here we specify a mount path so that the files are loaded with the prefix "/media": app.use('/media', express.static('public'));
app.use(express.static(publicDirectoryPath));

//hbs renderer convert the index.hbs into HTML page. the params passed here will be accessible in the index.hbs page
//Each route can have one or more handler functions, which are executed when the route is matched. app.METHOD(PATH, HANDLER)
//this can be used to send a response (JSON) to either to another app or HTML to a browser client
//this response will be sent for the default route URI localhost:3000
//now this route is overwritten by the directory serving in the precedent statement (if there is an Index page there),
// so if we move this up then it will be shown for default URI
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Emaginer",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Emaginer",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Emaginer",
  });
});

app.get("/weather", (req, res) => {
  //using Object destructuring syntax, see page 264 in JS book. this is similar to let address = req.query.address (dubai is the default value)
  //use URL: http://localhost:3000/weather?address=dubai
  //provide default value to address (the destructured object property)
  let { address = "dubai" } = req.query;
  //to debug use command; node inspect src/app.js and then open chrome and type:  chrome://inspect, add the app folder to the Browser working directory.
  // this will allow the Node.js app to run in the Browser as any client side JS script
  debugger;
  if (typeof address === "string") {
    forecast(address)
      .then((response) => {
        debugger;
        console.log("inside then of app.js" + response);
        return res.send(response);
        //calling then() with no handler function (here error handler there is only onResolved handler) act as passthrough.
        // so here the then() will receive a rejected Promise from the async function (because throwing an error from async function will return instead a rejected Promise)
        // and since then() is not defining an onRejected handler, so it will act as passthrough of the same error as the original Promise (generated from the forecast method).
        // this rejected Promise is then caught by the catch handler of the returned Promise from the then() as follows:
        //let p1 = forecast(address).then();
        //p1.catch((e)=>{})
      })
      .catch((errorcode) => {
        console.log("inside catch of app.js" + errorcode);
        return res.send(errorcode);
      });

    //can be rewritten as follows:
    // let p = forecast(address);
    // p.then((response) => {
    //     console.log('inside then of app.js' + response);
    //     return res.send(response);
    // })
    // p.catch((errorcode) => {
    //     console.log('inside catch of app.js' + errorcode);
    //     return res.send(errorcode);
    // })
    //or as follows using then(onResovledhandler, onErrorhandler)
    // forecast(address).then(
    //     (response) => {
    //         debugger
    //         console.log('inside then of app.js'+response);
    //         return res.send(response);
    //     }
    //     ,
    //     (errorcode)=>{
    //         console.log('inside catch of app.js'+errorcode);
    //         return res.send(errorcode);
    //
    //     })
  }
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Emaginer",
    errorMessage: "Help article not found.",
  });
});
//should be the last route for error page
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Emaginer",
    errorMessage: "Page not found.",
  });
});
//listen is an asych method so the arrow function is a callback after the server is up
app.listen(port, () => {
  console.log("Server is up on port ." + port);
});

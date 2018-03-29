// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

app.use(express.static("public"));

// Database configuration
var databaseUrl = process.env.MONGODB_URI || "mongodb://localhost/scraper";;
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function (req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function (error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});


app.get("/save-note/:id", function (req, res) {

  //update the document with a certain id and set saved to true
  db.scrapedData.update({
    "_id": mongojs.ObjectId(req.params.id)
  }, {
    // Set the title, note and modified parameters
    // sent in the req's body.
    $set: {
      "saved": true
    }
  }, function(error, edited) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.json(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(edited);
      res.json({ status : 200 });
    }

  });
  
});
// app.get("/name", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything,
//   // but this time, sort it by name (1 means ascending order)
//   db.scrapedData.find().sort({ name: 1 }, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
// });

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
  // Make a request for the news section of ycombinator
  request("https://www.cbr.com/category/comics/reviews", function (error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".full-thumb").each(function (i, element) {

      // var title = $(element).children("a").eq(0).text()
      var title = $(element).children(".info-wrapper").children(".title").children("a").text();
      var photo = $(element).children(".img-wrapper").children("a").children(".img_cover_list").children("picture").children("source").attr("srcset");
      var link = $(element).children(".img-wrapper").children("a").attr("href");
      var details = $(element).children(".info-wrapper").children(".details").children(".rel-date").text();

      // console.log(title)
      // console.log(photo)
      // console.log(link)
      // console.log(details)

      if (title && link && photo && details) {
        // //   /Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          link: "link",
          photo: photo,
          details: details
        },

          function (err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(title, link, photo, details, inserted);
            }
          });
      }
    });
  });
  res.send("Scrape Complete");

});



var port = process.env.PORT || 3011;

// Listen on port 3000
app.listen(port, function () {
  console.log("App running on port 3011!");
});




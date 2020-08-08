const express = require("express");
const dotenv = require("dotenv")
const mongodb = require("mongodb")
const uri = process.env.DATABASE_URI

const app = express();
dotenv.config()
app.use(express.json());

app.get("/", function (request, response) {
    const client = new mongodb.MongoClient(uri);
  
    client.connect(function () {
      response.send("It worked!");
      client.close();
    });
  });

//   app.post("/films", function (request, response) {
//     const client = new mongodb.MongoClient(uri);
  
//     client.connect(function () {
//       const db = client.db("cinema");
//       const collection = db.collection("films");
  
//       const film = {
//         title: "10 Things I Hate About You",
//         year: 1999,
//         actors: ["Heath Ledger, Julia Stiles, Joseph Gordon-Levitt"],
//       };
  
//       collection.insertOne(film, function (error, result) {
//         response.send(error || result.ops[0]);
//         client.close();
//       });
//     });
//   });

app.post("/films", function (request, response) {
    const client = new mongodb.MongoClient(uri);
  
    client.connect(function () {
      const db = client.db("mongo-week3");
      const collection = db.collection("movies");
        const newObject = {}

        if (request.query.title){
            newObject.title = request.query.title
        }
        if (request.query.year){
            newObject.year = Number(request.query.year)
        }
        if (request.query.actors){
            newObject.actors = (request.query.actors).split(",")
        }
    
      collection.insertOne(newObject, function (error, result) {
        response.send(error || result.ops[0]);
        client.close();
      });
    });
  });

  app.get("/filmsbyactor", function(request, response){
    const client = new mongodb.MongoClient(uri);

    client.connect(function(){
      const db = client.db("mongo-week3")
      const collection = db.collection("movies")

      const {actors} = request.query
      const searchObject = {cast: actors}

      collection.find(searchObject).toArray(function(error, result) {
        if (error) {
            response.status(500).send(error)
        } else {
            response.send(result)
        }
      })
    })
  })

  app.get("/filmsbyyear", function(request, response){
    const client = new mongodb.MongoClient(uri);

    client.connect(function(){
      const db = client.db("mongo-week3")
      const collection = db.collection("movies")

      const {year} = Number(request.query)
      const searchObject = {year: year}

      collection.find(searchObject).toArray(function(error, result) {
        if (error) {
            response.status(500).send(error)
        } else {
            response.send(result)
        }
      })
    })
  })

  app.get("/search", function(request, response){
    const client = new mongodb.MongoClient(uri);

    client.connect(function(){
      const db = client.db("mongo-week3")
      const collection = db.collection("movies")

      const searchObject = {}

      if (request.query.actors) {
        searchObject["cast"] = request.query.actors
      }
      if (request.query.year) {
        searchObject["year"] = Number(request.query.year)
      }

      if(request.query.minscore){
        searchObject["metacritic"] = { $gt: Number(request.query.minscore)} 
      }

      if(request.query.maxscore){
        searchObject["metacritic"] = { $lt: Number(request.query.maxscore)}
      }

      console.log(request.query)
      collection.find(searchObject).toArray(function(error, result) {
        if (error) {
            response.status(500).send(error)
        } else {
            response.send(result)
        }
      })
    })
  })

  app.delete("/films/:title", function (request, response) {
    const client = new mongodb.MongoClient(uri);
  
    client.connect(function () {
      const db = client.db("mongo-week3");
      const collection = db.collection("movies");
  
      const searchObject = { title: request.params.title };
  
      collection.deleteOne(searchObject, function (error, result) {
        if (error) {
          response.status(500).send(error);
        } else if (result.deletedCount) {
          response.sendStatus(204);
        } else {
          response.sendStatus(404);
        }
        client.close();
      });
    });
  });

app.listen(3000, () => {console.log("Listening!")});

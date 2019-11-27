"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let schemaGenres = {
    genreName: {
      type: String,
      unique: true,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}

let schemaGoods = {
    name: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      required: true
    },
    special_price: {
      type: String,
      required: false,
      default: null
    },
    price: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}

let schemaGenresGoods = {
    genreId: {
      type: String,
      required: true
    },
    goodsId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}

let schemaOrder = {
    nameUser: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    products: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}

let isDbConnected = false;
let dbUrl = "mongodb://localhost:27017/HIT";
let dbConnection = mongoose.createConnection(dbUrl);

dbConnection.on("error", (argument) => {
  isDbConnected = false;
  console.log("error");
})

dbConnection.on("open", (argument) => {
  isDbConnected = true;
  console.log("connected");
})

let genreObject = new Schema(schemaGenres)
let Genre = dbConnection.model("Genre", genreObject);

let goodsObject = new Schema(schemaGoods)
let Goods = dbConnection.model("Goods", goodsObject);

let genresGoodsObject = new Schema(schemaGenresGoods)
let GenresGoods = dbConnection.model("GenresGoods", genresGoodsObject);

let genresOrder = new Schema(schemaOrder)
let Order = dbConnection.model("Orders", genresOrder);

exports.getGood = function( req, res )
{
  Goods.findOne({'_id': req.params._id}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      res.status(200).json(result);
    }
  })
}

exports.getGoodsByGenre = function( req, res )
{
  let arr = [];
  GenresGoods.find({'genreId': req.params._id}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      result.forEach((element, index) => {
        Goods.findOne({'_id': element.goodsId}, (err1, result1) => {
          if(err){
            res.status(404).json({"error": "can't find in base " + err1});
          }else{
            arr.push(result1);
            if((result.length - 1) == index){
              res.status(200).json(arr);
            }
          }
        })
        console.log(index + " - " + element);
      });
    }
  })
}

exports.createOrder = function( req, res )
{
  console.log(req.body);
  let postOrder = new Order(req.body);
  postOrder.save((err, result) => {
    if(err){
      console.log("HERE");
      console.log(err);
      res.status(404).json({"error": "can't add to base " + err});
    }else{
      console.log("DONE");
      res.status(200).redirect('/Home');
    }
  })
}

exports.getOrder = function( req, res )
{
  Order.find((err, result) => {
    if(err){
      res.status(404).json({"error": "can't add to base " + err});
    }else{
      res.status(200).json(result);
    }
  })
}

exports.createGenre = function( req, res )
{
  let postGenre = new Genre(req.body);
  postGenre.save((err, result) => {
    if(err){
      res.status(404).json({"error": "can't add to base " + err});
    }else{
      res.status(200).redirect('/Admin');
    }
  })
}

exports.createGoodsGenre = function( req, res )
{
  let postGenresGoods = new GenresGoods(req.body);
  postGenresGoods.save((err, result) => {
    if(err){
      res.status(404).json({"error": "can't add to base " + err});
    }else{
      res.status(200).redirect('/Admin');
    }
  })
}

exports.createGoods = function( req, res )
{
  let postGoods = new Goods(req.body);
  postGoods.save((err, result) => {
    if(err){
      res.status(404).json({"error": "can't add to base " + err});
    }else{
      res.status(200).redirect('/Admin');
    }
  })
}

exports.getGenre = function( req, res )
{
  Genre.find({}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      res.status(200).json(result);
    }
  })
}

exports.getGoods = function( req, res )
{
  Goods.find({}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      res.status(200).json(result);
    }
  })
}


exports.getGoodsGenre = function( req, res )
{
  GenresGoods.find({}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      res.status(200).json(result);
    }
  })
}

exports.deleteGood = function( req, res )
{
  Goods.findOneAndDelete({'_id': req.params.id}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      GenresGoods.deleteMany({'goodsId': req.params.id}, (err, result) => {
        if(err){
          res.status(404).json({"error": "can't find in base " + err});
        }else{
        res.redirect('/Admin');
        }
      })
    }
  })
}


exports.deleteGoodsGenre = function( req, res )
{
  GenresGoods.findOneAndDelete({'_id': req.params.id}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
    res.redirect('/Admin');
    }
  })
}

exports.deleteGenre = function( req, res )
{
  Genre.findOneAndDelete({'_id': req.params.id}, (err, result) => {
    if(err){
      res.status(404).json({"error": "can't find in base " + err});
    }else{
      GenresGoods.deleteMany({'genreId': req.params.id}, (err, result) => {
        if(err){
          res.status(404).json({"error": "can't find in base " + err});
        }else{
        res.redirect('/Admin');
        }
      })
    }
  })
}

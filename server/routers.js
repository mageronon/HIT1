"use strict";

const controller = require( "./controllers.js" );

module.exports = function( app )
{
  app.route( "/createGenre" ).post(controller.createGenre);
  app.route( "/getGenre" ).get(controller.getGenre);
  app.route( "/createGoods" ).post(controller.createGoods);
  app.route( "/getGoods" ).get(controller.getGoods);
  app.route( "/createGoodsGenre" ).post(controller.createGoodsGenre);
  app.route( "/getGoodsGenre" ).get(controller.getGoodsGenre);


  app.route( "/getGood/:_id" ).get(controller.getGood);
  app.route( "/getGoodsByGenre/:_id" ).get(controller.getGoodsByGenre);
  app.route( "/AddOrder" ).post(controller.createOrder);
  app.route( "/GetOrder" ).get(controller.getOrder);

  app.route('/deleteGoodsGenre/:id').get(controller.deleteGoodsGenre);
  app.route('/deleteGenre/:id').get(controller.deleteGenre);
  app.route('/deleteGood/:id').get(controller.deleteGood);
}

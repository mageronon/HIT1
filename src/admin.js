let list = new Vue({
  el: '#List',
  data: {
    genres: {},
    goods: {},
    genres_goods: {},
    orders: {}
  }
})


window.onload = function () {
  $.ajax({
    url: "/getGenre",
    type: "GET",
    cache: false,
    success: function ( data ) {
      list.genres = data;
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: "/getGoods",
    type: "GET",
    cache: false,
    success: function ( data ) {
      list.goods = data;
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: "/getGoodsGenre",
    type: "GET",
    cache: false,
    success: function ( data ) {
      list.genres_goods = data;
    },
    error: function (error) {
      console.log(error);
    }
  });

  // $.ajax({
  //   url: "/getGood/5ddeba1f96bee33c84fa5a91",
  //   type: "GET",
  //   cache: false,
  //   success: function ( data ) {
  //     console.log(data);
  //   },
  //   error: function (error) {
  //     console.log(error);
  //   }
  // });
  //
  // $.ajax({
  //   url: "/getGoodsByGenre/5ddec5697da77e2a04594acd",
  //   type: "GET",
  //   cache: false,
  //   success: function ( data ) {
  //     console.log(data);
  //   },
  //   error: function (error) {
  //     console.log(error);
  //   }
  // });

  $.ajax({
    url: "/getOrder",
    type: "GET",
    cache: false,
    success: function ( data ) {
      list.orders = data;
    },
    error: function (error) {
      console.log(error);
    }
  });
}

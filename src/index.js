import './scss/main.scss';
import $ from "jquery";

console.log("Hellos From webpack");
console.log(`The time is ${new Date()}`);

var goods_list = [];
var buy = [];
var mymodalGoods = new Vue({
  el: '#modalGoods',
  data: {
    goods: {}
  },
  methods: {
    addToTrash(goods){
      if(buy.includes(goods)){
        for (var index in buy) {
          if (buy[index]._id == goods._id) {
            buy[index].count += 1;
          }
        }
      }else {
        goods.count = 1;
        buy.push(goods);
      }
      count_of_shop_items.recount();
      myModal.calculate();
    },
  }
});

var listCategoryApi = new Vue({
  el: '#goodsAPI',
  data: {
    goods_list: [],
    category_list: [],
    goods_by_category: [],
  },
  methods: {
    open(goods){
      modalGoods.style.display = "block";
      mymodalGoods.goods = goods;
      //перегляд інформації про товар, де <product_id> - ID товару
      $.ajax({
        url: "/getGood/" + goods._id,
        type: "GET",
        cache: false,
        success: function ( data ) {
          console.log(data);
        }
      });

    }
  },
  created(){
    $.ajax({
      url: "/getGoods",
      type: "GET",
      cache: false,
      success: function ( data ) {
        listCategoryApi.goods_list = data;
      }
    });

    $.ajax({
      url: "/getGenre",
      type: "GET",
      cache: false,
      success: function ( data ) {
        listCategoryApi.category_list = data;
        for (var item in data) {
          //перегляд усіх товарів з категорії, де ID дорівнює <category_id>
          $.ajax({
            url: "/getGoodsByGenre/" + data[item]._id,
            type: "GET",
            cache: false,
            success: function ( data1 ) {
              var _id = this.url.split('/')[2].split('?')[0];
              listCategoryApi.goods_by_category.push({"_id" : _id, "data": data1});
            }
          });
        }
      }
    });
  }
});

//перегляд доступних категорій

//перегляд інформації про категорію, де <category_id> - ID категорії
// $.ajax({
//   url: "https://nit.tron.net.ua/api/category/<category_id>",
//   type: "GET",
//   cache: false,
//   success: function ( data1 ) {
//     console.log(data1);
//     listCategoryApi.goods_by_category[data[item].id] = data1;
//   }
// });
//перегляд усіх товарів


var count_of_shop_items = new Vue({
  el: '#count_of_shop_items',
  data: {
    buy: buy,
    counter: 0
  },
  methods: {
    recount() {
      var count = 0;
      for (var item in buy) {
        count += buy[item].count;
      }
      this.counter = count;
    }
  }
})

var myModal = new Vue({
  el: '#myModal',
  data: {
    buy: buy,
    totalPrice: "0 грн"
  },
  methods: {
    calculate() {
      var count = 0.;
      for (var item in buy) {
        if(buy[item].special_price != null){
          count += buy[item].count * parseFloat(remove_linebreaks(buy[item].special_price));
        }else {
          count += buy[item].count * parseFloat(remove_linebreaks(buy[item].price));
        }
      }
      this.totalPrice = formatNum(count.toFixed(2)) + " грн";
    },
    addOne(index) {
      buy[index].count += 1;
      count_of_shop_items.recount();
      this.calculate();
    },
    minusOne(index) {
      if(buy[index].count > 1){
        buy[index].count -= 1;
        count_of_shop_items.recount();
        this.calculate();
      }else{
        if (index > -1){
          buy[index].count = 0;
          buy.splice(index, 1);
          count_of_shop_items.recount();
          this.calculate();
        }
      }
    },
    clearAll() {
      if(document.getElementById('exampleInputEmail1').value == ""){
        alert("Enter email");
        return ;
      }
      if(document.getElementById('name').value == ""){
        alert("Enter name");
        return ;
      }
      if(document.getElementById('phone').value == ""){
        alert("Enter phone");
        return ;
      }
      var order = {};
      for (var index in buy) {
        order[buy[index]._id] = buy[index].count
      }
      // add order

      $.ajax({
        url: "/AddOrder",
        type: "POST",
        data: {
          nameUser : document.getElementById('name').value,
          phone: document.getElementById('phone').value,
          email: document.getElementById('exampleInputEmail1').value,
          ord: order,
          products: JSON.stringify(order)
        },
        cache: false,
        success: function ( data ) {
          for (var index in buy) {
            buy[index].count = 0;
          }
          document.getElementById('exampleInputEmail1').value == "";
          document.getElementById('name').value == "";
          document.getElementById('phone').value == "";
          for (var index in count_of_shop_items.buy) {
            count_of_shop_items.buy[index].count = 0;
          }
          for (var index in count_of_shop_items.buy) {
            count_of_shop_items.buy[index].count = 0;
          }
          buy=[];
          count_of_shop_items.buy=buy;
          myModal.buy=buy;
          count_of_shop_items.recount();
          alert("Order send");
        },
        error: function (error) {
          console.log(error);
        }
      });


      // $.post('/AddOrder',
      //   {
      //     name : document.getElementById('name').value,
      //     phone: document.getElementById('phone').value,
      //     email: document.getElementById('exampleInputEmail1').value,
      //     products: order
      //   },
      //     function(data, status){
      //       buy=[];
      //       for (var index in buy) {
      //         buy[index].count = 0;
      //       }
      //       document.getElementById('exampleInputEmail1').value == "";
      //       document.getElementById('name').value == "";
      //       document.getElementById('phone').value == "";
      //       for (var index in count_of_shop_items.buy) {
      //         count_of_shop_items.buy[index].count = 0;
      //       }
      //       for (var index in count_of_shop_items.buy) {
      //         count_of_shop_items.buy[index].count = 0;
      //       }
      //       count_of_shop_items.buy=buy;
      //       myModal.buy=[];
      //       count_of_shop_items.recount();
      //       alert("Order send");
      // });
    }
  }
})

function remove_linebreaks( str ) {
    return str.replace( /[ ]+/gm, "" );
}

function formatNum(number)
{
   var newNum = "";
   var oldNumStr = number + "";
   var done = 0;
   var parts = oldNumStr.split(".");
   var newPart1 = "";
   var newPart2 = parts[1];
   for(var j= parts[0].length -1 ;j >= 0;j--)
   {
       newNum = parts[0][j] + newNum;
       done++;
       if((done%3) == 0)
          newNum = " " + newNum;
   }
   newNum = (newPart2)? (newNum + ", " + newPart2) : newNum + ",00" ;
   return newNum;
}


// Get the modal
var modal = document.getElementById("myModal");
var modalGoods = document.getElementById("modalGoods");

// Get the button that opens the modal
var btn = document.getElementById("open_trash");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  modalGoods.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modalGoods) {
    modalGoods.style.display = "none";
  }
}

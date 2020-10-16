var express = require('express');
var router = express.Router();
var sqlLite = require("sqlite3").verbose();

/* GET home page. */
var db = new sqlLite.Database("goods.db");
db.run('CREATE TABLE IF NOT EXISTS `tbl_goods`' +
    '(' +
    '`id` INTEGER PRIMARY KEY AUTOINCREMENT ,'+
    '`OrderNumber` TEXT NOT NULL,'+
    '`Quantity` INT NOT NULL,'+
    '`Description` TEXT NOT NULL,'+
    '`DateReceived` Date NOT NULL'+
    ')',function (error)
{
  if(error)
  {
    console.error(error.message);
  }
});
db.close();

router.get('/', function(req, res, next)
{
  var arr = null;
  var db = new sqlLite.Database("goods.db");
  db.all('SELECT * FROM tbl_goods', function(error, items)
  {
    if (error)
    {
      throw error;
    }
    arr = items;
    res.render('index', { title: 'Item', q_label: 'Quantity', descrpt: 'Description', orderNo: 'Order Number', date: 'Date Received', data: arr });
  });
});

router.post('/index',  function(req, res)
{

  var params =
  [
    req.body.order_no,
    req.body.quantity,
    req.body.descript,
    req.body.dateReceived,
  ];

  var db = new sqlLite.Database("goods.db");
  var sql = "INSERT INTO `tbl_goods` (`OrderNumber`, `Quantity`, `Description`, `DateReceived`) values (?, ?, ?, ?)";
  var stmt = db.prepare(sql);

  db.serialize(function()
  {
    stmt.run(params);
    stmt.finalize();
  });
  var arr = null;
  db.all('SELECT * FROM tbl_goods', function(error, items)
  {
    if (error)
    {
      throw error;
    }
    arr = items;
    res.render('index', { title: 'Item', q_label: 'Quantity', descrpt: 'Description', orderNo: 'Order Number', date: 'Date Received', data: arr });
  });

});

module.exports = router;

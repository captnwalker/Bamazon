// Required Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
require('console.table');

// Connection script
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Username
  user: "root",

  // Credentials
  password: "*****",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  connection.end();
});
// End connection script
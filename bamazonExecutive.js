// TEMPLATE FOR EXECUTIVE PAGE (Will produce table output)
// Required Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
var Table = require('cli-table');

// Connection script
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Username
  user: "root",

  // Credentials
  password: "*******",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(colors.cyan("...you are now connected to the bamazon database as id " + connection.threadId));
  //connection.end();

  bamazon();      //Call main function

});                 // End Connection Script

// BEGIN Display Inventory
function bamazon() {
  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;

    // Cli-Table display code with color
    var table = new Table(
      {
        head: ["Product ID".cyan.bold, "Product Name".cyan.bold, "Department Name".cyan.bold, "Price".cyan.bold, "Quantity".cyan.bold],
        colWidths: [12, 75, 20, 12, 12],
      });

    // Set/Style table headings and Loop through entire inventory
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
      );
    }

    console.log(table.toString());
    //END Display Inventory

    //Prompt Customers Input
    inquirer.prompt([
      {
        type: "number",
        message: "Which item would you like to buy? (Please enter the Product ID)".yellow,
        name: "id"
      },
      {
        type: "number",
        message: "How many would you like to buy?".yellow,
        name: "quantity"
      },
    ])

  })
};
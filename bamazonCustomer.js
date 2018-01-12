// Required Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
require('console.table');
var Table = require('cli-table');

// Connection script
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Username
  user: "root",

  // Credentials
  password: "pebbles1",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  connection.end();
});
// End Connection Script

function bamazon() {
	connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        
        // Cli-Table display code with color
		var table = new Table(
            {
			head: ["Product ID".blue, "Product Name".blue, "Department Name".blue, "Price".blue, "Quantity".blue],
			colWidths: [13, 60, 20, 13, 13],
		});
		
		for(var i = 0; i < res.length; i++) {
			table.push(
			    [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
			);
		}
		
		console.log(table.toString());

        // Prompt Buyers Input
		inquirer.prompt([
			{
				type: "number",
				message: "Which item would you like to purchase? (Please use the Product ID)",
				name: "itemNumber"
			},
			{
				type: "number",
				message: "How many would you like to buy?",
				name: "howMany"
			},
		]).then(function (buyer) {

        });
    });
}

bamazon();




inquirer.prompt([

    // Here we create a basic text prompt.
    {
        type: "input",
        message: "What is the item you would like to buy?",
        name: "id"
    },

     {
        type: "input",
        message: "How many would you like to buy?",
        name: "quantity"
    }
])

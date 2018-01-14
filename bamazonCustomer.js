// Required Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require('prompt');
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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //connection.end();
    
    bamazon();      //Call main function

});     // End Connection Script

//BEGIN Display Inventory
function bamazon() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        // Cli-Table display code with color
        var table = new Table(
            {
                head: ["Product ID".blue.bgYellow.bold, "Product Name".cyan, "Department Name".cyan, "price".cyan, "Quantity".cyan],
                colWidths: [12, 75, 20, 12, 12],
            });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }

        console.log(table.toString());
//END Display Inventory
        

        //Prompt Buyers Input
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
///////////////////////////////////////////////////////////////////////////////////////////////////////

.then(function (order) {
    // If we log that order as a JSON, we can see how it looks.
    //console.log(JSON.stringify(order, null, 2));
          var quantity = order.quantity;
          var itemId = order.id;
          connection.query('SELECT * FROM products WHERE id=' + itemId, function(err, selectedItem) {
              if (err) throw err;
               if (selectedItem[0].stock_quantity - quantity >= 0) {
                    console.log("Bamazon's Inventory has enough of that item (".green + selectedItem[0].product_name.green + ")!".green);
                    console.log("Quantity in Stock: ".green + selectedItem[0].stock_quantity + " Order Quantity: ".green + quantity);
                    console.log("You will be charged ".green + (order.quantity * selectedItem[0].price).toFixed(2) +  " dollars.  Thank you for shopping at Bamazon.".green);


                    //  This is the code to remove the item from inventory.
                    // Some code from the mysql NPM readme: connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], function(err, results) {});
                    connection.query('UPDATE products SET stock_quantity=? WHERE id=?', [selectedItem[0].stock_quantity - quantity, itemId],
                    function(err, inventory) {
                        if (err) throw err;
                         // Runs the prompt again, so the user can keep shopping.
                         bamazon();
                    });  // Ends the code to remove item from inventory.
                    

               }

               else {
                    console.log("Insufficient quantity.  Please order less of that item, as Bamazon only has ".red + selectedItem[0].stock_quantity + " " + selectedItem[0].product_name.red + " in stock at this moment. Please make another selection or reduce your quantity.".red);
                    bamazon();
                    
                    
               }
          });
});
});
}

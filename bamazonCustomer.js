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

        // Cli-Table display code with Color
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

            // Ordering function
            .then(function (order) {

                var quantity = order.quantity;
                var itemId = order.id;

                connection.query('SELECT * FROM products WHERE id=' + itemId, function (err, selectedItem) {
                    if (err) throw err;

                    // Varify item quantity desired is in inventory
                    if (selectedItem[0].stock_quantity - quantity >= 0) {
                        console.log("Bamazon's Inventory has enough of that item (".green + selectedItem[0].product_name.yellow + ")!".green);

                        console.log("Quantity in Stock: ".green + selectedItem[0].stock_quantity + " Order Quantity: ".green + quantity.yellow);

                        // Calculate total sale, and fix 2 decimal places
                        console.log("You will be charged ".green + (order.quantity * selectedItem[0].price).toFixed(2).yellow + " dollars.".green, "Thank you for shopping at Bamazon!".magenta);

                        // Query to remove the purchased item from inventory.                       
                        connection.query('UPDATE products SET stock_quantity=? WHERE id=?', [selectedItem[0].stock_quantity - quantity, itemId],

                            function (err, inventory) {
                                if (err) throw err;

                                bamazon();  // Runs the prompt again, so the customer can continue shopping.
                            });  // Ends the code to remove item from inventory.

                    }
                    // Low inventory warning
                    else {
                        console.log("Insufficient quantity. As Bamazon only has ".red + selectedItem[0].stock_quantity + " " + selectedItem[0].product_name.cyan + " in stock at this moment. \nPlease make another selection or reduce your quantity.".red);

                        bamazon();  // Runs the prompt again, so the customer can continue shopping.
                    }
                });
            });
    });
}   // Closes bamazon function


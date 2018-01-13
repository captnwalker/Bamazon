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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.end();
});
// End Connection Script

//BEGIN Display Inventory
function bamazon() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        // Cli-Table display code with color
        var table = new Table(
            {
                head: ["Product ID".red.bgYellow.bold, "Product Name".blue, "Department Name".blue, "Price".blue, "Quantity".blue],
                colWidths: [12, 75, 20, 12, 12],
            });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }

        console.log(table.toString());
//END Display Inventory
        

        // Prompt Buyers Input
        inquirer.prompt([
            {
                type: "number",
                message: "Which item would you like to purchase? (Please enter the Product ID)",
                name: "id"
            },
            {
                type: "number",
                message: "How many would you like to buy?",
                name: "howMany"
            },
        ]).then(function (user) {

            process.on('unhandledRejection', (reason, p) => {
                console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
                // application specific logging, throwing an error, or other logic here
              });

            connection.query('SELECT * FROM products WHERE id =' + id,function(err, res) {
                if (err) throw err;

                if (res[user.id - 1].stock_quantity > user.howMany) {
                    var newQuantity = parseInt(res[user.id - 1].stock_quantity) - parseInt(user.howMany);
                    var total = parseFloat(user.howMany) * parseFloat(res[user.id - 1].Price);
                    total = total.toFixed(2);

                    var departmentTotal = parseFloat(total) + parseFloat(res[user.id - 1].TotalSales);
                    departmentTotal = departmentTotal.toFixed(2);

                    connection.query("UPDATE departments SET ? WHERE ?", [{
                        TotalSales: departmentTotal
                    }, {
                        department_name: res[user.id - 1].department_name
                    }], function (error, results) { });

                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQuantity
                    }, {
                        itemID: user.id
                    }], function (error, results) {
                        if (error) throw error;

                        console.log("Your order for " + user.howMany + " " + res[user.id - 1].product_name +
                            "(s) has been placed.");
                        console.log("Your total is $" + total);
                        orderMore();
                    });

                } else {
                    console.log("We're sorry, we only have " + res[user.id - 1].stock_quantity + " of that product.");
                    orderMore();
                }
            });
        });
    });
}

function orderMore() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to order anything else?",
            name: "again"
        },
    ]).then(function (user) {
        if (user.again) {
            selection();
        } else {
            exit();
        }
    });
}

function exit() {
    connection.end();
    console.log("Have a great day!");
}

bamazon();




// inquirer.prompt([

//     // Here we create a basic text prompt.
//     {
//         type: "input",
//         message: "What is the item you would like to buy?",
//         name: "id"
//     },

//      {
//         type: "input",
//         message: "How many would you like to buy?",
//         name: "quantity"
//     }
// ])

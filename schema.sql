-- Drops the db bamazon if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon --
CREATE TABLE products (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT(11) NOT NULL AUTO_INCREMENT,

  -- Makes a string column called "products" which cannot contain null --
  product_name VARCHAR(100) NOT NULL,
  
  -- Makes a string column called "department_name" which cannot contain null --
  department_name VARCHAR(45) DEFAULT NULL,
  
  -- Makes an numeric column called "price" --
  price DECIMAL(10,2) DEFAULT NULL,
  
   -- Makes an numeric column called "stock_quantity" --
  stock_quantity INT(100) DEFAULT NULL,
  
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (id)
);

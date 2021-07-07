module.exports = (app) => {
    const products = require("../controllers/product.controller.js");

    // Create a new product
    app.post("/products", products.create);

    // Create a new product from an array
    app.post(
        "/products/:productName/:productContent/:productPrice/:productStatus",
        products.createFromArray
    );

    // Retrieve all products
    app.get("/products", products.findAll);

    // Retrieve products from selected ranges
    app.get("/products/:min/:max", products.findByPriceRange);

    // Retrieve products with a specific status
    app.get("/product/status/:stat", products.findByStatus);

    // Retrieve a single product with productId
    app.get("/products/:productId", products.findOne);

    // Update a product with productId
    app.put("/products/:productId", products.update);

    // Delete a product with productId
    app.delete("/products/:productId", products.delete);
};
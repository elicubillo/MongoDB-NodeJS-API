const Product = require("../models/product.model.js");

// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Product name can not be empty",
        });
    }

    // Create a Product
    const product = new Product({
        name: req.body.name,
        content: req.body.description,
        price: req.body.price,
        status: req.body.status,
    });

    // Save Product in the database
    product
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Product.",
            });
        });
};

// Create and Save a new Product from an array
exports.createFromArray = (req, res) => {
    // Validate request
    if (!req.params.productName) {
        return res.status(400).send({
            message: "Product name can not be empty",
        });
    }

    // Create a Product
    const product = new Product({
        name: req.params.productName,
        content: req.params.productContent,
        price: req.params.productPrice,
        status: req.params.productStatus,
    });

    // Save Product in the database
    product
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Product.",
            });
        });
};

// Retrieve and return all products from the database.
exports.findAll = (req, res) => {
    Product.find()
        .then((products) => {
            res.send(products);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products.",
            });
        });
};

// Retrieve products from selected ranges
exports.findByPriceRange = (req, res) => {
    Product.find({
            price: { $gte: req.params.min, $lte: req.params.max },
        })
        .then((products) => {
            if (!products) {
                return res.status(404).send({
                    message: "No products within that price range " +
                        req.params.min +
                        "-" +
                        req.params.min,
                });
            }
            res.send(products);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products.",
            });
        });
};

// Retrieve products with a specific status
exports.findByStatus = (req, res) => {
    Product.find({
            $text: { $search: req.params.stat },
        })
        .then((products) => {
            if (!products) {
                return res.status(404).send({
                    message: "No products found",
                });
            }
            res.send(products);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products.",
            });
        });
};

// Find a single product with a productId
exports.findOne = (req, res) => {
    Product.findById(req.params.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId,
                });
            }
            res.send(product);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId,
                });
            }
            return res.status(500).send({
                message: "Error retrieving product with id " + req.params.productId,
            });
        });
};

// Update a product identified by the productId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Product name can not be empty",
        });
    }

    // Find product and update it with the request body
    Product.findByIdAndUpdate(
            req.params.productId, {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                status: req.body.status,
            }, { new: true }
        )
        .then((product) => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId,
                });
            }
            res.send(product);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId,
                });
            }
            return res.status(500).send({
                message: "Error updating product with id " + req.params.productId,
            });
        });
};

// Delete a product with the specified productId in the request
exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId,
                });
            }
            res.send({ message: "Product deleted successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId,
                });
            }
            return res.status(500).send({
                message: "Could not delete product with id " + req.params.productId,
            });
        });
};
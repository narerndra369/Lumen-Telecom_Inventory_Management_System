const { Router } = require("express");
const managerMiddleware = require("../middlewares/managerMiddleware");
const pool = require("../db");

const router = Router();


router.get('/products', managerMiddleware, async (req, res) => {
    try {
        const products = await pool.query(`SELECT * FROM products`);
        res.json({ products: products.rows });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

router.put('/products/:id', managerMiddleware, async (req, res) => {
    const productId = req.params.id;
    const { name, category, stockLevel, reorderPoint } = req.body;

    try {
        const updatedProduct = await pool.query(
            `UPDATE products SET name = $1, category = $2, stock_level = $3, reorder_point = $4 WHERE id = $5 RETURNING *`,
            [name, category, stockLevel, reorderPoint, productId]
        );

        res.json({ message: 'Product updated successfully', product: updatedProduct.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});


router.post('/products/:id/stock', managerMiddleware, async (req, res) => {
    const productId = req.params.id;
    const { transactionType, quantity } = req.body;

    try {
        const product = await pool.query(`SELECT stock_level FROM products WHERE id = $1`, [productId]);

        let newStockLevel = product.rows[0].stock_level;
        if (transactionType === "in") {
            newStockLevel += quantity;
        } else if (transactionType === "out") {
            if (newStockLevel < quantity) {
                return res.status(400).json({ message: "Not enough stock" });
            }
            newStockLevel -= quantity;
        }

        await pool.query(`UPDATE products SET stock_level = $1 WHERE id = $2`, [newStockLevel, productId]);

        res.json({ message: 'Stock transaction recorded', stockLevel: newStockLevel });
    } catch (error) {
        res.status(500).json({ message: "Error recording stock transaction", error: error.message });
    }
});

module.exports = router;

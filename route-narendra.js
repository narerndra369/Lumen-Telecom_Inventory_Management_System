const express = require('express');
const router = express.Router();

// Users Routes
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/users/:username', async (req, res) => {
    const { username } = req.params;
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET email = $1, password = $2, role = $3 WHERE username = $4 RETURNING *',
            [email, password, role, username]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE username = $1 RETURNING *', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Products Routes
router.post('/add-product', async (req, res) => {
    const { name, category_id, description, price, stock_level, render_point } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO products (name, category_id, description, price, stock_level, render_point, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
            [name, category_id, description, price, stock_level, render_point]
        );
        res.status(201).json({
            message: 'Product added successfully',
            product: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product' });
    }
});

router.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.status(200).json({
            message: 'Products retrieved successfully',
            products: result.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products' });
    }
});

router.put('/update-product/:products_id', async (req, res) => {
    const { products_id } = req.params;
    const { name, category_id, description, price, stock_level, render_point } = req.body;

    try {
        const checkProduct = await pool.query('SELECT * FROM products WHERE products_id = $1', [products_id]);
        if (checkProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const result = await pool.query(
            `UPDATE products 
             SET name = $1, category_id = $2, description = $3, price = $4, stock_level = $5, render_point = $6, updated_at = NOW() 
             WHERE products_id = $7 RETURNING *`,
            [name, category_id, description, price, stock_level, render_point, products_id]
        );

        res.status(200).json({
            message: 'Product updated successfully',
            product: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});

router.delete('/delete-product/:products_id', async (req, res) => {
    const { products_id } = req.params;

    try {
        const result = await pool.query('DELETE FROM products WHERE products_id = $1 RETURNING *', [products_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            product: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Suppliers Routes
router.get('/suppliers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers');
        res.status(200).json({
            message: 'Suppliers retrieved successfully',
            suppliers: result.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving suppliers' });
    }
});

router.put('/update-supplier/:supplier_id', async (req, res) => {
    const { supplier_id } = req.params;
    const { name, contact_name, contact_email, contact_phone, address } = req.body;

    try {
        const checkSupplier = await pool.query('SELECT * FROM suppliers WHERE supplier_id = $1', [supplier_id]);
        if (checkSupplier.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const result = await pool.query(
            `UPDATE suppliers
             SET name = $1, contact_name = $2, contact_email = $3, contact_phone = $4, address = $5, updated_at = NOW()
             WHERE supplier_id = $6 RETURNING *`,
            [name, contact_name, contact_email, contact_phone, address, supplier_id]
        );

        res.status(200).json({
            message: 'Supplier updated successfully',
            supplier: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating supplier' });
    }
});

router.delete('/delete-supplier/:supplier_id', async (req, res) => {
    const { supplier_id } = req.params;

    try {
        const result = await pool.query('DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *', [supplier_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({
            message: 'Supplier deleted successfully',
            supplier: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting supplier' });
    }
});


// Categories Routes
router.post('/products-filter', async (req, res) => {
    const { category_id } = req.body; 

    if (!category_id) {
        return res.status(400).json({ error: 'category_id is required' });
    }

    try {
        const result = await req.pool.query(
            'SELECT * FROM products WHERE category_id = $1',[category_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No products found for the given category_id' });
        }

        res.status(200).json(result.rows); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});

// Search Products by Name
router.get('/products/search', async (req, res) => {
    const { name } = req.query; 

    if (!name) {
        return res.status(400).json({ error: 'Product name is required' });
    }

    try {
        const result = await req.pool.query(
            'SELECT * FROM products WHERE LOWER(name) LIKE LOWER($1)',
            [`%${name}%`] 
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No products found with the given name' });
        }

        res.status(200).json(result.rows); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});



module.exports = router;

const { Router } = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const pool = require("../db");

const router = Router();


router.post('/suppliers', adminMiddleware, async (req, res) => {
    const { name, contactInfo } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO suppliers (name, contact_info) VALUES ($1, $2) RETURNING id`,
            [name, contactInfo || "N/A"]
        );

        res.json({ message: 'Supplier added successfully', supplierId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ message: "Error adding supplier", error: error.message });
    }
});


router.put('/suppliers/:id', adminMiddleware, async (req, res) => {
    const supplierId = req.params.id;
    const { name, contactInfo } = req.body;

    try {
        const updatedSupplier = await pool.query(
            `UPDATE suppliers SET name = $1, contact_info = $2 WHERE id = $3 RETURNING *`,
            [name, contactInfo, supplierId]
        );

        res.json({ message: 'Supplier updated successfully', supplier: updatedSupplier.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating supplier", error: error.message });
    }
});


router.delete('/suppliers/:id', adminMiddleware, async (req, res) => {
    const supplierId = req.params.id;

    try {
        const deleteResult = await pool.query(`DELETE FROM suppliers WHERE id = $1 RETURNING id`, [supplierId]);

        res.json({ message: 'Supplier deleted successfully', supplierId: deleteResult.rows[0].id });
    } catch (error) {
        res.status(500).json({ message: "Error deleting supplier", error: error.message });
    }
});


router.get('/suppliers', adminMiddleware, async (req, res) => {
    try {
        const suppliers = await pool.query(`SELECT * FROM suppliers`);
        res.json({ suppliers: suppliers.rows });
    } catch (error) {
        res.status(500).json({ message: "Error fetching suppliers", error: error.message });
    }
});

module.exports = router;

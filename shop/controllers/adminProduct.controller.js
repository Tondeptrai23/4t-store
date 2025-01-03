import productService from "../services/product.service.js";

class AdminProductController {
    async listProducts(req, res) {
        try {
            const products = await productService.getAll();
            res.render("admin/pages/products/list", {
                layout: "admin/layouts/main",
                products,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async showCreateForm(req, res) {
        res.render("admin/pages/products/create", {
            layout: "admin/layouts/main",
        });
    }

    // Delete a product
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await productService.deleteById(id);
            res.json({
                success: true,
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete product",
            });
        }
    }

    // Bulk delete products
    async bulkDeleteProducts(req, res) {
        try {
            const { ids } = req.body;
            await productService.bulkDelete(ids);
            res.json({
                success: true,
                message: "Products deleted successfully",
            });
        } catch (error) {
            console.error("Error bulk deleting products:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete products",
            });
        }
    }
}

export default new AdminProductController();

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
}

export default new AdminProductController();

import categoryService from "../services/category.service.js";
import productService from "../services/product.service.js";
import subCategoryService from "../services/subCategory.service.js";

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
        try {
            const categories = await categoryService.getAll();
            const subcategories = await subCategoryService.getAll();

            res.render("admin/pages/products/create", {
                layout: "admin/layouts/main",
                categories,
                subcategories,
            });
        } catch (error) {
            console.error("Error loading create product form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async createProduct(req, res) {
        try {
            const productData = req.body;
            const files = req.files;

            const images = files
                ? files.map((file) => ({
                      path: file.filename,
                      contentType: file.mimetype,
                      displayOrder: 0,
                  }))
                : [];

            const newProduct = await productService.create({
                ...productData,
                images,
            });

            res.status(201).json({
                success: true,
                message: "Product created successfully",
                product: newProduct,
            });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({
                success: false,
                message: "Failed to create product",
            });
        }
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

import categoryService from "../services/category.service.js";
import orderItemsService from "../services/orderItems.service.js";
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

    async showProductDetail(req, res) {
        try {
            const productId = req.params.id;
            const product = await productService.getById(productId);

            // Get order history for this product
            const orderHistory = await orderItemsService.getByProductId(
                productId
            );
            // Transform order history data
            const transformedOrderHistory = orderHistory.map((item) => ({
                orderId: item.order.orderId,
                status: item.order.status,
                createdAt: item.order.createdAt,
                quantity: item.quantity,
                total: item.quantity * item.priceAtPurchase,
            }));

            res.render("admin/pages/products/detail", {
                layout: "admin/layouts/main",
                product,
                orderHistory: transformedOrderHistory,
            });
        } catch (error) {
            console.error("Error in showProductDetail:", error);
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

    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getById(id);
            const categories = await categoryService.getAll();
            const subcategories = await subCategoryService.getAll();

            res.render("admin/pages/products/edit", {
                layout: "admin/layouts/main",
                product,
                categories,
                subcategories,
            });
        } catch (error) {
            console.error("Error loading edit product form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            const image = req.files
                ? req.files.map((file) => ({
                      path: file.filename,
                      contentType: file.mimetype,
                      displayOrder: 0,
                  }))[0]
                : null;

            const updatedProduct = await productService.update(id, {
                ...productData,
                image: image,
            });

            res.json({
                success: true,
                message: "Product updated successfully",
                product: updatedProduct,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update product",
            });
        }
    }

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

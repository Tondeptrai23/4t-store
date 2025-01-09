import categoryService from "../services/category.service.js";
import productService from "../services/product.service.js";
import allCategoryService from "../services/allCategory.service.js";
import subCategoryService from "../services/subCategory.service.js";

class AdminCategoryController {
    async listCategories(req, res) {
        try {

            const response = await allCategoryService.getFilteredSortedAndPaginatedCategories(
                req.query
            );

            const categories = response.categories || [];
    
            res.render("admin/pages/categories/list", {
                layout: "admin/layouts/main",
                categories,
            });

        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async showCreateForm(req, res) {
        try {
            const categories = await categoryService.getAll();
          
            res.render("admin/pages/categories/create", {
                layout: "admin/layouts/main",
                categories
            });
        } catch (error) {
            console.error("Error loading create category form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async createCategory(req, res) {
        try {
            const categoryData = req.body;

            console.log("Creating category ",JSON.stringify(categoryData));

            let newCategory;

            if(categoryData.parentCategoryId !== "null"){
                newCategory = await subCategoryService.create({
                   ...categoryData,
                   parentId: categoryData.parentCategoryId || null
                })
            } else {
                newCategory = await categoryService.create({
                    ...categoryData
                });
            }
            
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                product: newCategory,
            });
        } catch (error) {
            console.error("Error creating category :", error);
            res.status(500).json({
                success: false,
                message: "Failed to create category",
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

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryData = req.body;

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

export default new AdminCategoryController();


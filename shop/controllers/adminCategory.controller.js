import allCategoryService from "../services/allCategory.service.js";
import categoryService from "../services/category.service.js";
import productService from "../services/product.service.js";
import subCategoryService from "../services/subCategory.service.js";

class AdminCategoryController {
    categoryDetail = async (req, res) => {
        try {
            const categoryId = req.params.id;

            // Check if it's a main category or subcategory
            let category,
                subcategories = [],
                parentCategory = null;

            try {
                category = await categoryService.getById(categoryId);
            } catch (error) {
                category = null;
            }

            if (!category) {
                category = await subCategoryService.getById(categoryId);

                if (category) {
                    parentCategory = await categoryService.getById(
                        category.parentId
                    );
                }
            } else {
                subcategories = await subCategoryService.getByCategoryId(
                    categoryId
                );
            }

            // Fetch products in this category
            const productQuery = {
                categoryId: categoryId,
                page: req.query.page || 1,
                size: req.query.size || 10,
            };
            const { products, count, pagination } =
                await productService.getFilteredSortedAndPaginatedProducts(
                    productQuery
                );

            res.render("admin/pages/categories/detail", {
                layout: "admin/layouts/main",
                category,
                subcategories,
                parentCategory,
                products,
                pagination: {
                    ...pagination,
                    currentPage: productQuery.page,
                    totalProducts: count,
                },
            });
        } catch (error) {
            console.error("Category Detail Error:", error);
            res.status(500).send("Internal Server Error");
        }
    };

    async listCategories(req, res) {
        try {
            const response =
                await allCategoryService.getFilteredSortedAndPaginatedCategories(
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
                categories,
            });
        } catch (error) {
            console.error("Error loading create category form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async createCategory(req, res) {
        try {
            const categoryData = req.body;

            let newCategory;

            console.log(categoryData.isParentCategory);

            if (!categoryData.isParentCategory) {
                newCategory = await subCategoryService.create({
                    ...categoryData,
                    parentId: categoryData.parentCategoryId || null,
                });
            } else {
                newCategory = await categoryService.create({
                    ...categoryData,
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
            let category = await categoryService.getParentCategory(id);

            console.log("Test category :", category);

            if (!category) {
                category = await subCategoryService.getById(id);
            }

            const selectedParentCategoryId = category.parentId || null;

            const categories = await categoryService.getAll();

            res.render("admin/pages/categories/edit", {
                layout: "admin/layouts/main",
                category,
                categories,
                selectedParentCategoryId,
            });
        } catch (error) {
            console.error("Error loading edit category form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryData = req.body;

            console.log("Test category data :", categoryData);

            let updatedCategory;

            if (categoryData.parentCategoryId) {
                updatedCategory = await subCategoryService.update(id, {
                    ...categoryData,
                    parentId: categoryData.parentCategoryId || null,
                });
            } else {
                updatedCategory = await categoryService.update(id, {
                    ...categoryData,
                });
            }

            res.json({
                success: true,
                message: "Category updated successfully",
                product: updatedCategory,
            });
        } catch (error) {
            console.error("Error updating category:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update category",
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await categoryService.deleteById(id);
            await subCategoryService.deleteById(id);

            res.json({
                success: true,
                message: "Category deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete category",
            });
        }
    }

    async bulkDeleteCategories(req, res) {
        try {
            const { ids } = req.body;
            await categoryService.bulkDelete(ids);
            await subCategoryService.bulkDelete(ids);
            res.json({
                success: true,
                message: "Categories deleted successfully",
            });
        } catch (error) {
            console.error("Error bulk deleting categories:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete categories",
            });
        }
    }
}

export default new AdminCategoryController();

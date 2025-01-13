import SubCategory from "../models/subCategory.model.js";

class SubCategoryService {
    getAll = async () => {
        try {
            let subCategories = await SubCategory.findAll();

            subCategories = subCategories.map((subCategory) =>
                subCategory.toJSON()
            );

            return subCategories;
        } catch (error) {
            throw new Error("Error fetching subCategories: " + error.message);
        }
    };

    getByCategoryId = async (categoryId) => {
        try {
            const subcategories = await SubCategory.findAll({
                where: { parentId: categoryId },
            });
            return subcategories.map((subcat) => subcat.toJSON());
        } catch (error) {
            throw new Error("Error fetching subcategories: " + error.message);
        }
    };

    getById = async (categoryId) => {
        try {
            const category = await SubCategory.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            return category;
        } catch (error) {
            throw new Error("Error fetching product: " + error.message);
        }
    };

    create = async (categoryData) => {
        try {
            const category = await SubCategory.create(categoryData);

            return category.toJSON();
        } catch (error) {
            console.error("Error creating subCategory:", error);
            throw new Error("Failed to create subCategory: " + error.message);
        }
    };

    update = async (categoryId, categoryData) => {
        try {
            const category = await SubCategory.findByPk(categoryId);

            if (!category) {
                throw new Error(`SubCategory with ID ${categoryId} not found`);
            }

            await category.update(categoryData);

            return await SubCategory.findByPk(categoryId);
        } catch (error) {
            throw new Error("Failed to update subCategory: " + error.message);
        }
    };

    deleteById = async (categoryId) => {
        try {
            // First check if the product exists
            const category = await SubCategory.findByPk(categoryId);

            if (!category) {
                return false;
            }

            // Delete the product
            await SubCategory.destroy({
                where: {
                    categoryId: categoryId,
                },
            });

            return true;
        } catch (error) {
            console.error("Error in deleteById:", error);
            throw new Error("Failed to delete subCategory");
        }
    };

    bulkDelete = async (categoryIds) => {
        try {
            const result = await SubCategory.destroy({
                where: {
                    categoryId: categoryIds,
                },
            });

            return result;
        } catch (error) {
            console.error("Error in bulkDelete:", error);
            throw new Error("Failed to delete subCategories");
        }
    };
}

export default new SubCategoryService();

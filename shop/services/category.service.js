import { Op } from "sequelize";
import Category from "../models/category.model.js";
import Image from "../models/image.model.js";
import Product from "../models/product.model.js";
import SubCategory from "../models/subCategory.model.js";

class CategoryService {
    getAll = async () => {
        try {
            let categories = await Category.findAll();

            categories = categories.map((category) => category.toJSON());

            return categories;
        } catch (error) {
            throw new Error("Error fetching products: " + error.message);
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
    getParentCategory = async (categoryId) => {
        try {
            const Pcategory = await Category.findByPk(categoryId);
            return Pcategory;
        } catch (error) {
            throw new Error("Error fetching products: " + error.message);
        }
    };
    getRelatedProducts = async (categoryId, productId) => {
        try {
            const products = await Product.findAll({
                where: {
                    categoryId,
                    productId: {
                        [Op.ne]: productId,
                    },
                },
            });
            const images = await Image.findAll();
            const productsWithImages = products.map((product) => {
                const productImages = images.filter(
                    (image) => image.productId == product.productId
                );
                return {
                    ...product.toJSON(),
                    images: productImages,
                };
            });
            return productsWithImages;
        } catch (error) {
            throw new Error(
                "Error fetching products with images: " + error.message
            );
        }
    };

    create = async (categoryData) => {
        try {
            const category = await Category.create(categoryData);

            return category.toJSON();
        } catch (error) {
            console.error("Error creating category:", error);
            throw new Error("Failed to create category: " + error.message);
        }
    };

    update = async (categoryId, categoryData) => {
        try {
           
            const category = await Category.findByPk(categoryId);

            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }

            await category.update(categoryData);

            return await Category.findByPk(categoryId);

        } catch (error) {
            throw new Error("Failed to update category: " + error.message);
        }
    };

    deleteById = async (categoryId) => {
        try {
            // First check if the product exists
            const category = await Category.findByPk(categoryId);

            if (!category) {
                return false;
            }

            // Delete the product
            await Category.destroy({
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
            const result = await Category.destroy({
                where: {
                    categoryId: categoryIds,
                },
            });

            return result;
        } catch (error) {
            console.error("Error in bulkDelete:", error);
            throw new Error("Failed to delete categories");
        }
    };
}

export default new CategoryService();

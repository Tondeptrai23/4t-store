import { Op } from "sequelize";
import Category from "../models/category.model.js";
import Image from "../models/image.model.js";
import Product from "../models/product.model.js";
import SubCategory from "../models/subCategory.model.js";

class CategoryService {
    getAll = async () => {
        try {
            const categories = await Category.findAll();
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
}

export default new CategoryService();

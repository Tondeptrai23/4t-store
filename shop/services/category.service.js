import Category from '../models/category.model.js'
import SubCategory from '../models/subcategory.model.js';

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
    getCategoryByParentId = async (parentId) => {
        try {
            const categories = await SubCategory.findAll({ where: { parentId: parentId } });
            return categories;
        } catch (error) {
            throw new Error("Error fetching products: " + error.message);
        }
    };
}

export default new CategoryService();


import Category from '../models/category.model.js'

class CategoryService {
    getAll = async () => {
        try {
            const categories = await Category.findAll();
            return categories;
        } catch (error) {
            throw new Error("Error fetching products: " + error.message);
        }
    };
    
}

export default new CategoryService();


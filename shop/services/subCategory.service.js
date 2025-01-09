import SubCategory from '../models/subCategory.model.js'

class SubCategoryService {
    getAll = async () => {
        try {
            const subCategories = await SubCategory.findAll();
            return subCategories;
        } catch (error) {
            throw new Error("Error fetching products: " + error.message);
        }
    };
    
}

export default new SubCategoryService();

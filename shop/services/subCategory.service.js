import SubCategory from '../models/subCategory.model.js'

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

}

export default new SubCategoryService();

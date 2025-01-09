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

    create = async (categoryData) => {
        try {
            const category = await  SubCategory.create(categoryData);

            return category.toJSON();
        } catch (error) {
            console.error("Error creating subCategory:", error);
            throw new Error("Failed to create subCategory: " + error.message);
        }
    };

}

export default new SubCategoryService();

import allCategoryService from "../services/allCategory.service.js";
import categoryService from "../services/category.service.js";
import subCategoryService from "../services/subCategory.service.js";

class AllCategoryController {
   
    getCategories = async function(req, res, next) {
        try {
            const requestQuery = req.query; 
        
            const result =
                await allCategoryService.getFilteredSortedAndPaginatedCategories(
                    requestQuery
                );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching all categories:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch  all categories.",
            });
        }
    };

    async getById(req, res, next) {
        try {
        
            const categoryId = req.params.id;

            let category = await categoryService.getById(categoryId);
            if (!category) {
                category = await subCategoryService.getById(categoryId);
            }

           
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }

    async getProducts(req, res) {
        try {
            const requestQuery = req.query; // Lấy các tham số từ query string
            console.log("get products " + JSON.stringify(requestQuery));
            const result =
                await productService.getFilteredSortedAndPaginatedProducts(
                    requestQuery
                );

            // Trả về kết quả
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching products:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch products.",
            });
        }
    }
}

export default new AllCategoryController();

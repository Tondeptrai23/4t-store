import allCategoryService from "../services/allCategory.service.js";

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
}

export default new AllCategoryController();

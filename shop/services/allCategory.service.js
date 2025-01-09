import { Sequelize } from "sequelize";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import Image from "../models/image.model.js";
import Product from "../models/product.model.js";
import subCategoryService from "../services/subCategory.service.js";
import categoryService from "../services/category.service.js";
import {
    FilterBuilder
} from "../utils/condition.js";

export class ProductFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "name"
        ];
    }
}

class AllCategoryService {

    getAll = async () => {
        try {

            const parentCategories = await categoryService.getAll();
            const subCategories = await subCategoryService.getAll();

            const updatedParentCategories = parentCategories.map(parentCategory => ({
                ...parentCategory,
                parentId: parentCategory.categoryId,
            }));

            // Merge categories and sort by name
            const categories = [...updatedParentCategories, ...subCategories]

            return categories;

        } catch (error) {
            throw new Error("Error fetching all categories: " + error.message);
        }
    };


    getFilteredSortedAndPaginatedCategories = async (requestQuery) => {
        console.log("Query in service:", JSON.stringify(requestQuery));
    
        const { page = 1, size = 10, sort = 'createdAt', order = 'ASC', name = '' } = requestQuery;
    
        // Pagination
        const limit = parseInt(size, 10);
        const offset = (page - 1) * limit;
    
        // Sort
        const sortCriteria = [[sort, order]];
    
        try {
            const filterBuilder = new ProductFilterBuilder(requestQuery);
            const filterCriteria = filterBuilder.build();
    
            const parentCategories = await Category.findAll({
                where: filterCriteria,
                attributes: [
                    'categoryId', 
                    'name', 
                    'description', 
                    'createdAt', 
                    'updatedAt',
                    [Sequelize.literal('NULL'), 'parentId'] 
                ],
            });
    
            const subCategories = await SubCategory.findAll({
                where: filterCriteria,
                attributes: [
                    'categoryId', 
                    'name', 
                    'description', 
                    'createdAt', 
                    'updatedAt', 
                    'parentId'
                ]
            });
    
            let combinedCategories = [
                ...parentCategories.map(item => ({ ...item.toJSON() })),
                ...subCategories.map(item => ({ ...item.toJSON() }))
            ];
    
           
            combinedCategories.sort((a, b) => {
                if (sortCriteria && sortCriteria.length > 0) {
                    const [sortColumn, sortOrder] = sortCriteria[0];
                    const direction = sortOrder === 'DESC' ? -1 : 1;
            
                    const valueA = a[sortColumn];
                    const valueB = b[sortColumn];
            
                    // Xử lý nếu giá trị là null hoặc undefined
                    if (valueA == null && valueB == null) return 0;
                    if (valueA == null) return -1 * direction;
                    if (valueB == null) return 1 * direction;
            
                    // So sánh giá trị dựa trên kiểu dữ liệu
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        // Chuỗi: dùng localeCompare
                        return valueA.localeCompare(valueB) * direction;
                    } else if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
                        // Ngày tháng: so sánh theo thời gian
                        return (new Date(valueA) - new Date(valueB)) * direction;
                    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                        // Số: so sánh trực tiếp
                        return (valueA - valueB) * direction;
                    } else {
                        // Mặc định: chuyển về chuỗi và so sánh
                        return valueA.toString().localeCompare(valueB.toString()) * direction;
                    }
                }
                return 0; // Không có tiêu chí sắp xếp
            });
            
    
            const paginatedCategories = combinedCategories.slice(offset, offset + limit);
    
            const totalCount = combinedCategories.length;
    
            const totalPages = Math.ceil(totalCount / limit);
    
            return {
                count: totalCount,
                categories: paginatedCategories, // Trả về các categories đã phân trang
                pagination: { limit, offset, totalPages }, // Trả lại thông tin phân trang (nếu cần)
            };
        } catch (err) {
            console.error("Error in getFilteredSortedAndPaginatedCategories:", err);
            throw new Error("Error fetching all categories.");
        }
    };
    
}

export default new AllCategoryService();


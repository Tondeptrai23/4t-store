import Product from '../models/product.model.js'
import Image from '../models/image.model.js';
import { SortBuilder, FilterBuilder, PaginationBuilder } from '../utils/condition.js';


export class ProductSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            name: ["name"],
            price: ["price"],
            updatedAt: ["updatedAt"],
            createdAt: ["createdAt"],
           
        };
        this._defaultSort = [["createdAt", "ASC"]];
    }

}


export class ProductFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "productId",
            "name",
            "price",
            "color",
            "categoryId",
            "updatedAt",
            "createdAt",
        ];
    }
}

const preprocessRequestQuery = (requestQuery) => {
    if (typeof requestQuery.sort === "string") {
        // Chuyển chuỗi `sort` thành mảng các trường
        requestQuery.sort = requestQuery.sort.split(",").map((field) => field.trim());
    }
    return requestQuery;
};

class ProductService {
    // Lấy danh sách sản phẩm
    getAll = async () => {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Image,
                        as: "images", 
                        required: false,
                    },
                ],
            });
    
            const productsWithImages = products.map(product => product.toJSON());
            
            return productsWithImages;
        } catch (error) {
            throw new Error("Error fetching products with images: " + error.message);
        }
    };

    // Get sorted, filtered, and paginated products
    getFilteredSortedAndPaginatedProducts = async (requestQuery) => {
        console.log("Query in service:", JSON.stringify(requestQuery));

        // Preprocess request query to handle sorting 
        const sortQuery = preprocessRequestQuery(requestQuery); 
    
        try {
            // Process filtered products
            const filterBuilder = new ProductFilterBuilder(requestQuery);
            const filterCriteria = filterBuilder.build();
    
            //Process sorted products
            const sortBuilder = new ProductSortBuilder(sortQuery);
            const sortCriteria = sortBuilder.build();

            // Process paginated products
            const paginationBuilder = new PaginationBuilder(requestQuery);
            const { limit, offset } = paginationBuilder.build();
    
            // Query products from the database
            const productsQuery = await Product.findAll({
                where: filterCriteria , 
                order: [...sortCriteria],                
                limit,                              
                offset,    
                include: [
                    {
                        model: Image,
                        as: "images", 
                        required: false,
                    },
                ],                        
            });

            const totalCount = await Product.count({
                where: filterCriteria, 
            });

            // Map the images to the products
            const productsWithImages = productsQuery.map(product => product.toJSON());

            const totalPages = Math.ceil(totalCount / limit);
    
            return {
                count: totalCount,
                products: productsWithImages,
                pagination: { limit, offset, totalPages}, // Trả lại thông tin phân trang (nếu cần)
            };
            
        } catch (err) {
            console.error("Error in getFilteredSortedAndPaginatedProducts:", err);
            throw new Error("Error fetching products.");
        }
    };
    
    
    
    getById = async (productId) => {
        try {
            const product = await Product.findByPk(productId, {
                include: [
                    {
                        model: Image,
                        as: "images", 
                    },
                ],
            });
    
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
    
            return product.toJSON(); 
        } catch (error) {
            throw new Error("Error fetching product with images: " + error.message);
        }
    };
    
    
}

export default new ProductService();


const sortBuilder = new ProductSortBuilder({"price":"price"});
const sortCriteria = sortBuilder.build();

console.log("Sort criteria test:", sortCriteria);
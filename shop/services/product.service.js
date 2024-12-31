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
        this._defaultSort = [["name", "ASC"]];
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
            const products = await Product.findAll(); // Lấy tất cả sản phẩm
            const images = await Image.findAll(); // Lấy tất cả hình ảnh

            // Gắn hình ảnh vào từng sản phẩm
            const productsWithImages = products.map(product => {
                // Lọc danh sách hình ảnh có productId tương ứng
                const productImages = images.filter(image => image.productId == product.productId);
                return {
                    ...product.toJSON(),
                    images: productImages, // Thêm trường Images chứa danh sách hình ảnh
                };
            });

            return productsWithImages;
        } catch (error) {
            throw new Error("Error fetching products with images: " + error.message);
        }
    };

    // Lấy danh sách sản phẩm của một danh mục
    getFilteredSortedAndPaginatedProducts = async (requestQuery) => {
        console.log("Query in service:", JSON.stringify(requestQuery));
        const sortQuery = preprocessRequestQuery(requestQuery); // Xử lý requestQuery đầu vào
    
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
            });

            const totalCount = await Product.count({
                where: filterCriteria, 
            });

            // Query images from the database
            const images = await Image.findAll();

            // Map the images to the products
            const productsWithImages = productsQuery.map(product => {
                
                const productImages = images.filter(image => image.productId == product.productId);
                return {
                    ...product.toJSON(),
                    images: productImages,
                };

            });
    
            return {
                count: totalCount,
                products: productsWithImages,
                pagination: { limit, offset }, // Trả lại thông tin phân trang (nếu cần)
            };
            
        } catch (err) {
            console.error("Error in getFilteredSortedAndPaginatedProducts:", err);
            throw new Error("Error fetching products.");
        }
    };
    
    
    
}

export default new ProductService();


const sortBuilder = new ProductSortBuilder({"price":"price"});
const sortCriteria = sortBuilder.build();

console.log("Sort criteria test:", sortCriteria);
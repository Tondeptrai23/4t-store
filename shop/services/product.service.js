import Product from '../models/product.model.js'
import Image from '../models/image.model.js';



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

    // Lấy sản phẩm theo ID
    getById = async (productId) => {
        try {

            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            const images = await Image.findAll(); // Lấy tất cả hình ảnh

            // Lọc danh sách hình ảnh có productId tương ứng
            const productImages = images.filter(image => image.productId == productId);

            return {
                ...product.toJSON(),
                images: productImages, // Thêm trường Images chứa danh sách hình ảnh
            };
        } catch (error) {
            throw new Error("Error fetching product with images: " + error.message);
        }
    };
    
}

export default new ProductService();



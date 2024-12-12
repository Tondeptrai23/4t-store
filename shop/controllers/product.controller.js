import productService from "../services/product.service.js";
import categoryService from "../services/category.service.js";

class ProductController {
    async getAll(req, res, next) {
        try {
            console.log("get function called");
            
            // Gọi service và chờ kết quả trả về
            const products = await productService.getAll();
            const categories = await categoryService.getAll();
            
            // Render trang EJS với danh sách sản phẩm
            res.render('index', { body: 'pages/productlist', products, categories });
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }

    // async getAllDb(req, res, next) {
    //     res.json(await userService.getAllInDb());
    // }
}

export default new ProductController();

function get(){
    console.log("get function called");
   productService.getAll()
    .then( result =>{
        console.log(result);
    })
}

get()

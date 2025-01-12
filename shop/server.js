import app from "./app.js";
import db from "./models/index.model.js";

// Connect to db
db.sync()
    .then(async (res) => {
        console.log("Database connected");   
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);

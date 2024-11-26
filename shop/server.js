import app from "./app.js";
import db from "./models/index.model.js";
import seedData from "./seedData.js";

// Connect to db
db.sync({ force: true })
    .then(async (res) => {
        await seedData();
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);

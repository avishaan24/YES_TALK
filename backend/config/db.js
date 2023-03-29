const mongoose = require("mongoose");

const connectDb = async() =>  {
      try {
            const conn = await mongoose.connect("mongodb://127.0.0.1:27017",{
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
            });
            console.log(`MongoDb connected: ${conn.connection.host}`)
      } catch (error) {
            console.log(`Error:${error.message}`);
            process.exit();
      }
};

module.exports=connectDb;
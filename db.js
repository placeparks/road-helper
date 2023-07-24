const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://kainat:kainat107@cluster1.s5ml3jj.mongodb.net/apis';
const connectToMongo = () => {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected successfully"))
        .catch((error) => console.error("Failed to connect", error));
}

module.exports = connectToMongo;
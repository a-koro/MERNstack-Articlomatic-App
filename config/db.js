const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mongo-user:tX5d7LwDGHkjHzRh@cluster0.o5hd7.mongodb.net/crud_proj?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


// module.exports = client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("Connected to MongoDB");
//   client.close();
// });

const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Load models

const Bootcamp = require("./models/Bootcamps");

// Connect to DB
mongoose.connect(`mongodb://localhost/camper`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import data

const importData = async() => {
    try {
        await Bootcamp.create(bootcamps)

        console.log('Data imported successfully')
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

//Delete data
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany()

        console.log('Data deleted successfully')
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if(process.argv[2] === '-i') {
    importData()
} else if(process.argv[2] === '-d') {
    deleteData()
    
}
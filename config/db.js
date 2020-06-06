const mongoose = require('mongoose')

const connectDB = async () => {
    
        const conn = await mongoose.connect(`mongodb://localhost/camper`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
}

module.exports = connectDB
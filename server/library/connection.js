const mongoose = require("mongoose");
const port = process.env.PORT || 3000;


let _db

async function initDb(){
    if (_db) {
        console.log('Db is already initialized!');
        return
      }



    try {
         // connect to a local MongoDB instance using the mongoose.connect() function.
         //For local MongoDB databases, we recommend using 127.0.0.1 instead of localhost. That is because Node.js 18 and up prefer IPv6 addresses, which means, on many machines, Node.js will resolve localhost to the IPv6 address ::1 and Mongoose will be unable to connect, unless the mongodb instance is running with ipv6 enabled.
        mongoose.connect('mongodb://127.0.0.1:27017/cms', { useNewUrlParser: true });
        // To make sure your connection was successful,
        //add the following code right below your mongoose.connect().
        const _db = mongoose.connection;
        _db.on("error", console.error.bind(console, "connection error: "));
        _db.once("open", function () {
            console.log("Connected to Database");
            const app = require('../../server');
            app.listen(port, () => {
                console.log(`Running on port ${port}`)
            })
          });

    } catch (err) {
        console.log('Connection failed: ' + err);
    }
    // finally {
    //     await client.close();
    // }
}

module.exports = {initDb};

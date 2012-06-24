var mongodb = require('mongodb').Db;

var mongoConnection;
mongodb.connect("mongodb://localhost:27017/shouldibuy", function (err, connection) {
    if (err || !connection) {
        console.log('Could not connect to MongoDB');
    } else {
        exports.mongoConnection = mongoConnection = connection;
        console.log("connected to mongodb");
    }
});


exports.addQuestion = function (body, callback) {
    debugger;

    mongoConnection.collection('questions',
        function (err, coll) {
            if (err) {
                callback(err);
                return;
            }

            coll.findOne({"item1.ASIN": body.item1.ASIN}, function (err, obj) {
                debugger;
                if (obj) {
                    callback(null, obj);
                    return;
                }

                coll.insert(body, {
                        safe:true
                    },
                    function (err) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        callback(null, body);
                    });
            });

        });

};
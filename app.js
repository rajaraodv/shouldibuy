var express = require('express');
var app = express.createServer();
var util = require('util');
var OperationHelper = require('apac').OperationHelper;
var mongoLib = require('./mongoLib.js');

var opHelper = new OperationHelper({
    awsId:'AKIAIWH4I4MAW6HWNUYA',
    awsSecret:'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',
    assocId:'wwwshouldibuy-20'
});


app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
});

app.configure('development', function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', { maxAge:oneYear }));
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    //debugger;
    //console.log("11111");
    //console.log(mongoLib.mongoConnection);
    res.sendfile('index.html');
});

app.get('/search', function (req, res) {
    opHelper.execute('ItemSearch', {
        'SearchIndex':'All',
        'Keywords':req.query.item1,
        'ResponseGroup':'Images,ItemAttributes,Offers'
    }, function (error, results) {
        if (error) {
            console.log('Error: ' + error + "\n");
            res.send({"error":"There was a error connecting to Amazon"})
        }
        console.log("got response from amzn");
        var items = results.Items && results.Items.Item ? results.Items.Item : [];
        console.log(items);
        if (items && items.length > 3) {
            items = items.splice(0, 3);
        }
        res.send({"items":items});
    });
});

app.post('/addQuestion', function(req, res){
    mongoLib.addQuestion(req.body, function(err, storedJson) {
            if(err) {
                res.end({"error" : err});
            } else {
                res.end(JSON.stringify(storedJson));
            }
        }
    );
});

app.post('/addVote', function(req, res){
    mongoLib.addQuestion(req.body, function(err, storedJson) {
            if(err) {
                res.end({"error" : err});
            } else {
                res.end(JSON.stringify(storedJson));
            }
        }
    );
});

app.get('/getQuestions', function(req, res) {
    mongoLib.getQuestions(function(err, result) {
            if(err) {
                console.log(err);
            } else {
                res.end(JSON.stringify(result));
            }
        }
    );
});

app.listen(3000);
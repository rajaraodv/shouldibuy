var express = require('express');
var app = express.createServer();
var util = require('util');
var  OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAIWH4I4MAW6HWNUYA',
    awsSecret: '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',
    assocId:   'wwwshouldibuy-20'
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
    res.sendfile('index.html');
});

app.get('/search', function(req, res){
    opHelper.execute('ItemSearch', {
        'SearchIndex': 'Books',
        'Keywords': 'harry potter',
        'ResponseGroup': 'Images,ItemAttributes,Offers'
    }, function(error, results) {
        if (error) {
            console.log('Error: ' + error + "\n");
            res.send({"error": "There was a error connecting to Amazon"})
        }
        var items = results.Items ? results.Items.Item : [];
        if (items && items.length > 5) {
            items = items.splice(0, 4);
        }
        res.send({"items" : items});
    });


});

app.listen(3000);
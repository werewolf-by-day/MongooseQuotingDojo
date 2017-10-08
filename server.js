//dependencies
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//start app
var app = express();
//use path & body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
// && ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
//for Promises
mongoose.Promise = global.Promise;
// connect to mongoDB
mongoose.connect('mongodb://localhost/quoting_dojo');
// create schema for new entries
var QuoteSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 2, maxlength: 256},
	quote: {type: String, required: true, minlength: 2, maxlength: 256}
	}, 
	{timestamps: true});
var Quote = mongoose.model('quotes', QuoteSchema)
//routes
app.get('/', function(req, res) {
	res.render('index');
});

app.get('/quotes', function(req, res) {
    Quote.find({}).sort('-createdAt')
    .exec(function(err, quotes){
        res.render('quotes', {quotes: quotes});
    });
});

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    quote.save(function(err) {
        if (err) {
            res.render('index', {errors: quote.errors});
        } else {
            res.redirect('/quotes');
        }
    });
});
//listen
app.listen(8000, function() {
	console.log('listening on port 8000, like a boss');
});

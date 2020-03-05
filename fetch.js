const bodyParser = require('body-parser');
const express = require('express');


// const hbs = require('hbs');
const http = require('http');
const path = require('path')
const exphbs = require('express-handlebars')



const port = 4000;

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.engine('.hbs', exphbs({
	defaultLayout: 'home',
	extname: '.hbs',
	layoutsDir: path.join(__dirname, 'views')
}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response, next) => {
	console.log("For now, rendering the home page as pyramid page");
	response.render('home', {
		'title': 'Home - Pyramid Example'
	});
});

app.get('/pyramid', (request, response, next) => {
	console.log("Rendering the pyramid page");
	response.render('home', {
		'title': 'Pyramid Example'
	});
});

app.post('/pyramid', (request, response, next) => {
	console.log("Pyramid is in postssssssś");
	let str = request.body['pyramid_str'];

	let is_pyr = is_pyramid(str);
	response.json({ 'status': true, 'is_pyramid': is_pyr });
});

//Error handler
app.use((err, request, response, next) => {
	// log the error, for now just console.log
	console.log(err)
	response.status(500).send('Internal server error!');
	next();
});

//Initiating the server and listening to the port.
app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err)
	}

	console.log(`server is listening on ${port}`)
});

function is_pyramid(str) {
	console.log("String received", str);

	let n = getSumOfN(str.length);
	//not natural sum of n, can not be a pyramid
	if(n == -1) {
		return false;
	}

	let key_obj = {};
	let str_arr = str.split("");
	for (let i = 0; i < str_arr.length; i++) {
		if(key_obj[str_arr[i]] !== null && key_obj[str_arr[i]] !== undefined) {
			key_obj[str_arr[i]]++;
		} else {
			key_obj[str_arr[i]] = 1;
		}
	}

	//if k
	if(Object.keys(key_obj).length !== n) {
		return false;
	}

	// console.log("Keys ->>>>" , key_obj);
	let val_obj = Object.keys(key_obj).reduce(function(obj, key) {
		obj[key_obj[key]] = key;
		return obj;
	}, {});

	// console.log("Values ->>>>", val_obj);
	// console.log(Object.keys(key_obj), Object.keys(key_obj).length);
	// console.log(Object.keys(val_obj), Object.keys(val_obj).length);
	if(Object.keys(key_obj).length !== Object.keys(val_obj).length) {
		return false;
	}

	return true;
}

//Check is it sum of n natural numbers
function getSumOfN(s) {
	let sum = 0; 
	// Start adding numbers from 1
	for (let n = 1; sum < s; n++) {
		sum += n;
		// If sum becomes equal to s 
		// return n
		if (sum == s) {
			return n;
		}
	}

	return -1;
}
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')

var router = require('./router.js')

var app = express()

app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
app.use('/public/',express.static(path.join(__dirname,'./public/')))

app.engine('html',require('express-art-template'))

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

app.use(router)



app.listen(3000,function(){
	console.log('port:3000 is running......')
})

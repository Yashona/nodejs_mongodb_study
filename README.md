
nodejs 基础的练习  ----  使用 mongodb 数据库

使用 mongodb 数据库，对列表数据 增、删、改、查 功能操作

所需要安装的第三方包：
	express     			---node.js Web应用框架
	art-template			---模板引擎  即使用render()
	express-art-template	---模板引擎渲染 即使用 app.engine('html',require('express-art-template'))
	body-parser				---第三方核心模块的中间件 解析 post 数据
	bootstrap@3.3.7  		---根据静态页面模板，加载指定的插件 （当前页面用的是bootstrap 3.3.7版）
	mongoose				---对 mongodb 数据库进行便捷操作的 对象模型工具

操作步骤如下：

1.先创建好目录

	studentInfo   ---  项目总文件夹
	public		  ---  公共文件夹，存放 js,css,img
	views         ---  视图文件夹，存放html页面
	app.js        ---  项目入口文件

2.在项目总文件夹目录下打开 node 终端 
	2.1 初始化项目
		npm init --y
	2.2 安装第三方包 （简写）注意加上 -S ，后面用@是安装指定版本
		npm i -S express art-template express-art-template body-parser bootstrap@3.3.7

	2.3 安装 mongoose 第三方包
		npm i -S mongoose


3.启动数据库

	在安装 mongodb 文件夹下面的 bin 目录中 打开 终端 ，
	启动 mongodb 数据库，并指定数据表存储路径

		mongod --dbpath E:\node\dataTable\data01\db

	注：所存储数据的文件夹名为 db ,则必须先创建好，再设置路径

4.设置入口文件 app.js
	
	var express = require('express')
	var path = require('path') //nodejs中的 path 模块
	var bodyParser = require('body-parser')//express中没有内置获取表单post请求的API，这里需要用第三方包：body-parser
	
	var router = require('./router.js') //引入路由文件
	var app = express()//创建app

	//开放资源   推荐使用第一种
	app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
	app.use('/public/',express.static(path.join(__dirname,'./public/')))
	
	//配置使用 art-template 模板引擎  第一个参数为模板引擎的文件格式
	app.engine('html',require('express-art-template'))
	//设置模板引擎目录，其中默认就是 ./views 目录
	app.set('views', path.join(__dirname, './views/'))
	
	//配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended:false }))
	// parse application/json
	app.use(bodyParser.json())
	
	// 把路由挂载到 app 中
	app.use(router)
	
	//设置端口监听
	app.listen(3000,function(){
		console.log('port:3000 is running......')
	})

5.编辑路由文件 router.js

	var express = require('express')

	var Student = require('./student.js') //引入 student操作模块

	var router = express.Router() //创建路由容器
	
	//设置路由，并渲染静态页面  
	router.get('/index',function(req,res){
		Student.find(function(err,data){  //查找，编辑，删除可在 mongoose 官网查看方法
			if(err) return res.status(500).send('Server Error')
			var students = data.students
			res.render('./index.html',{students:students})
		})
	})

	router.post('/addStudent',function(req,res){
		new Student(req.body).save(function(err){  //保存数据，需要先将数据对象实例
			if(err) return res.status(500).send('Server Error')
			res.redirect('/index')
		})
	})
	
	//导出路由容器
	module.exports = router

6.给 mongodb 数据库设计数据表 ，创建 student.js 文件
	
	//引入 mongoose 第三方包
	var mongoose = require('mongoose')
	//连接数据库，并创建数据表
	mongoose.connect('mongodb://127.0.0.1/itcast')
	//创建一个图表，每个模式都映射到MongoDB集合，并定义该集合中文档的形状
	var Schema = mongoose.Schema
	//实例图表，即创建表的 key , 并给 key 不同的类型和约束
	var studentSchema = new Schema({
		name:{
			type:String,
			require:true
		},
		gender:{
			type:Number,
			enum:[0,1],
			default:0
		},
		age:{
			type:Number
		},
		hobbies:{
			type:String
		},
	})
	
	//将实例的图表 转换为可以使用的模型
	//此处转换的模型 Student 在数据表中将转换为 students
	module.exports = mongoose.model('Student',studentSchema)  


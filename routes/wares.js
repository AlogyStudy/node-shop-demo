
let express = require('express');

let Ware = require('../models').Ware;

let router = express.Router();

let parser = require('multer')().single('imgSrc');

let fs = require('fs');

let uuid = require('uuid');
let mime = require('mime');

// 添加商品
router.post('/add', parser, function ( req, res ) {
	
	let ware = req.body;
	
	let imgInfo = ware.imgSrc.split(',');
	
	// 类型 
	let ext = mime.extension(imgInfo[0].slice( imgInfo[0].indexOf(':')+1, imgInfo[0].indexOf(';')));
	
	let imgSrc = uuid.v4() + '.' + ext; // 生成唯一的字符串
	
	fs.writeFile('./app/public/upload/' + imgSrc, imgInfo[1], 'base64', function ( err, results ) {
		
		new Ware({
			name: ware.name,
			price: ware.price,
			imgSrc: '/upload/' + imgSrc
		})
			.save(function ( err, ware ) {
			
				if ( err ) {
					
					res.status(500).json({msg: err});
					
				} else {
					
					res.json(ware);
					
				}
				
		});
		
	});
	
});


// 查询列表
router.get('/list', function ( req, res ) {
	
	// 查询数据库
	Ware.find({}, function ( err, wares ) {
		
		if ( err ) {
			
			res.status(500).json({msg: err});
			
		} else {
			
			res.json(wares);
			
		}
		
		
	});
	
});

module.exports = router;

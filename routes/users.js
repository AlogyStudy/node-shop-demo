let express = require('express');
let User = require('../models').User;
let crypto = require('crypto');

let router = express.Router();

function encrypt ( str ) {
	return crypto.createHash('md5').update(str).digest('hex');
}


// 注册
router.post('/reg', function ( req, res ) {
	
	// 获取值
	let user = req.body;
	// 密码
	user.password = encrypt(user.password); 
	// 加密
//	var md5Emial = encrypt(user.emial); email
	let md5Emial = 	encrypt(user.email);
	
	// 头像
	user.avatar = 'https://secure.gravartar.com/avatar/' + md5Emial + '?s=48';
	
	new User(user)
		.save(function ( err, user ) {
			console.error(user);
      if(err){
          res.status(500).json( {msg: err} );
      }else{
          res.json(user);
      }
		});

});


// 登陆
router.post('/login', function ( req, res ) {
	
	let user = req.body;
	
	// 查询数据库
	User.findOne({username: user.username, password: encrypt(user.password)}, function ( err, user ) {
		
		if ( err ) {
			
			res.status(500).json({msg: err});
			
		} else {
						
			req.session.user = user;  // 设置session
			
			res.json(user);
			
		}
		
	} );	
	
});
//
//// 退出
//router.post('/logout', function ( req, res ) {
//	
//	req.session.user = null;
//	
//	res.status(200).json({msg: 'success'});
//	
//});
//
//
//// 检验登陆状态
//router.post('/validate' ,function ( req, res ) {
//	
//	if ( req.session  ) {
//		
//		console.log( req.session );
//		
//		let users = req.session.user;
//		
//		if ( users && user._id ) {
//			
//			res.status(200).json(user);
//			
//		} else {
//			
//			res.status(401).json({msg: '用户未登陆'});
//			
//		}
//		
//	}
//	
//});



router.post('/logout',function(req,res){
    req.session.user = null;
    res.status(200).json({msg:'success'})
});

router.post('/validate',function(req,res){
    var user = req.session.user;
    if(user && user._id){
        res.status(200).json(user)
    }else{
        res.status(401).json({msg:'用户未登陆'});
    }
});


module.exports = router;


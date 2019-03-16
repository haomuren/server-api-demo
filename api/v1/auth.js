const express = require('express');
const { User } = require('../../models'); // 默认情况 去找models文件下的index文件名
const { Product } = require('../../models'); // 如果不是默认(index)的话 要写清楚 引入的模块地址 不是默认的
const router = express.Router();

// 用户注册
router.post('/reg', async (req, res) => {
  if( !req.body.userName ) {
    res.json({
      status: 'error',
      info: '用户名不能为空~'
    })
    return;
  }
  const userCount = await User.countDocuments({userName: req.body.userName});
  
  if(userCount > 0) {
    res.json({
      status: 'error',
      info: '用户名已经存在~'
    })
  } 
  if( !req.body.password || !req.body.avatar || !req.body.nickName) {
    res.json({
      status: 'error',
      info: '密码、头像、昵称都不能为空~'
    })
    return;
  }
  else {
      try {
        const user = new User(req.body);
        await user.save();
        res.json({
          status: 'success',
          info: '注册成功~'
        })
      } catch (err) {
        res.json({
          status: 'error',
          info: err
        })
      }
    }  
})


// 用户登录
router.post('/login', async (req, res) => {
  async function getAllUserFilter(query) { 
    const result = await User.findOne(query);
    // console.log(result);
    // console.log(query);
    // console.log(result.userName);
    if(!req.body.userName || !req.body.password) {
      res.json({
        status: 'error',
        info: '用户名、密码不能为空~'
      })
      return;
    } else if(result == null) {
      res.json({
        status: 'error',
        info: '用户名不存在 ~'
      });
      return;
    } else {
      if(result.password != req.body.password) {
        res.json({
          status: "error",
          info: "密码不正确"
        });
      } else {
        res.json({
          status: "success",
          info: "登录成功~"
        });
      }
    }       
  }  
  getAllUserFilter({ // 调用这个函数输入 单条/多条查询条件 都要满足条件
    userName: req.body.userName,
  }); 
})


// 管理后台登录
router.post("/admin_login", (req, res) => {
  if(req.body.userName == 'admin' && req.body.password == 'admin'){
    res.json({
      status: "success",
      info: "你真棒~"
    })
  } else {
    res.json({
      status: "error",
      info: "再好好想想,admin..."
    })
  }
})

// 商品管理~~~~   此为管理后台接口

// 1、获取商品信息
router.get('/admin/products', async function(req, res, next) {
  // const products = await Product.find({})
  // console.log(Product)
  async function getAllProductFilter(query) {
    const productCount = await Product.countDocuments({});
    console.log(productCount);
    var page = req.body.page;
    var per = req.body.per;
    const products = await Product.find({}).skip((page-1) * per).limit(per);
    console.log(products);
    const pageCount = Math.ceil(productCount / per); // 总页数
    var list = await Product.find(query);
    console.log(list);
    console.log(per);
    if(!req.body.per || !req.body.page || !req.body.name) {
      res.json({
        status: 'error',
        info: '每页显示数量、当前页码、匹配名必填~'
      })
      return;
    }else if (list == false) {
      res.json({
        status: 'error',
        info: {
          productCount,    // 总数
          pageCount,       // 总页数
          page,            // 当前页
          list: '匹配不到关键字~'  // 商品数据
        }     
      })
    } else {
      res.json({
        status: 'success',
        info: {
          productCount,    // 总数
          pageCount,       // 总页数
          page,            // 当前页
          list,            // 商品数据
        }          
      })
    }   
  }
  getAllProductFilter({
    name: new RegExp(req.body.name), // 模糊查找,使用正则表达式
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
})



// 2、商品新增
router.post('/admin/products', async (req, res) => {
  async function addProductToDbFun(query) {
    try{
      const count = await Product.countDocuments({name: query});
      if( count > 0 ) {
        res.json({
          status: 'error',
          info: '商品已存在~'
        })
        return;
      } else {
        if(!req.body.name || !req.body.descriptions || !req.body.coverImg ||  !req.body.price || !req.body.content || !req.body.quantity) {
          res.json({
            status: 'error',
            info: '名字、描述、封面图、价格、详情、库存必填项~'
          })
          return;
        } else {
          console.log('执行插入操作!');
          const pt = new Product()
          pt.name = req.body.name;
          pt.descriptions = req.body.descriptions;
          pt.coverImg = req.body.coverImg;
          pt.price = req.body.price;
          pt.content = req.body.content;
          pt.quantity = req.body.quantity;
          const result = await pt.save();
          console.log(result);
          res.json({
            status: 'success',
            info: '新增成功~'
          })
        }
      }
    } catch(err) {
      console.log(err);
    }  
  }
  addProductToDbFun(req.body.name);
})



// 因为从前台来讲 数据库的信息是展示出来的 都是通过商品去调取id 不存在id格式写错, 
// 通过点击相应商品去获得id, 如果不是用户去修改的话, id是不应该错的
// 所以只需要去判断id是否在数据库中存在  修改删除逻辑都一样

// 3、商品修改
router.put ('/admin/products/:id', async (req, res) => {
  console.log(req.params.id);
  const Id = await Product.countDocuments({_id: req.params.id});
  console.log(Id);
  if( Id < 1 ) {
    res.json({
      status: 'error',
      info: '商品不存在修改失败~ '
    })
    return;
  } else {
    // const id = req.params.id;
    // const product = await Product. findById(id);
    // console.log(product);
    Product.findOneAndUpdate({
      _id: req.params.id,
    }, {
      name: req.body.name,
      descriptions: req.body.descriptions,
      coverImg: req.body.coverImg,
      price: req.body.price,
      content: req.body.content,
      quantity: req.body.quantity,
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    res.json({
      status: 'success',
      info: '修改成功~'
    })
  }
})


// 4、商品删除
router.delete('/admin/products/:id', async(req, res) => {
  const Id = await Product.countDocuments({_id: req.params.id});
  console.log(Id);
  if( Id < 1 ) {
    res.json({
      status: 'error',
      info: '商品不存在删除失败~ '
    })
    return;
  } else {
      const delproducut = await Product.findByIdAndDelete({_id:req.params.id},(err, docs) => {
      res.json({
        status: 'success',
        info: '删除成功~'
      })
    })
  }
});

module.exports = router;
var db = require('../../../db');
var Product = db.model('product');
var router = require('express').Router();
var Review = db.model('review');

//get Product reviews by product id
router.get("/:id/reviews", function(req,res,next){
	Review.findAll({where:{productId: req.params.id}})
	.then(function(reviews){
		return res.status(200).send(reviews);
	})
	.catch(next);
})

//get Product by id
router.get('/:id', function(req,res,next){
	Product.findOne({where: {id: req.params.id}})
	.then(function(returnedProduct){
		return res.status(200).send(returnedProduct);
	})
	.catch(next);
});

//get all products by status
router.get('/:status', function(req,res,next){
	Product.findAll({where: {status: req.params.status}})
	.then(function(selectedProducts){
		return res.status(200).send(selectedProducts);
	})
	.catch(next);
})

//get all Products
router.get('/', function(req,res,next){
	Product.findAll({})
	.then(function(allProducts){
		return res.status(200).send(allProducts);
	})
	.catch(next);
});

//Add a product
router.post('/', function(req,res,next){
	Product.create(req.body)
	.then(function(createdProduct){
		return res.status(201).send(createdProduct);
	})
	.catch(next);
});

//Update a product's stock and/or status where req.body = {status: 'out of stock', stock: 0}
router.put('/:id', function(req,res,next){
	Product.update(req.body, {where: {id: parseInt(req.params.id)}, returning:true})
	.then(function(updatedProduct){
		return res.status(200).send(updatedProduct);
	})
})

module.exports = router;


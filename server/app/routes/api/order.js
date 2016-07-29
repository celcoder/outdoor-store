var db = require('../../../db');
var Order = db.model('order');
var Product = db.model('product');
var router = require('express').Router();
var ProductOrder = db.model('productOrder');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

var isCorrectUser = function(req) {
	return (parseInt(req.params.userId) === req.user.id);
}

var isAdmin = function(req) {
	return req.user.admin;
}

//Retrieve or Create a Cart for this user
router.get('/:userId/cart', ensureAuthenticated, function(req, res, next) {
	if (!isAdmin(req) && !isCorrectUser(req)) return res.sendStatus(401);
	Order.findOrCreate({where:{userId: req.params.userId, status: 'cart'}})
	.spread(function (cart, created) {
		return res.status(200).send(cart);
	})
	.catch(next);
});

//Gets all orders associated with one user id
router.get('/:userId/all', ensureAuthenticated, function(req, res, next) {
	if (!isAdmin(req) && !isCorrectUser(req)) return res.sendStatus(401);
	Order.findAll({where:{userId: req.params.userId}})
	.then(function (orders) {
		if (!orders.length) return res.sendStatus(400);
		else return res.status(200).send(orders);
	})
	.catch(next);
});

//Gets all orders associated with one user id
router.get('/:userId/orderhistory', ensureAuthenticated, function(req, res, next) {
	if (!isAdmin(req) && !isCorrectUser(req)) return res.sendStatus(401);
	Order.findAll({where:{userId: req.params.userId, status: { $ne: 'cart'}}})
	.then(function (orders) {
		if (!orders.length) return res.status(200).send([]);
		else return res.status(200).send(orders);
	})
	.catch(next);
});

//Gets a single order by id
router.get('/:userId/:id', ensureAuthenticated, function(req, res, next) {
	if (!isAdmin(req) && !isCorrectUser(req)) return res.sendStatus(401);
	Order.findById(req.params.id)
	.then(function (order) {
		if (!order) return res.sendStatus(400);
		else return res.status(200).send(order);
	})
	.catch(next);
});


//Gets all orders in database  ***note: This is an ADMIN privelege!***
router.get('/', ensureAuthenticated, function(req, res, next) {
	if (!isAdmin(req)) return res.sendStatus(401);
	Order.findAll({})
	.then(allOrders => res.status(200).send(allOrders))
	.catch(next);
})

//Empty Cart or Cancel un-shipped Order
//NEED TO FIX CALL TO ISCORRECT BECAUSE REQ.BODY NOT PARAMS
router.delete('/:id', ensureAuthenticated, function(req,res,next){
	if (!isAdmin(req) && !isCorrectUser(req)) return res.sendStatus(401);
	Order.findById(req.params.id)
	.then(function(returnedOrder){
		if (returnedOrder.status === 'cart') {
			return returnedOrder.destroy()
			.then(function(){
				return Order.create({status:'cart', userId: req.user.id})
			})
			.then(function(){
				return res.status(200).send('Cart Emptied');
			})
		}
		else if (returnedOrder.status === 'ordered') {
			return returnedOrder.destroy()
			.then(function(){
				return res.status(200).send('Order Deleted');
			})
		}
		else {
			return res.sendStatus(400);
		}
	})
	.catch(next);
})

//Update Quantity of an Item to the Cart with req.body
//req.body has productStock, productId, quantityChange
//req.params has userId

router.put("/:userId/updateCart", ensureAuthenticated, function(req,res,next){
	//Check that only the correct user can edit the cart
	if (!isCorrectUser(req)) return res.sendStatus(401);

	var thisOrder;
	var newStock;
	//GET STOCK FROM PRODUCT IN DB, NOT FROM FRONT END.

	Product.findOne({where:{id:req.body.productId}})
	.then(function(product){
		newStock = product.stock-req.body.quantityChange;
		//Check if the change in number exceeds stock, and reject request
		if (newStock < 0) return res.sendStatus(400);

		//find Order by UserId and status 'cart'
		Order.findOne({where:{userId: req.params.userId, status:'cart'}})
		.then(function(order){
			thisOrder = order;
			//find cartItem by order and productId
			return ProductOrder.findOne({where:{productId:req.body.productId, orderId: order.id}})
		})
		.then(function(cartItem){
			//if no cart item already, create it!!
			if (!cartItem) return thisOrder.addProduct(req.body.productId);
			//if cartItem would zero or less than zero items, remove from cart
			if (cartItem.quantity+req.body.quantityChange < 1) {
				return cartItem.destroy()
			}
			//else update the number of items
			else {
				return cartItem.update({quantity: (cartItem.quantity+req.body.quantityChange)})
			}
		})
		.then(function(){
			//also update the stock amount
			return Product.update({stock: newStock},{where:{id:req.body.productId}});
		})
		.then(function(){
			return res.sendStatus(204);
		})
		.catch(next);

	})
	.catch(next);

})


//Change Order Status to "ordered" from "cart" and create a new cart. Return both to front-end.
router.put('/:userId/:id/purchase', ensureAuthenticated, function(req,res,next){
	if (!isCorrectUser(req)) return res.sendStatus(401);
	Order.findById(req.params.id)
	.then(function(returnedOrder){
		if (returnedOrder.status !== 'cart') return res.sendStatus(401);
		else {
			return returnedOrder.update({status: 'ordered'},{returning:true})
				.then(function(updatedOrder){
					return Order.create({})
						.then(function(newCart){
						return [updatedOrder, newCart]
						})
				})
		}
	})
	.catch(next);
})

//Admin change order status req.body must be {status: ''}
//NEED TO FIX CALL TO ISCORRECT BECAUSE REQ.BODY NOT PARAMS
router.put('/:id/status', ensureAuthenticated, function(req,res,next){
	if (!isAdmin(req)) return res.sendStatus(401);
	Order.update(req.body,{where:{id:req.params.id}, returning: true})
	.then(function(updatedOrder){
		return req.status(200).send(updatedOrder);
	})
	.catch(next);
})

//Adding



module.exports = router;








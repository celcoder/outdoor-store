var db = require('../../../db');
var Order = db.model('order');
var router = require('express').Router();

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

//Gets all orders associated with one user id
router.get('/all', ensureAuthenticated, function(req, res, next) {
	if (!req.user.admin && req.body.userId !== req.user.id) return res.sendStatus(401);
	Order.findAll({userId: req.body.userId})
	.then(function (orders) {
		if (!orders.length) return res.sendStatus(400);
		else return res.status(200).send(orders);
	})
	.catch(next);

});

//Gets a single order by id
router.get('/:id', ensureAuthenticated, function(req, res, next) {
	if (!req.user.admin && req.body.userId !== req.user.id) return res.sendStatus(401);
	Order.findById(req.params.id)
	.then(function (order) {
		if (!order) return res.sendStatus(400);
		else return res.status(200).send(order);	
	})
	.catch(next);
});


//Gets all orders in database  ***note: This is an ADMIN privelege!***
router.get('/', ensureAuthenticated, function(req, res, next) {
	if (!req.user.admin) return res.sendStatus(401);
	Order.findAll({})
	.then(allOrders => res.status(200).send(allOrders))
	.catch(next);
})

//Empty Cart or Cancel un-shipped Order
router.delete('/:id', ensureAuthenticated, function(req,res,next){
	if (!req.user.admin && req.body.userId !== req.user.id) return res.sendStatus(401);
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

//Change Order Status to "ordered" from "cart" and create a new cart. Return both to front-end.
router.put('/:id/purchase', ensureAuthenticated, function(req,res,next){
	if (req.body.userId !== req.user.id) return res.sendStatus(401);
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
router.put('/:id/status', ensureAuthenticated, function(req,res,next){
	if (!req.user.admin) return res.sendStatus(401);
	Order.update(req.body,{where:{id:req.params.id}, returning: true})
	.then(function(updatedOrder){
		return req.status(200).send(updatedOrder);
	})
	.catch(next);
})

//Adding 



module.exports = router;








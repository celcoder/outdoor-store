var router = require('express').Router();
var db = require('../../../db');
var User = db.model('user');
var Review = db.model('review');

//<-------- another solution to error handling plus making our routers lean -------->//
router.param('id', (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).send("Error!")
      }
    })
    .catch(next);
});

//get Product reviews by user id
router.get("/:id/reviews", function(req,res,next){
  Review.findAll({where:{userId: req.params.id}})
  .then(function(reviews){
    return res.status(200).send(reviews);
  })
  .catch(next);
})


// Get all users
router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => res.json(users))
    .catch(next);
});

// Get one user
router.get('/:id', (req, res, next) => {
  res.json(req.user);
})

// Find or create one user
router.post('/', (req, res, next) => {
  User.findOrCreate(req.body)
    .spread((user, created) => {
      if (!created) res.status(302).json(user);
      else res.status(201).json(user);
    })
    .catch(next);
})

// Updating user information
// Test this route to make sure the
// updated user is returned
router.put('/:id', (req, res, next) => {


   User.update(req.body, {where:{id:req.params.id}, returning:true})    //not sure if this would work?
   .then(user => res.status(201).json(user))
   .catch(next); 

})

// Delete a user
router.delete('/:id', (req, res, next) => {
  req.user.destroy()
    .then(() => res.status(204).send('user was deleted'))
    .catch(next);


});

module.exports = router;

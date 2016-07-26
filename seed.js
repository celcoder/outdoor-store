/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Category = db.model('category');
var Order = db.model('order');
var Product = db.model('product');
var _ = require('lodash');

var Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password',
            admin: false
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',
            admin: false
        },
        {
            email: 'chris@gmail.com',
            password: 'chris',
            admin: false
        },
        {
            email: 'ethan@gmail.com',
            password: 'ethan',
            admin: true
        },
        {
            email: 'zeke@zeke.zeke',
            password: '123',
            admin: true 
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers)
};

var seedProducts = function () {

    var products = [
        {
            name: "Patagonia Houdini Jacket - Men's",
            status: "available",
            price: 99.99,
            description: "Offering ultralight and water-resistant protection from the elements, this men's running shell features an adjustable hood, and stuffs into its own zippered chest pocket."
        },
        {
            name: "Arc'teryx Epsilon LT Jacket - Men's",
            status: "available",
            price: 199.99,
            description: "Appropriate for almost any outdoor activity, the men's Arc'teryx Epsilon LT Jacket combines the moderate mid-layer warmth of fleece with the durable woven face of a soft shell."
        },
        {
            name: "The North Face ThermoBall Full-Zip Jacket - Men's",
            status: "available",
            price: 199.99,
            description: "For lightweight, cold-weather comfort, wear the men's ThermoBall™ Full-Zip Jacket. It's as warm and compressible as goose down, yet insulates even when wet."
        },
        {
            name: "KUHL Renegade Shirt - Men's",
            status: "available",
            price: 70.00,
            description: "Button up the travel-ready Kuhl Renegade shirt and set out on a grand adventure."
        },
        {
            name: "Columbia Silver Ridge Plaid Long-Sleeve Shirt - Men's",
            status: "available",
            price: 41.93,
            description: "An ideal accompaniment to sweating it out in the spring chill, the shirt blends blends simple aesthetics and progressive performance elements."
        },
        {
            name: "SmartWool Midweight Crew Top - Wool - Men's",
            status: "available",
            price: 95.00,
            description: "Perfect for layering or extra warmth during activity in cool weather, the men's SmartWool Midweight Crew top offers natural stretch and breathability."
        },
        {
            name: "Outdoor Research Helium Rain Pants - Men's",
            status: "available",
            price: 119.00,
            description: "The 5.4 ounce, Pertex® Shield+™ Helium Pants come with all the waterproof performance and lightweight packable protection you'll need in a serious deluge."
        },
        {
            name: "Marmot PreCip Full-Zip Rain Pants - Men's Short",
            status: "available",
            price: 99.99,
            description: "If storm clouds let loose on your hike, you'll be glad you packed the waterproof Marmot PreCip® Full-Zip Rain Pants - Men's Short with new, highly breathable NanoPro™ technology."
        },
        {
            name: "Patagonia Baggies Longs Shorts - Men's",
            status: "available",
            price: 49.00,
            description: "These up-for-anything Baggies Longs are made of sturdy Supplex® nylon and have a quick-drying mesh liner and elasticized waistband for excellent performance both in and out of the water."
        },
        {
            name: "Patagonia Print Wavefarer Board Shorts - Men's",
            status: "available",
            price: 54.48,
            description: "Lightweight, durable and tough enough to take a run-in with the rocks, the men's Patagonia Wavefarer Board Shorts are the ultimate go-anywhere, do-anything surf trunks."
        },
        {
            name: "Osprey Atmos 65 AG Pack",
            status: "available",
            price: 259.95,
            description: "Starting with a dreamlike Osprey suspension, this multiday pack carries gear easily in 9 external pockets, enhancing mobility and comfort while toting heavier loads through the backcountry."
        },
        {
            name: "CamelBak Rogue Hydration Pack",
            status: "available",
            price: 52.49,
            description: "Easy to refill without removing the reservoir, the CamelBak Rogue hydration pack melds an efficient low-profile silhouette with enough storage for a couple of hours on your bike."
        },
        {
            name: "Big Agnes Copper Spur UL 2 Tent",
            status: "available",
            price: 429.95,
            description: "With a trail weight of 2 lbs. 12 oz., the updated Big Agnes Copper Spur UL2 tent lets you and a friend enjoy a gossamer-light load and plenty of living space on your 3-season adventures."
        },
        {
            name: "NEMO Galaxi 2 Tent with Footprint",
            status: "available",
            price: 249.95,
            description: "The spacious, 3-season NEMO Galaxi 2 Tent offers quality and innovation at an affordable price, with a great suite of fabrics and hardware that creates an intuitive tent design for 2 backpackers."
        },
        {
            name: "The North Face Furnace 20 Sleeping Bag",
            status: "available",
            price: 189.90,
            description: "This down-insulated sleeping bag has a less-tapered cut than a standard backpacking mummy bag, giving you more room to move around on your spring, summer and fall adventures."
        },
        {
            name: "Kelty Cosmic Down 0 Sleeping Bag",
            status: "available",
            price: 239.95,
            description: "Built for winter backpacking, the Cosmic Down 0 sleeping bag is filled with 600-fill DriDown™ that resists moisture, dries fast, maintains loft and compresses small."
        },
        { name: "The North Face Fastpack Wind Jacket - Women's", status: 'available', price: 68.73, description: "Head for the hills with the lightweight, packable Fastpack Wind Jacket from The North Face that features a highly wind-resistant exterior and a comfortable waist cinch." },
        { name: "Arc'teryx Psiphon SL Pullover - Women's - 2016 Closeout", status: 'available', price: 103.73, description: "Created specifically for women facing the harsh environments encountered in rock and alpine climbing, the Psiphon SL provides essential protection from wind and rain." },
        { name: "Marmot Trail Wind Hoodie - Women's", status: 'available', price: 50.73, description: "The Marmot Trail Wind hoodie is four ounces of weather-resistant protection. It's perfect for everything from springtime summits to daily jogs through your neighborhood." },
        { name: "prAna Silvana Board Shorts - Women's", status: 'available', price: 55.00, description: "The prAna Silvana Board Shorts bring mindful style to the ocean this summer. Recycled polyester is the foundation of performance fabric that's water-resistant, quick drying and protects against sun." },
        { name: "Patagonia Strider Shorts - Women's", status: 'available', price: 45.00, description: "Blending fast-drying polyester with breathable, open-mesh fabric, these ultralight shorts offer optimal ventilation and comfort on roads, trails and any terrain turned into your personal playground." },
        { name: "KUHL Kendra Pants - Women's", status: 'available', price: 65.00, description: "A travel-smart blend of soft cotton and quick-dry nylon, the stretchy women's Kuhl Kendra Pants take you in comfort wherever you may roam." },
        { name: "lucy Get Going Capris - Women's", status: 'available', price: 79.00, description: "These fast-drying capris wrap your legs in stretchy, lightweight comfort so you can quickly find your groove in the yoga studio or while warming up at the barre." },
        { name: "REI Sahara Long-Sleeve Shirt - Women's", status: 'available', price: 54.50, description: "The women's REI Sahara Long-Sleeve Shirt provides comfort, ventilation and adjustable coverage for hiking in warm climates." },
        { name: "Royal Robbins Expedition Stretch 3/4-Sleeve Shirt - Women's", status: 'available', price: 68.00, description: "This lightweight shirt features clean lines and high-performance traits: it resists wrinkles, wicks moisture, dries fast and gives you UPF 40+ sun protection as you explore the outdoors." },    
        { name: "SmartWool Midweight Long-Sleeve Zip-T Top - Wool - Women's", status: 'available', price: 69.93, description: "The SmartWool Midweight Zip-T top for women offers natural stretch, insulation and breathability during stop-and-go activities in fluctuating temperatures." },
    ];

    var creatingProducts = products.map(function (productObj) {
        return Product.create(productObj);
    });

    return Promise.all(creatingProducts);

};

var seedOrders = function () {

    var orders = [{status: 'ordered'},{status: 'shipped'},{status: 'ordered'},{status: 'ordered'},{status: 'shipped'},{status:'delivered'},{status:'delivered'},{status:'delivered'},{status:'delivered'},{status:'delivered'},{},{},{},{},{},{},{},{}];

    var creatingOrders = orders.map(function (orderObj) {
        return Order.create(orderObj)
        .then(function(newOrder){
            return User.findAll({})
            .then(function(allUsers){
                var random = Math.floor(Math.random()*(allUsers.length));
                return newOrder.setUser(allUsers[random])
                .then(function(){
                    return Product.findAll({})
                    .then(function(allProducts){
                        var randomProducts = _.sample(allProducts, 4);
                        return Promise.all([newOrder.addProducts(randomProducts)]);
                    })
                })
            })
        })
    });

    return Promise.all(creatingOrders)
};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function(){
        return seedProducts();
    })
    .then(function(){
        return seedOrders();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });

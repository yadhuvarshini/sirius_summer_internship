const isLoggedIn = require('../middleware/middleware')
var additem = require("../model/additem");
const catchasync = require('../utils/catchAsync');
const expresserror = require('../utils/expresserror');
const express = require('express');
const router = express.Router();

const stripe = require('stripe')('sk_test_51Ld4zhSBGOjrbN9PbNrNns1BILEnkCi9wjwD3mA4fIEI8mHX891US5u8eEw2WE4ZdXLkxEptEHfPNbaalLqQO64300DKHdv6VC');


router.get('/', isLoggedIn , function(req,res) {
    additem.find({},function(err,additem) {
       if(err){
          throw new expresserror("invalid",404)
       } else {
           res.render("home", {additems:additem});
       }
   })
   
});

router.post("/",isLoggedIn ,function(req,res){
   var name = req.body.name;    
   var manufacturer = req.body.manufacturer;
   var category = req.body.category;
   var rating = req.body.rating;
   var price = req.body.price;
   var image = req.body.image; 
   var about = req.body.about;
   var newHome = {name:name,manufacturer:manufacturer,category:category,rating:rating,price:price,image:image,about:about}
   
       additem.create(newHome, function(err,newlycreated) {
           if(err) throw new expresserror("invalid", 404)
           res.redirect("/home");

       });
});

router.get("/new", isLoggedIn , function(req,res) {
   res.render('new.ejs'); 
}); 

router.post("/:id", isLoggedIn , function(req,res){
   if(!req.params.id) throw new expresserror('Invalid Data', 400);
   additem.findById(req.params.id,function(err, foundadditem){
       if(err) console.log(err); 
       else {   
           res.render("show", {additems:foundadditem});
       } 
   }); 
}); 

router.get('/:id/edit', isLoggedIn , async(req,res)=> { 
   additem.findById(req.params.id , function(err, foundcampground) {
       try{
           res.render("edit",{additems:foundcampground});
       }
       catch(e){
           next(e);
       }
   });   
});

router.put('/:id', isLoggedIn , catchasync(async(req,res) => {
   if(!req.params.id) throw new expresserror('Invalid Data', 400);
    await additem.findByIdAndUpdate(req.params.id, req.body.home,)
    res.redirect("/home")
}));   
           

router.get('/:id', isLoggedIn , async(req,res)=> {
   if(!req.params.id) throw new expresserror('Invalid Data', 400);
   const additems = await additem.findById(req.params.id);
   res.render('show', {additems})
});
   

router.delete("/:id", isLoggedIn , catchasync(async(req,res) => {
  const id = req.params.id;
  await additem.findByIdAndDelete(id);
  res.redirect('/home');
}));

router.get('/:id/checkout', isLoggedIn , async(req,res)=> { 
    additem.findById(req.params.id , function(err, foundcampground) {
        try{
            res.render("checkout.ejs",{additems:foundcampground});
        }
        catch(e){
            next(e);
        }
    });   
 });
module.exports = router;
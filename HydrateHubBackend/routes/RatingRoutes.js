const express = require('express');
const router = express.Router();
const Rating =require('../models/RatingModel')


router.put('/save-rating', async(req,res)=>{
    const {pId, rating ,userId, user, review, p}= req.body;
    try{
        let ratings= await Rating.findOne({userId, pId})
        if (ratings){
            ratings.rating=rating;
            ratings.review=review;
            await ratings.save();
        }
        else{
            ratings= new Rating({
                pId,
                rating,
                userId,
                user,
                review,
                p
            });
            await ratings.save();
        }
        
        
        res.status(200).json({ message: 'Review submitted successfully!' });
    }
    catch(error){
        console.log(error);
        res.status(400).json({ error: error.message });
    }
    
})


router.get('/get-rating/:pId', async(req,res)=>{

    const {pId}=req.params;
    try{
        const ratings=await Rating.find({pId})
        res.status(200).json(ratings);
    }
    catch(error){
        console.log(error);
        res.status(400).json({ error: error.message });
    }
})


module.exports = router;

const express=require("express");
const { userAuth } = require("../Middlewares/user.auth");
const postModel = require("../Model/PostModel");



// cat_name
// "Whiskers"
// age
// 2
// breed
// "Domestic Shorthair"
// color
// "Tabby"
// gender
// "Male"
// size
// "Medium"
// description
// "Whiskers is a friendly and playful two-year-old male cat. He has a bea…"
// adoption_fee
// "$50"
// location
// "los angeles,california"
// image_url


const postRouter=express.Router();

    postRouter.post("/add",userAuth,async(req,res)=>{
        try {
           
           if(req.body.type=="cat"){
            const obj={
                cat_name:req.body.cat_name,
                age:req.body.age,
                breed:req.body.breed,
                location:req.body.location,
                image_image:req.body.image_image,
                adoption_price:req.body.adoption_price,

                userID:req.body.userID,
                userName:req.body.userName,
                user_location:req.body.user_location
            }
           }
           else{
            const obj={
                pet_name:req.body.pet_name,
                pet_breed:req.body.pet_breed,
                pet_age:req.body.pet_age,
                pet_location:req.body.pet_location,
                pet_image:req.body.pet_image,
                pet_price:req.body.pet_price,

                userID:req.body.userID,
                userName:req.body.userName,
                user_location:req.body.user_location
            }
            console.log(obj)
           }
            const userpost= postModel(obj);
            await userpost.save()

                res.status(200).json({msg:"Pet Added successfully",userpost})
        

        } catch (error) {
            res.status(400).json({error:error.message})

        }

    })


    postRouter.get("/", userAuth, async (req, res) => {
        try {
        const { userID } = req.body;

        const userPostData = await postModel.find({ userID });
        // await userPostData.save();

        res.status(200).json({ data: userPostData });

        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    });

    postRouter.delete("/delete/:postID",async (req, res) => {
        try {
        const {postID}  = req.params;

        if (!postID) {
            return res.status(400).json({ error: "Missing postID in the request body" });
        }

        const deletedPost = await postModel.findByIdAndDelete(postID);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ msg: "Post deleted successfully",});
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    });

    postRouter.patch("/patch/:postID",async (req, res) => {
        try {
        const {postID}  = req.params;

        if (!postID) {
            return res.status(400).json({ error: "Missing postID in the request body" });
        }

        const updatedPost = await postModel.findByIdAndUpdate(postID, {status:true});

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ msg: "Post Updated successfully",});
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    });
  
module.exports={postRouter}
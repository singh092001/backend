const express=require("express");
const { userAuth } = require("../Middlewares/user.auth");
const postModel = require("../Model/PostModel");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
    user: 'PetsConnect1995@gmail.com',
    pass: 'mabifluxuxvdrwrd'
  }
});

const postRouter=express.Router();

    postRouter.post("/add",userAuth,async(req,res)=>{
        try {
           const {user_Email, userName} = req.body
        //    console.log(user_Email)
            const obje={
                pet_name:req.body.pet_name,
                pet_breed:req.body.pet_breed,
                pet_age:req.body.pet_age,
                pet_location:req.body.pet_location,
                pet_image:req.body.pet_image,
                pet_price:req.body.pet_price,

                userID:req.body.userID,
                userName:req.body.userName,
                user_location:req.body.user_location,
                userEmail:req.body.user_Email
            }
            const userpost= postModel(obje);
            await userpost.save()


            const mailOptions = {
                from: 'PetsConnect1995@gmail.com',
                to: user_Email ,
                subject: 'One Step Towards Your Pet Adoption',
                html: 
                  `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${userName},</h2>
                    <p>Thank You So Much For Choosing Us To Start Your Adoption Journey We Are Glad To Help You Out:</p>
                    <p>We Have Given You The Deatils Of Your Adoption Below:</p>
                    <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                      <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;">Pet Name</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${userpost.pet_name}</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;">Breed:</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${userpost.pet_breed}</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;">Price:</td>
                        <td style="border: 1px solid #ccc; padding: 8px;"> $ ${userpost.pet_price}</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;">Pet's Location :</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${userpost.pet_location}</td>
                      </tr>
                    </table>
                    <p>Please log in to your account for more details and to know the status of your adoption</p>

                    <div>
                        <a href="#">Click Here To Visit Home Page</a>
                    </div>
                  </div>`
                ,
              };
             // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email.' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully.', msg:"Pet Added successfully",userpost:userpost });
        });

        

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
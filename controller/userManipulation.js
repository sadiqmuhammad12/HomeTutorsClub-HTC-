const User = require("../model/userModel");
const express = require("express");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const proposal = require("../model/postProposal");
//const validateLogin = require('../utils/validateLogin');
const config = require("../config");
const { realpathSync } = require("fs");
const client = require("twilio")(config.AccountSID,config.AuthToken)


// Login and verification of phone Number
router.get("/login_phone_no", (req,res) => {
  client
  .verify
  .services(config.SERVICEID)
  .verifications
  .create({
    to : `+${req.query.phonenumber}`,
    channel : req.query.channel
  })
  .then((data) => {
    res.status(200).send(data)
  })

})

router.get("/verify", (req,res) => {
  client
  .verify
  .services(config.SERVICEID)
  .verificationChecks
  .create({
    to : `+${req.query.phonenumber}`,
    code : req.query.code
  })
  .then((data) => {
    res.status(200).send(data)
  })

})


//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    mobile_no: req.body.mobile_no,
    DOB: req.body.DOB,
    profile_status: req.body.profile_status,
    cnic: req.body.cnic,
    gender: req.body.gender,
    Address: req.body.Address,
    link: req.body.link,
    header: req.body.header,
    About_summary: req.body.About_summary,
    work_experience: req.body.work_experience,
    education: req.body.education,
    img: req.body.img,
    post_proposal: req.body.post_proposal,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    var addMessage2 = { Result: "User exist" };
    // console.log(userExist);
    return res.status(201).json({ Result: "User already exist in this email" });
  }
  
  try {
    const user = await newUser.save();
    var addMessage1 = { Result: "Registration success" };
    res.status(200).json({ Result: "user register successfully"});
  } catch (err) {
    res.status(500).json(err);
  }
});

// //LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    !user && res.status(401).json("Wrong password or username!");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Wrong password or username!");

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "90d",
    });

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});



//Read data from user table for the specific user
router.get("/find/:_id", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params._id });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Search according to student
router.get("/find_student", async (req, res) => {
  try {
    const user = await User.find({ profile_status: "Student" },{username:1,email:1,profile_status:1,gender:1,cnic:1,img:1});

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Search according to tutor
router.get("/find_tutor", async (req, res) => {
  try {
    const user = await User.find({ profile_status: "Tutor" },{username:1,email:1,profile_status:1,gender:1,cnic:1,img:1});

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Read all user
router.get("/find", async (req, res) => {
  try {
    const user = await User.find();
    //all user
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Read Data from user some basic information

// User Profile Registration
router.put("/AddUser_Info/:_id", async (req, res) => {
  try {
    const updateData = await User.findByIdAndUpdate(
      { _id: req.params._id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// User work experience and education
// router.put("/work_experience_education/:_id", async (req, res) => {

//   try {
//    const updateData = await User.findOneAndUpdate({_id:req.params._id},
//     { $push: {work_experience : req.body.work_experience, education : req.body.education},},
//    {new: true})

//     res.status(200).json(updateData);

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Create Work Experience
router.put("/create_work_experience/:_id", async (req, res) => {
  try {
    const updateData = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $push: { work_experience: req.body.work_experience } },
      { new: true }
    );

    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create Education
router.put("/create_education/:_id", async (req, res) => {
  try {
    const updateData = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $push: { education: req.body.education } },
      { new: true }
    );

    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create Post Proposal
// router.put("/create_postProposal/:_id", async (req, res) => {
//   try {
//     const updateData = await User.findOneAndUpdate(
//       { _id: req.params._id },
//       { $push: { post_proposal: req.body.post_proposal } },
//       { new: true }
//     );

//     res.status(200).json(updateData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// delete a user
router.delete("/delete_user/:_id", async (req, res) => {
  try {
    const delete_user = await User.findById(req.params._id);
    if (delete_user._id) {
      await delete_user.deleteOne();
      res.status(200).json(" Education has been deleted");
    } else {
      res.status(500).json("You can delete only user Education");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// Read all user Post proposal
router.get("/find_postProposal", async (req, res) => {
  try {
    const postProposal = await User.find({}, { post_proposal: 1 });

    res.status(200).json(postProposal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // delete a post proposal
// router.delete("/delete_postProposal/:_id", async (req, res) => {
//   try {
//     const updateData = await User.findOneAndUpdate(
//       { _id: req.params._id },
//       // { $pull: {"post_proposal" : {post_title : "jamal"}},},
//       { $pull: { post_proposal: { _id: req.body._id } } },
//       { new: true }
//     );

//     res.status(200).json(updateData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// delete a user Experience
router.delete("/delete_workExperience/:_id", async (req, res) => {
  try {
    const updateData = await User.findOneAndUpdate(
      { _id: req.params._id },
      // { $pull: {"post_proposal" : {post_title : "jamal"}},},
      { $pull: { work_experience: { _id: req.body._id } } },
      { new: true }
    );

    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user education
router.delete("/delete_education/:_id", async (req, res) => {
  try {
    const updateData = await User.findOneAndUpdate(
      { _id: req.params._id },
      // { $pull: {"post_proposal" : {post_title : "jamal"}},},
      { $pull: { education: { _id: req.body._id } } },
      { new: true }
    );

    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Read profile status and display on post type
router.get("/read_profile_status/:_id", async (req, res) => {
  try {
    const postProposal = await User.findOne(
      { _id: req.params._id },
      { profile_status: 1, _id: 0 }
    );

    res.status(200).json(postProposal);

    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post('/upload', (req,res) => {
//   const file = req.files.photo;
//   file.mv("./uploads/" +file.name, function(err,result){
//     if(err)
//         throw err;
//       res.send({
//           success : true,
//           message : "File Upload"
//         });
//   })
// })

router.put("/:id/follow", async (req,res) => {
  if(req.body._id !== req.params.id)
  {
     try{
        const user = await User.findById(req.params.id); //jan
        const currentUser = await User.findById({_id :req.body._id});//jon
        if(!user.favourits.includes(req.body._id)){
           await user.updateOne({$push : { favourits : currentUser}});
          //  await currentUser.updateOne({ $push : {followins : req.params.id}});
           res.status(200).json("User has been follwed");
        }
        else{
           res.status(203).json("You already follwed this user");
        }
     }
     catch(err)
     {
        res.status(500).json(err);
     }
  }
  else{
     res.status(203).json("You can follow yourself");
  }
})
module.exports = router;

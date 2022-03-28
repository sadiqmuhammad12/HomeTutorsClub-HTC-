const router = require("express").Router();
const proposal = require("../model/postProposal");

router.post("/create_postProposal", async (req, res) => {
  const newPost = new proposal({
    user_id: req.body.user_id,
    post_title: req.body.post_title,
    post_subject: req.body.post_subject,
    post_depart: req.body.post_depart,
    post_price: req.body.post_price,
    post_time: req.body.post_time,
    post_location: req.body.post_location,
    post_description: req.body.post_description,
    post_userData: req.body.post_userData,
    post_geoLocation: req.body.post_geoLocation,
    post_type: req.body.post_type,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Read  user Post proposal with user_id
router.get("/find_postProposal", async (req, res) => {
  try {
    const postProposal = await proposal.find({ user_id: req.body.user_id });

    res.status(200).json(postProposal);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post proposal
router.delete("/delete_postProposal/:_id", async (req, res) => {
  try {
    const delete_proposal = await proposal.findById(req.params._id);
    if (delete_proposal._id) {
      await delete_proposal.deleteOne();
      res.status(200).json(" Proposal has been deleted");
    } else {
      res.status(500).json("You can delete only user Proposal");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Read all user Post proposal
router.get("/read_all_postProposal", async (req, res) => {
  try {
    const postProposal = await proposal.find();

    res.status(200).json(postProposal);
  } catch (err) {
    res.status(500).json(err);
  }
});

    // // Read proposal according to attribute
    // router.get("/search_post", async (req, res) => {
    //   try {
    //     const postProposal = await proposal.find({
    //     // {post_title: {$regex : req.body.post_title, $options : "i"}}
    //       $or: [
    //         {
    //           post_title: {$regex : req.body.post_title, $options : "i"}
    //         },
    //         {
    //           post_subject : {$regex : req.body.post_subject, $options : "i"}
    //         },
    //         {
    //           post_location: {$regex : req.body.post_location, $options : "i"}
    //         },
    //         {
    //           post_depart: {$regex : req.body.post_depart, $options : "i"}
    //         }
    //       ]
    //     }
    //     );
    
    //     res.status(200).json(postProposal);
    //   } catch (err) {
    //     res.status(500).json(err);
    //   }
    // });
module.exports = router;

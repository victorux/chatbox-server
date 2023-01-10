const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password){
        if(!req.body.oldPassword){res.status(403).json("Missing Old Password"); return;}

        const user = await User.findById(req.params.id);

        validCurrentPassword = await bcrypt.compare(req.body.oldPassword, user.password);
        if(!validCurrentPassword){res.status(403).json("Old password is incorect!"); return;}

        const salt= await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        )
        const {password, ...others} = updatedUser._doc;
        res.status(200).json({...others});
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary/cloudinary");

// get a user
router.get("/", async (req,res) => {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        const { password, email, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get all users
router.get("/all", async (req,res) => {
    try {
        const users = await User.find();

        let savedUsers = [];

        await users.map((object)=>{
            savedUsers.push({
                _id: object._id,
                firstName: object.firstName,
                lastName: object.lastName,
                email: object.email,
                profilePicture: object.profilePicture,     
            });
        });
        res.status(200).json(savedUsers);
    } catch (err) {
        res.status(500).json(err);
    }
});


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


router.post("/updateimage/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { image } = req.body;
    
    const uploadedImage = await cloudinary.uploader.upload(image, {
        upload_preset: 'unsigned_upload',
        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'webp']
    },
    async function (err, result) {
        if(err){console.log(err); return;}else if(result){
            const { url } = result;
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: {profilePicture: url}
                    },
                    {
                        new: true
                    }
                );
                const {password, ...others} = updatedUser._doc;
                res.status(200).json({...others});
            } catch (err) {
                res.status(400).json(err) 
            }
        };
    });    
});




module.exports = router;
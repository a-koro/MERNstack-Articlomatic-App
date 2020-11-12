const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

router.post('/register', async (req,res) => {
    try {
        const {firstName, lastName, email, password, passwordCheck} = req.body;
        
        if(!email || !password || !passwordCheck || !firstName || !lastName) {
            return res.status(400).json({msg: "Not all fields have been filled"});
        }
        if(password !== passwordCheck) {
            return res.status(400).json({msg: "Enter the password twice to verify"});
        }
        
        const existingUser = await User.findOne({email: email});
        if(existingUser) {
            return res.status(400).json({msg: "An account with this email already exists"});
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.post('/login', async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({msg: "Not all fields have been filled"});
        }

        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({msg: "Invalid email or password"});
        }

        const userIsValid = await bcrypt.compare(password, user.password);
        if(!userIsValid) {
            return res.status(400).json({msg: "Invalid email or password"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '60000' });
        res.json({
            token: token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.delete('/delete', auth, async (req,res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user);
        res.json(deleteUser);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/getLoggedInUser", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    });
});

module.exports = router;
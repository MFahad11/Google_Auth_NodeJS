// const express = require("express");
// const passport = require("./config/passport");
// const mongoose = require("mongoose");
// const config = require("./config/config");
// const authRoutes = require("./routes/auth");
// const protectedRoutes = require("./routes/protected");
// const app = express();

// Connect to the database
// mongoose.connect(config.dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Configure Passport.js
// app.use(passport.initialize());
// app.use(passport.session());

// // Configure routes
// app.use("/auth", authRoutes);
// app.use("/protected", protectedRoutes);

// // Start the server
// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const passport=require("passport")
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose')
const config = require("./config/config");
const { google } = require('googleapis');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bodyParser = require('body-parser');
const userModel=require("./models/user")
const app = express();
// const CLIENT_ID = '381122114165-dvks4q7daq8fc44haaf9tv6aus5c824k.apps.googleusercontent.com';
const client = new OAuth2Client(config.google.clientId);
app.use(bodyParser.json());
app.use(bodyParser.json());
// Connect to the database
mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret:config.google.clientSecret,
  
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));
async function verify(token) {
    client.setCredentials({ access_token: token });
    const userinfo = await google.oauth2('v2').userinfo.get({ auth: client });
    return userinfo.data;
}

app.post('/signin', async (req, res) => {
  const { token } = req.body;
  try {
    const userInfo = await verify(token);
    const result=await userModel.findOne({"googleid":userInfo.id})
    // console.log(await userModel.find({googleid:userInfo.id}).length)
      if(!result){
      await userModel.create({
        firstName:userInfo.name.split(" ")[0],
        lastName:userInfo.name.split(" ")[1],
        email:userInfo.email,
        googleid:userInfo.id,
        emailstatus:userInfo.verified_email,
        picture:userInfo.picture,
      })}
      let data = {
        time: Date(),
        userId: userInfo.id,
    }
      const token1=jwt.sign(
        data,config.jwtSecret
      );
    res.json({userInfo,token:token1});

  } catch (error) {
    res.status(401).send(token1);
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

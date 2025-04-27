const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile);
      return done(null, profile);
    }
  )
);

// Facebook Strategy

// Cấu hình Passport Facebook
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID, // Thay thế với App ID của bạn
//       clientSecret: process.env.FACEBOOK_APP_SECRET, // Thay thế với App Secret của bạn
//       callbackURL: "http://localhost:3000/auth/facebook/callback", // Đường dẫn callback
//       profileFields: ["id", "displayName", "photos", "email"], // Các thông tin bạn muốn lấy từ Facebook
//     },
//     function (accessToken, refreshToken, profile, done) {
//       User.findOne({ 'facebookId': profile.id }, function (err, user)){
//         if (err) return done(err)
//         if (user) {
//           console.log("user found")
//           console.log(user)
//           return done(null, user);
//         } else {
//           var newUser;
//           newUser.facebookId = profile.id
//           newUser.name = profile.name
//           newUser.email = profile.email
//           newUser.pic = profile.photo[0].value
//           newUser.save(function (err){
//             if (err)
//               throw err
//             return done(err,newUser)
//           })
//         }
//       }
//       return done(null, profile); // Trả về profile người dùng
//     }
//   )
// );

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id); // nếu user không có `id` sẽ bị lỗi
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing user with id:", id);
  // nên truy vấn từ DB ở đây nếu cần
  done(null, { id });
});

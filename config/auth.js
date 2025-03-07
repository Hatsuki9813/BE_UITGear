const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const dotenv = require('dotenv');
dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google profile:', profile)
      // Xử lý logic lưu user vào DB ở đây
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);
      console.log('profile:', profile);
      return done(null, profile);    }
  )
)


passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id); // Lưu user id vào session
});

passport.deserializeUser((id, done) => {
  console.log('Deserializing user with id:', id);
  done(null, { id }); // Giả lập user (bạn có thể truy vấn DB ở đây)
});
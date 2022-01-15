const passort = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userSchema = require("../model/userSchema")
const bcrypt = require("bcryptjs")

module.exports = function passportAuth(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email"},
      function (email, password, done) {
        userSchema.findOne({ email: email }, function (err, user) {
        
            if (err) { return done(err); }
            if (!user) { return done(null, false, { msg: 'email or password not matched.' }); }
            if (!user.verifyPassword(password)) { return done(null, false, { msg: '"email or password not matched.' }); }

            if(user){
                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if(err)
                    return done(null, false, { msg: 'email or password not matched.' })
                    if(isMatch){
                         return done(null, user)
                    }else{
                    return done(null, false, { msg: 'email or password not matched.' })
                
                }

            })
        }
    
});
}
)
);

  passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    userSchema.findById(id, (err, user) =>{
        done(err, user);

    })
    
   });
};

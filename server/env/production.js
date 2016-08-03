/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production

 */

module.exports = {
    "DATABASE_URI": "postgres://localhost:5432/outdoor-store",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "4mB5goLnUr2gUlnybwlx6rMLb",
    "consumerSecret": "RJZMoK137pYqNs62UcR3BrrQiEgd23904dxsOjYbcHRCpbYnbl",
    "callbackUrl": "http://104.236.24.56:1337/auth/twitter/callback"
  },
  "FACEBOOK": {
    "clientID": "INSERT_FACEBOOK_CLIENTID_HERE",
    "clientSecret": "INSERT_FACEBOOK_CLIENT_SECRET_HERE",
    "callbackURL": "INSERT_FACEBOOK_CALLBACK_HERE"
  },
  "GOOGLE": {
    "clientID": "674802620761-ucebg494gki5iulfcftsrjq7r1i7kd23.apps.googleusercontent.com",
    "clientSecret": "z5MYQxRtVwayTUJgvtMpjipI",
    "callbackURL": "http://104.236.24.56:1337/auth/google/callback"
  },
    "LOGGING": true
};

// Cloudinary Config
export const cloudinaryConfig = {
  cloud_name: 'dck7vqmjo',
  api_key: '212221598268727',
  api_secret: 'yLpApv4IuH_EeA8Ei-Z257bJ_74'
}

export const mongoConfig = {
  db: 'mongodb://yuiyuilily609:KenzaRiani4631@ds015730.mlab.com:15730/kickstarterclone',
  secretKey: "kickstarterclone_secret"
}


/* DEVELOPMENT

export MONGOLAB_URI=mongodb://yuiyuilily609:KenzaRiani4631@ds015730.mlab.com:15730/kickstarterclone
export SESSION_SECRET=kickstarterclone_secret
export CLOUD_NAME=dck7vqmjo
export CLOUD_API=212221598268727
export CLOUD_SECRET=yLpApv4IuH_EeA8Ei-Z257bJ_74

=== Stripe ===
export STRIPE_CLIENT_ID=ca_8C8fzzI1dSlBzFG9eTMuNcSwWEJ8M9AC
export STRIPE_API_KEY=sk_test_OJz03Gsmewauak1Y2dSEuUtJ
export STRIPE_TOKEN_URI=https://connect.stripe.com/oauth/token
export STRIPE_AUTHORIZE_URI=https://connect.stripe.com/oauth/authorize

=== Mailgun ===
export MAILGUN_API_KEY=key-b9cc7d8b39ee5ca2e7cc6cb304038afd
export MAILGUN_DOMAIN=yuichidev.mailgun.org

npm run dev
*/

/* DO THIS BEFORE Deployment to Heroku
rm express-config.js index.js routes.js
rm -rf handlers models helpers
npm run build

THEN
- Move all files and folder inside `/build` to root
- Then, change in the file `express-config.js` from `(__dirname, '../views'))` to `(__dirname, '/views'))`
- Then push to Heroku

git add --all
git commit -m"Before deploy"
git push origin master
git push heroku master
*/

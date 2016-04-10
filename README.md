### Crowdfunding Startup "Kickstarter" Clone
Basic functionality of crowdfunding platform
- Authentication, Create/Edit projects, Get/Give funding, Commenting, Email, Share

### Setup
Pre-requisite: Install Vagrant and VirtualBox

In Terminal, type following to create Vagrant file
```
vagrant init
```
Configure the Setup, use Ubuntu and private network, for example
```
config.vm.box = "ubuntu/trusty64"
config.vm.network "private_network", ip: "192.168.33.10"
```

Then, login to Vagrant, install Node.js, Git, Mongo
```
vagrant up
vagrant ssh
sudo apt-get update
sudo apt-get install nodejs npm nodejs-legacy git mongodb
sudo apt-get update
sudo npm install -g npm
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g nodemon forever
sudo service mongodb start
cd /vagrant
npm start
```

To use ES2015
```
sudo npm install -g babel-cli
```

### TechStack
- [Vagrant(Ubuntu 14.04 LTS)](https://atlas.hashicorp.com/ubuntu/boxes/trusty64)
- [Node.js - v4.4.2](https://nodejs.org)
- [Expressjs - v4x](http://expressjs.com/)
- [Passport](http://passportjs.org/) for Authentication
- [Stripe](https://stripe.com/) for payment processing
- [MongoDB - v2.4.9](https://www.mongodb.org/)
- [Bootstrap - v3.3.6](http://getbootstrap.com/)
- [Cloudinary](http://cloudinary.com/documentation/node_integration#getting_started_guide) for image hosting
- [MongoLab](https://mlab.com/) for MongoDB hosting
- [Heroku](https://www.heroku.com/) for deployment
- [Bootstrap 3 Datepicker v4](http://eonasdan.github.io/bootstrap-datetimepicker/)

### Project Todo

- [X] Initial Setup
- [X] Projects - User can create projects, form, save into db (Basic)
- [ ] Projects - Create project (Edge case * Checking user inputs)
- [X] Projects - List projects, project page (Basic)
- [ ] Projects - Fetch project list with limit & skip (Scale)

- [ ] Authentication - User Registration (Check user inputs)
- [X] Authentication - User Login / Logout
- [X] Authentication - User Forgot password / Issue new password
- [ ] Authentication - User can update profile
- [ ] Authentication - User can delete account

- [X] Payment - Verify user's funding account
- [ ] Payment - User can back projects (Payment)
- [ ] Payment - User can update / cancel pledge amount

- [X] Email - Mailgun Integration (Forgot password)
- [ ] Email - Mailgun Integration (After back a project)
- [ ] Email - Notification

- [ ] Social - User can comment (Disqus-like)
- [ ] Social - User can share (Twitter, Facebook, Email)
- [ ] Projects - Video integration instead of cover photos
- [ ] Projects - Real time countdown
- [ ] Projects - Better Date/Time picker UI
- [ ] PerfMatters - Compile, faster insight speed

### Deployment

Signup Heroku and install heroku toolbelt
Create heroku app
```
heroku create
```
then, set config vars from settings for environmental variables
like MONGOLAB_URI, CLOUD_API, etc

**Some issues when deployed at Heroku** -> Quick fix:
- Move all files and folder inside `/build` to root
- Then, change in the file `express-config.js` from `(__dirname, '../views'))` to `(__dirname, '/views'))`
- Then push to Heroku

Deployed at Heroku: https://obscure-meadow-67002.herokuapp.com/

### Notes
Stripe Connect authentication for project creator with Passport-OAuth2Strategy <br />
Attempt code: https://gist.github.com/yhagio/451b0fe564980a0374ddcf9d254d9163

#### Side notes
- Project creation form validation
- Profile Update - Password, Email, Name
- Multiple rewards options (create them & payment options)
- Limit / Skip fetching of Projects from databse
- Search Projects
- Add Categories (tag, page)
- Progress Bar of funding
- Expiration of funding / Countdown update
- Commenting (Fetch comments at Profile, ProjectPage - Skip / Limit)
- Share (Facebook, Twitter, Email, Linkedin, etc)

Elastic Search hosting
- https://facetflow.com/#plans

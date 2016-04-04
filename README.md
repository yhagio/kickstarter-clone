### Crowdfunding Startup "Kickstarter" Clone

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

### Project TechStack
- Vagrant(Ubuntu) + Node.js + Expressjs + MongoDB
- [Cloudinary](http://cloudinary.com/documentation/node_integration#getting_started_guide) for image hosting
- [MongoLab](https://mlab.com/) for MongoDB hosting
- [Heroku](https://www.heroku.com/) for deployment

### Project Roadmap / Todo

- [X] Initial Setup
- [X] Projects - User can create projects, form, save into db (Basic)
- [ ] Projects - Create project (Edge case, Error handling)
- [X] Projects - List projects, project page (Basic)
- [ ] Projects - Fetch project list with limit & skip (Scale)

- [ ] Authentication - User Registration
- [ ] Authentication - User Login / Logout
- [ ] Authentication - User Forgot password / Issue new password
- [ ] Authentication - User can update profile
- [ ] Authentication - User can delete account

- [ ] Payment - Verify user's funding account
- [ ] Payment - User can back projects (Payment)
- [ ] Payment - User can update / cancel pledge amount

- [ ] Styling UI

- [ ] Email - Mailgun Integration (Forgot password)
- [ ] Email - Mailgun Integration (After back a project)


#### deployment

Signup Heroku and install heroku toolbelt
Create heroku app
```
heroku create
```
then, set config vars from settings for environmental variables
like MONGOLAB_URI, CLOUD_API, etc

**Some issues** quick fix:
- move all files and folder from `build` to root and
- change `express-config.js` from `(__dirname, '../views'))` to `(__dirname, '/views'))`
- then push to deploy

Deployed at heroku: https://obscure-meadow-67002.herokuapp.com/

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
Front-End
- [ ] UI - Front Page
- [ ] UI - Authentication - Register Form
- [ ] UI - Authentication - Login Form
- [ ] UI - Authentication - Forgot Password Form
- [ ] UI - Navigation Bar
- [ ] UI - Project List
- [ ] UI - Project List (with Filter)
- [ ] UI - Project Detail
- [ ] UI - Project Discussion / Comment - Form, List
- [ ] UI - Project Creation Form
- [ ] UI - Project Update Form
- [ ] UI - Project Management Page (Amount, Supporters, etc)
- [ ] UI - Social Share Buttons

Back-End
- [ ] Initial Setup
- [ ] Authentication - User Registration
- [ ] Authentication - User Login / Logout
- [ ] Authentication - User Forgot password / Issue new password
- [ ] Authentication - User can update profile
- [ ] Authentication - User can delete account
- [ ] Payment - Verify user's funding account
- [ ] Projects - User can create projects (i.e. rewards & options)
- [ ] Projects - User can pledge projects (Payment)
- [ ] Payment - User can update / cancel pledge amount


#### deployment

Set environmental variables.
```
export MONGOLAB_URI=
export SESSION_SECRET=
export CLOUD_NAME=
export CLOUD_API=
export CLOUD_SECRET=
npm run prod
```

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
- [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/about.html)


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

Deployed at [Heroku](https://obscure-meadow-67002.herokuapp.com/)

**Elastic Search with Heroku**
- [Bonsai + Heroku add-on guide](https://docs.bonsai.io/docs/nodejs)

Local Installation Steps for Elasticsearch for development
```
audo apt-get update
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
sudo apt-get update
sudo apt-get install elasticsearch

sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jdk

sudo service elasticsearch start 
sudo service elasticsearch restart
```
Then start server.

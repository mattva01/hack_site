# Code For Nova Site Source
This repo will soon power http://codefornova.org
***
### Setting up a development environment:
##### 1. Install Docker
###### Ubuntu
The easiest way to have an up to date version of        docker on Ubuntu/Debian is to use this shell script:
```bash
curl -sSL https://get.docker.com/ubuntu/ | sudo sh
```   
It adds the docker signatures and repository to your     sources.list then installs docker.
###### OSX

1.  Run the Docker OSX installer found here:   https://github.com/boot2docker/osx-installer/releases/download/v1.5.0/Boot2Docker-1.5.0.pkg
2. Run the following commands in a Terminal session:

  ``` bash
  boot2docker init
  boot2docker up
  $(boot2docker shellinit)
  ```
  *Note: The second two commands must be run every time you restart.*

##### 2. Install docker-compose

Currently the easiest option is to run the following:
```
curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose; chmod +x /usr/local/bin/docker-compose
```

##### 3. Repository setup
1. Fork this repository.
2. Clone your fork to your local machine.
3. Add an upsteam remote: 

 ``` 
 git remote add upstream https://github.com/mattva01/hack_site.git
 ```
 
 
##### 4. fig.yml setup
 1. `cp fig.yml.ex fig.yml`
 2. Set the  environment variables in fig.yml according to your preferences (reference below)

##### 5. Running the application
1. `docker-compose build`
2. `docker-compose up -d`

Viola, the application should be running on port 8888. On Linux it will be running on 127.0.0.1, and on OSX you can find the IP by running `boot2docker ip`

The server can  be started & restarted by simply running `docker-compose up -d` again, but any changes to `package.json` will require you to run `docker-compose build` again.

To stop, run `docker-compose stop`

*Note: You can reset the database by stopping the application , running `docker-compose rm -v mongodb` then starting it up again.*

### Environment Variables

`CODEFORNOVA_AUTH_SECRET`: (Mandatory)  This is the key used to sign auth tokens. It should be set to a  long random string.  
`CODEFORNOVA_ADMIN_USERNAME`: (Mandatory) This is the  username for the default admin user.  
`CODEFORNOVA_ADMIN_PASSWORD`: (Mandatory) This is the password for the default admin user.  


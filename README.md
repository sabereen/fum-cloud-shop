# Fum Cloud Shop Account Manager


This is a RESTful Account manager Service written in type script of Node.js on routing-controller powered by MongoDB. It is intended that the developer use this as a module (microservice) in a project; rather than a standalone service since it is only a mean of account manage. That being said, if you plan to develop a service that includes account manager and Depends on SayidHosseini/authentiq service, it might be a good idea to have a head start and build on top of this project instead of starting one from scratch.

API Reference is provided in the [wiki](https://github.com/sabereen/fum-cloud-shop/wiki) pages.

<br/>

## project structure
In src folder you can see structure of project and change some of that you need for your purpose. the description of project are following:
* project includes controllers, schemas, services, config.ts and index ts.
* config.ts includes environments that defined to use in other files as need.
* index.ts is index file of node and initial setting for routes in it.
* with use [routing-controllers](https://github.com/typestack/routing-controllers), use controllers in controllers directory for controll enter routes and handle http requests and responds.
* schemas directory includes models of entitys for mongoDB.
* services directory includes payment service (connect zarinpal and handle it), some authentiq service and other for use that you need  in project to controllers and routes use them.  


## Setting up As a Service
In order to run this as a service and probably develop on top of it, you'll need a to do the followings:

* Install https://nodejs.org/en/[node.js] and https://www.mongodb.com/[mongoDB]
* Clone the repository and `cd` to the cloned repository
* Set environment variable `mongo` to the full URI of your mongo database or modify the `uri` parameter in `config.ts` (first one overrides the second)
* Set environment variable `auth` to the full URI of your SayidHosseini/authentiq service or modify the `uri` parameter in `config.ts` (first one overrides the second)
* To install dependency packages, run `npm install`
* To run the application for development purposes, run `npm start` 
* To run it for production you may run `npm build` and after that run `node index.js`

<table>
    <td>Running <code>npm start</code> will only watch your application and save changes in dist folder;</td>
</table>

## Setting up As a Microservice
If you want to run the module as a containerize microservice, you'll need to install [Docker](https://www.docker.com).

* In order to use this as a microservice in your project, you'll need a MongoDB container with the name `mongo`. This is the name that should be resolved to the IP address of the mongoDB container. If you'd like to change that, you'll need to modify the `uri` parameter in `config.ts`, accordingly. 
* In order to use this as a microservice in your project, you'll need a Sayid/authentiq service container with the name `auth`. This is the name that should be resolved to the IP address of the Sayid/authentiq container. If you'd like to change that, you'll need to modify the `uri` parameter in `config.ts`, accordingly.
* We provide a `docker-compose.yml` file that includes everything needed to launch the system. You may use either of `docker-compose` or `docker swarm` to setup the system for production easily! 
* Although the Dockerfile has been provided, **you do not need to make your own copy of the image**, if you do not need to modify the source. The latest version for *Linux/amd64* is always built [automatically](https://docs.docker.com/docker-hub/builds/) and pushed to the [DockerHub repository](https://hub.docker.com/r/fumcloudshop/accountma). It is addressable with the `latest` tag `fumcloudshop/accountma`. Since there might be other versions in the future and latest would point to those new versions, we recommend that you use version explicit tags  to keep consistency.
* If you want to make your own copy of the image, clone it on the target platform and `cd` to the cloned repository. Then run `docker build -t $DOCKER_ACC/$DOCKER_REPO:$IMG_TAG .` to build the image locally. Then, you may push it to [DockerHub](https://docs.docker.com/docker-hub/repos/) after building is complete.
* If you are planning to use this microservice in a production environment, generate your own key pair, as noted above. Probably, you'll need to create your own image, as well.
* If you need to store extra information e.g. name or any other user related info, it is advised to store those information in another module (microservice) of your system and keep this container intact and solely for the purpose of authentication and session management.



## License
Developed by **_Mojtaba ghasemzadeh_** and **_Ali Baghchehban_**.

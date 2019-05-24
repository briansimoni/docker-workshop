# Docker Lab

This objective of this lab is to help developers get kick-started with the Docker toolkit and serve as a reference for future projects. We'll begin with some background knowledge and then move into a useful example with Node.js

## What is Docker?
Docker is software that provides a lightweight *form of virtualization* through a operating system concept called **containers**. It is written in the [Go programming language](https://golang.org/) and it is open source on GitHub https://github.com/docker. Unlike a virtual machine, a container leverages major components of the host OS like the kernel. This allows for containers to be much smaller in physical size than a VM, and allows you to run hundreds concurrently on the same hardware.

## Why Use Docker or Containers?
Containers provide many benefits.
* A simple way to package and ship your software
* Containers work on any platform that can run containers
* Any platform that can run containers will run them identically
* Production is now identical to dev. Avoids "well it works on my machine"
* Leverage cloud services to scale faster
* Abstract away hardware
* Docker basically runs a monopoly on container technology. If you're using containers, use Docker.

## What is a Container?
A container is an abstraction that Docker (or some other software) creates from Linux namespaces and control groups which are built into the kernel as a mechanism to provide process isolation. When you run a process in a container, that process will think it's the only process running in the entire operating system. In other words, **a container is a linux process**. Containers are created based off of **images**. Additionally, since they use linux kernel features, Docker is not compatible with Windows or MacOS. When you use Docker on either of those platforms, someone has hidden a full virtual linux machine on your system.

## What is an Image?
Straight from docs.docker.com: An image is a read-only template with instructions for creating a Docker container. Often, an image is based on another image, with some additional customization. For example, you may build an image which is based on the ubuntu image, but installs the Apache web server and your application, as well as the configuration details needed to make your application run.

## Daemon
It may be useful to know that when you run Docker, you are running the docker daemon. The daemon can watch your containers, mange networking, images, etc... It actually hosts a REST API as well. The docker CLI communicates to the daemon through the API.

## Networking
When you run containers, Docker makes them think they are running on their own private network. It does so by manipulating [iptables](https://linux.die.net/man/8/iptables) and DNS through the hosts file. You can control the docker private networking using the CLI.

## Volumes
If you remember, containers are Linux processes. They spawn and die all the time. While the daemon can persist them or leave them in a stopped state, always think of containers as ephemeral. The way you should be persisting data is through volumes. Volumes provide a way for you to link a part of your host's filesystem to one or many containers. Think of how Microsoft Word runs in its own process. The contents of memory are destroyed when you power off the machine unless you save it to the file system. 


# Lab
**First we are going to start with the basics of running containers and networking them together.**
1. Install netcat on a debian container
* `docker run --name netcat -ti debian bash`
* `apt-get update -y && apt install netcat -y`
* `nc google.com 443 -v`
* *In another terminal*
* `docker ps` View the running containers
* `docker inspect netcat`

2. Create an image based on a running container
First create a repository on docker hub called netcat
* `docker commit netcat briansimoni/netcat:LATEST` Make sure to switch out usernames
* `docker push briansimoni/netcat:LATEST`
* Great! Now you can reuse your netcat image and share it with everyone

3. **Network two containers together (Note this will requires 3 terminal windows. The actual docker commands are run on your host, not the container instance.)**
* `docker run --name netcat2 -ti briansimoni/netcat:LATEST bash`
* `docker network create netcat`
* `docker network connect netcat netcat`
* `docker network connect netcat netcat2`
* *Inside the netcat2 container*
* `netcat -l -p 4321`
* *Inside the first netcat container*
* `nc netcat2 4321`
* Now you can send messages to the other container!
* Netcat is a useful network debugging tool

4. **Volumes with nginx**
* `mkdir docker-volumes`
* `cd docker-volumes`
* `docker run --volume ${PWD}:/usr/share/nginx/html --name nginx -p 7000:80 -d nginx`
* Now modify index.html and visit http://localhost:7000

5. **Dockerfiles**
We are going to Dockerize the Node.js application in this repository

6. **Docker Compose**
We are going to provide the external dependencies that the node.js requires via docker-compose

The answers to 5 and 6 can be found in the completed branch: https://github.com/briansimoni/docker-workshop/tree/completed

# Useful Commands
* `docker container prune`
* `docker volume prune`
* `docker image prune`
* `docker ps -a`
* `docker rm -f [container_name|container_id]`
* `docker stats`
* `docker inspect`
* `docker --help`
* `docker logs -f [container_name]`
* `docker exec -ti [container_name] sh`

# Useful Links
* https://docs.docker.com/engine/docker-overview/
* https://www.slideshare.net/jpetazzo/anatomy-of-a-container-namespaces-cgroups-some-filesystem-magic-linuxcon
* https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html#install_docker
* https://www.youtube.com/watch?v=cYsVvV1aVss
* https://www.youtube.com/watch?v=4ht22ReBjno

# Security Considerations
Sure, Docker containers are running in an isolated process, but really how isolated are they? I mean, most of your containers are running the process as root. Can we reduce the privlege somehow? Are there other security best practices out there? Maybe look into [seccomp](https://docs.docker.com/engine/security/seccomp/). Look into Alpine Linux.


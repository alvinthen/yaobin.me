---
title: Building Live streaming Platform on Bare Metal
date: '2019-07-15T23:26:18+0800'
categories: ['Solution Architect']
tags:
  [
    'Parse Server',
    'Electron',
    'Traefik',
    'Docker',
    'Kurento',
    'WebRTC',
    'React',
    'NodeJS',
    'React Native',
    'Ubuntu',
    'GraphQL',
  ]
excerpt: Looking for a full-stack platform but restricted to bare metal? Let me inspire you with a livestreaming solution I built without any cloud providers, using open source technologies.
---

# TL;DR

The infrastructure and technology

- Docker
- Traefik
- WebRTC
- Nginx
- Kurento Media Server
- Ubuntu Server

The backend

- Parse Server
- ExpressJS
- GraphQL Server

The frontend

- React Native
- Electron with React

# An overview of what this article is about

Looking for a full-stack platform but restricted to bare metal? Let me inspire you with a live streaming platform I built without any cloud providers, using open source technologies. Here we'll talk about the reasons behind the technology chosen. We won't do any comparisons here, mainly to avoid confusion and simplify the decision-making process. We will talk about the features and challenges I've met while using these stacks. Lastly, we're not going to talk about how to connect them up, that'll be a huge topic to talk about. That said, if this gets enough interest, we might make time for it.

## About the platform

The platform served to stream videos from mobile apps and CCTV back to a desktop app stationed in the control room. So we have three pieces of software to write, i.e. the mobile app, desktop app, and the server-side codes to facilitate the exchanges between the apps, also to run background jobs.

**Let's get it started!**

# The OS - Ubuntu Server

Ubuntu was the first choice to build our server for its popularity. Popularity may not be a sounding advantage, but when you think about how many of the third-party software treat Ubuntu like their first-class citizen, it makes sense. It reduces your time to work around an unsupported OS.

Stability and frequent security updates are important here too. For us, the most important factor is that it supports Docker.

# The Host - Docker

This is a must when you're building on bare metal, it keeps you sane with consistency between your dev and production environment, ensuring your code works in any platform/OS. With Docker, you keep OS-level configuration in Dockerfile and never be troubled by unexpected changes to the OS which then broke your app.

Using Docker Compose, we can easily orchestrate how containers are booted up, and work with each other. In our live streaming system, every piece of infrastructure and server apps run in Docker, many of the containers are downloaded from Docker Hub, further reducing our development time.

If you're on to microservices, look no further. You need this, and the next one!

# The Reverse Proxy - Traefik

This my first approach with Traefik, it's simple to set up and use. As we're hosting multiple servers on bare metal, we need Traefik to act as a reverse proxy and load balancer. Traefik is the only interface connected to the public network, any incoming requests must go through it before reaching their destination.

Traefik also helps to manage SSL certs for a secured connection. In our case, we're backed by Let's Encrypt's free certificates. Traefik automatically handles the renewal of the certs for us, handy!

# The File Server - Nginx

Setting up a file server in Nginx is dead simple, there's no need to look for anything else. To bait you into it, here's how simple it is to set up Nginx to serve recorded streams from Kurento using Docker Compose, fronted by Traefik.

```yml
fileserver:
  image: nginx
  restart: unless-stopped
  ports:
    - 3001:80
  volumes:
    - kurento:/usr/share/nginx/html:ro
  labels:
    - 'traefik.frontend.rule=Host:${FILESERVER_HOSTNAME}'
    - 'traefik.docker.network=traefik_default'
```

# The Media Server - Kurento

_Kurento is arguably the best choice, but we found no other solution but to work around it._

Kurento is the core of this whole platform, without it, our development time will be skyrocketed. Acting as the media server, Kurento accepts inbound connections from the mobile app using WebRTC, and from the CCTV via RTSP. Kurento is crucial to us, because of its support on RTSP, which has very limited support on devices, while RTSP is the easiest way we can connect to multiple brands of CCTV.

To work with Kurento, you send instructions to Kurento via SDKs (or WebSocket with their RPC protocol) to start streaming, recording, playing, etc.

Behind the black box, Kurento is powered by GStreamer, hence anything you can build with GStreamer, you can build it into Kurento with a little more effort.

Kurento supports OpenCV too, if you need any of the image processing built into your solution, consider Kurento! We've built our motion detection and crowd detection system into it too.

The challenges we faced are difficulty in debugging, random crashes, and limited community support. We're quite lucky to be able to pull it off!

# The Media Streamer - WebRTC

WebRTC enables us to stream videos among the mobile app, desktop app, Kurento, and CCTV. WebRTC works by connecting two clients directly using P2P for real-time communication, without going through any servers (depending on your configuration). It's simple to start, and it gets more complex as more devices join into the system.

My work with WebRTC added extra effort on trying to debug connection issues revolving around STUN, TURN, ICE (fancy names, I know). There are times where this won't work especially when I'm working from a cafe with stricter wifi. Oh, did I mention the bare metal I was supposed to deploy into is in a strict network environment? We have to work with network engineers to get things working.

I'd appreciate the opportunity to work with WebRTC though, now that I have a deeper understanding of networking.

Caution, there's a known issue with WebRTC leaking IP addresses of clients, due to the nature of WebRTC utilizing P2P, clients' IPs will inevitably be discovered by the other party. We care less about this since the IPs are sent back to a server managed by us, via an encrypted connection.

# The BaaS - Parse Server

Built-in authentication, access to MongoDB, backed with ACL and CLP, push notification, Cloud Code, Parse Dashboard, GraphQL, file object storage, live queries, webhooks, background jobs, and triggers, it's all in Parse Server, I couldn't ask for more!

You guessed it, there's a Parse Server image built by the team in Docker Hub, using it is very simple. Just boot it up, and there you go, a BaaS ready for your entire platform. It's a huge time saver for us, no need to wire up custom authentication, no custom codes, and boilerplates to access the database, no complex authorization. I can't say how much I love Parse Server, okay maybe not above AWS and Firebase, but it does its job.

With Cloud Code support, you can deploy everything without another backend server. However, we need another engine to support our use case. Good thing is, Parse Server is written in NodeJS and can be easily plugged into ExpressJS as a middleware.

One thing to note is that, if you're writing an SSR web site, Parse may cause a problem for you as the user data are stored in local storage, that is, you can't query user-related or user-owned data in server-side. To work around this, you may have to SSR only public page.

# The Engine - Express Server

Written with NodeJS, ExpressJS is the most popular web framework out there. We used this as the signaling server to facilitate the WebRTC ICE exchanges, and also some misc requests that are not related to the core functions. Oh, and to host another GraphQL server which is connected to another DB that's not managed by us, which is wrapped using Prisma.

Okay, nothing interesting on this, let's see the frontend.

# The Cross-Platform Mobile App - React Native

I bought into React Native since perhaps 3 years ago, when things aren't as stable as it is today, yet it brought value to us by reducing our development cost, by having the same language and framework on both iOS and Android. However, it's not without its challenges.

The frequent challenge we faced is the limitation of the JS bridge, which connects the native side and the JS runtime, often slows us down when we're trying to send huge data over the bridge. One example is when reading saved video from the native side to upload to the server via React Native code, the performance is significantly impacted.

# The Cross-Platform Mobile App - Electron

Although we're only required to deploy into Windows, we chose Electron for one reason, to be able to use web technology. That means, we can re-engage the same engineers that have experience in web development into this project. Again, this saves our development cost with slight overhead.

We went to the extent to use React on Electron too! As their slogan said, **"Learn Once, Write Anywhere"**. The journey is a little painful though, most of the time we spent waiting for the reloading process to compile React into Electron supported code.

You see, our stacks use only Javascript, as such it's simpler to get new guys on board.

# Scalability

Scalability is supported here, well, I dare not say the same to Kurento. There's limited conversation on how to make Kurento scalable. I supposed our signaling server will have to do the load balancing between multiple Kurento instances.

Other than that, the other stacks can be easily scaled horizontally by putting them behind a load balancer. And yes, Traefik is already handling the load balancing for us, so scalability is not an issue minus Kurento.

To us, building into bare metals is not a scalable way to move forward. Unless you're building an infra giant, then you most likely have to look into OpenStack or Netflix's stack.

# Wrapping up

Of course, if given any chance, I would move them into AWS or Firebase, using managed services rather than maintaining the infrastructure myself. It's not easy not we'll have to make do this time due to project restrictions. That being said, I believe DevOps will be dead in another couple of years with the blooming of Baas and PaaS. Maintaining and deploying manually are not sustainable, and will eventually be obsoleted.

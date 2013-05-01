
# Buildscripts

This is a repo for some Grunt-based build and deployment scripts that I have been playing around with for my Angular/Python Django web app.
I am sharing it here for the benefit of the AngularJS community members that came to hear my talk:

http://www.meetup.com/AngularJS-Boston/events/113349762/

# Installation and Configuration

## Prerequisites

* Node 0.10.x
* `npm install bower -g`
* `npm install grunt-cli -g`

## Steps

Please note that this repo is not set up to download and run automagically.  It is a piece of a larger web project and is meant only
for reference. I have never tried to download this as an individual component and get it running. However, if you did want to attempt this,
here is at least some of the the directory structure you would need to have in order to get started (and/or you can modify the Gruntfile.js
to match your existing environment):

* git clone https://github.com/jeffwhelpley/buildscripts.git
* cd buildscripts
* npm install
* bower install

At this point, you are sort of on your own.  This repo doesn't actually have any code or resource files to build, so there are no targets for the buildscripts.

If you have any questions, feel free to ping me at any time on Twitter @jeffwhelpley.

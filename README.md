What it is

Remember when you were in elementary school, sitting in class, passing around notes? Remember that game where one person would start a story and then you'd take turns adding another line until you had a hilarious and bizarre story? Well this is that game, updated for the Millennial generation. Whether you're sitting at your desk at work or standing on the subway, this game will take you back to those carefree days of youth. All you need is a friend and an opposable thumb and you're ready to go!

How it was built

This game is 100% JavaScript. Well, except for the CSS and HTML. I set out with the goal to write a browser-based game that would run on mobile and desktop computers, and that's exactly what I did.

The back-end uses the Express framework, as well as the Mongoose object modeling library, and is deployed to Heroku automatically using Travis CI. The database is a MongoDB provided gratis by MongoLab.

The front-end is written using the Angular.js framework and interacts with the back-end using an API. Bootstrap 3.1.0 was used extensively for the styling, and icons were made available by Font-Awesome.

I originally intended to use socket.io to keep the app updated about changes to the database, but that proved to be overkill for my application so I switched to polling the database.

Frameworks/libraries used

Angular.js 1.0.7
Node.js 0.10.21
Express 3.2.6
Mongoose 3.8.5
Bootstrap 3.1.0
MongoDB 1.3.19
Font Awesome 4.0.3
<h3>What it is</h3>

<p>Remember when you were in elementary school, sitting in class, passing around notes? Remember that game where one person would start a story and then you'd take turns adding another line until you had a hilarious and bizarre story? Well this is that game, updated for the Millennial generation. Whether you're sitting at your desk at work or standing on the subway, this game will take you back to those carefree days of youth. All you need is a friend and an opposable thumb and you're ready to go!</p>

<h3>How it was built</h3>

<p>This game is 100% JavaScript. Well, except for the CSS and HTML. I set out with the goal to write a browser-based game that would run on mobile and desktop computers, and that's exactly what I did.</p>

<p>The back-end uses the Express framework, as well as the Mongoose object modeling library, and is deployed to Heroku automatically using Travis CI. The database is a MongoDB provided gratis by MongoLab.</p>

<p>The front-end is written using the Angular.js framework and interacts with the back-end using an API. Bootstrap 3.1.0 was used extensively for the styling, and icons were made available by Font-Awesome.</p>

<p>I originally intended to use socket.io to keep the app updated about changes to the database, but that proved to be overkill for my application so I switched to polling the database.</p>

<h3>Frameworks/libraries used</h3>

<ul>
<li>Angular.js 1.0.7</li>
<li>Node.js 0.10.21</li>
<li>Express 3.2.6</li>
<li>Mongoose 3.8.5</li>
<li>Bootstrap 3.1.0</li>
<li>MongoDB 1.3.19</li>
<li>Font Awesome 4.0.3</li>
</ul>

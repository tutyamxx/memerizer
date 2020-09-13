<p align="center">
  <img src="https://i.imgur.com/HiaDkDQ.png"><br/>
</p>

<br />

# Memerizer

* A sad Memerizer API that generates meme pictures on the fly using JavaScript, without the need of saving them to your device!
* It also never writes any data on the machine that is running, everything happens magically on the memory using buffers!
* It returns the picture as a `Buffer` or `Base64` string (useful for directly displaying them in a website or on your Discord, Slack, bots or any other IRC channels)
* It has **23** unique endpoints for dank image manipulations 🤘🏽🤪🤘🏽
* Heavily relies on [Jimp](https://github.com/oliver-moran/jimp) and [GraphicsMagick](https://github.com/aheckmann/gm)
* Currently supported response formats are: `Buffer` and `Base64`

# How to use

* I have to create a documentation, proably on gitbooks soon

# How to run it locally

* Clone this repo
* Open the containing folder
* Type `npm i && npm start`
* Open the API in your browser http://localhost:6969/api/v1
* To run the tests (**164** of them actually), type `npm test`

# Usage

* API Request limit is **50** requests per minute per IP, to slightly prevent spamming Heroku
* API Endpoint URL hosted on heroku ➡️ https://memerizer.herokuapp.com/api/v1
* If you get an error while accessing the API endpoints is most likely that I'm out of free monthly Heroku Dyno hours 🤐
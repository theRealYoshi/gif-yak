# Gif-Yak

[Gif-Yak][Gif-Yak] - Enter an email, get a gif

[Gif-Yak]: http://test-gif-yakker.herokuapp.com

## Description

- Single page web application utilizing React on the front-end, Node.js on the backend
  - Key packages for Node: Gulp, Babel, Browserify
  - React written in ES6 and integrating Flux Architecture
- Utilizes Giphy API and Cloudinary image resizing API for gifs
- Redis caching of email inputs as keys and Giphy API output as values
- Error notifications using Toastr
- Really cool Tri-invert loading image for search queries: https://gist.github.com/elykahn/99827f362208f7da158f

## Key Features

- Input an Email, get a gif of a random celebrity
  - Email validation through regex.
  - Search bar shakes and toastr notification occurs if the email is not formatted correctly
    - Wrong email format:
      - ![wrong_email](https://cloud.githubusercontent.com/assets/1275250/11703379/c5f165ce-9e93-11e5-8c52-5810edeb4e06.gif)
- Get a Gif
  - Results are cached with .rpush for 60 seconds
  - ```javascript
        if (!error && response.statusCode == 200) {
          redis.rpush(parseGiphyData(emailLookup, body)); // stores giphy data object
          redis.expire(emailLookup, 60); // expires after one minute
          redis.lrange(emailLookup, 0, -1, function(err, reply){
            res.send({data: reply});
        })
    ```
  - Gifs pop up using animation flipInX
    - ![gif_flips](https://cloud.githubusercontent.com/assets/1275250/11703443/0b02694c-9e94-11e5-82d9-fdfba7def4b4.gif)

## Future implementations

 - [ ] Search for real email profile pictures

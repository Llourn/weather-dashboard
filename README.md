# Weather Dashboard

## Description

Welcome to my weather dashboard! 
This app is used to look up the weather anywhere in the world. As you view the weather for each location it will be added to a Locations list for easy viewing later. Current conditions take center stage here but there's also a five day forecast if you're looking to plan ahead.

During the development of this project I learned more about the pros and cons of using a css framework. There's a bit of a learning curve there when you're using one for the first time but the pre-made components and styles could be worth the tradeoff. The time I dedicated to refactoring my code was mostly spent working out a good solution for maintaining the state of the location data. I wanted there to be a single source of truth and make sure it was accessible throughout my app without making it globally accessible. I also spent some time incorporating Vitejs into this project. I liked having access to node modules instead of using script links in the `index.html` file and the convenience of running the project with `npm run start`. I'll definitely be digging into Vitejs to see what other tools there are. 


The live site can be viewed [here](https://llourn.github.io/weather-dashboard/).

https://user-images.githubusercontent.com/4216705/221416491-78012659-da13-4914-adf5-a6d56cad7838.mov

## Table of Contents

- [Installation](#installation)
- [Credits](#credits)
- [License](#license)

## Installation

This app requires Node.js to run locally.

* Clone the project
* cd into the project directory
* `npm install`
* `npm run dev` to spin up web server with the intent to modify the code.
* `npm run build && npm run preview` if you want to test the build. 


## Credits

Header photo by [mosi knife](https://unsplash.com/@mosiknife?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

## License

MIT License Copyright (c) 2023 Lorne Cyr

## Badges

![Boot Camp Project](https://img.shields.io/badge/Boot%20Camp%20Project-%E2%9C%94%EF%B8%8F-green)

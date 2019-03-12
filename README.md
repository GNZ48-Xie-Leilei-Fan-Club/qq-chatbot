# QQ-Chatbot

## Overview
[QQ](https://en.wikipedia.org/wiki/Tencent_QQ) is a popular instant messaging software in China mainland. This project is a generic chatbot for QQ chat groups to monitor group messages for keywords and reply with responses, both of which are fetched from an external API.

## Installation and Configuration
First, `git clone` this repo. In project root directory, run
```
yarn
```
To configure the chatbot,
```
cp api-dist.js api.js
```
Then modify `api.js` according to the instructions, and run 
```
node app.js
```
This chatbot assumes your external API follows [JSON API](https://jsonapi.org/) specifications.

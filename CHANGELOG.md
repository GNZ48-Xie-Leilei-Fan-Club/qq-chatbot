# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] 2019-03-12
### Added
- Added `README.md`
  - Added Overview and Installation/Configuration Instructions
- Added `.gitignore`
- Use `yarn` for dependency management
  - Added `package.json` and `yarn.lock`
  - Added three major dependency
    - `axios@^0.18.0`
    - `websocket@^1.0.28`
    - `websocket-as-promised@^0.9.0`
- Added basic functionality
  - Periodic scan of a Weibo user's post
  - Communicate with Coolq bot using Websocket through [coolq-http-api](https://github.com/richardchien/coolq-http-api) to broadcast in case of new posts

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added feature to ignore certain QQ number for keyword monitoring
- Added feature for sending new member notices, fetching real time rankings, pk broadcast and etc.
- Log errors to sentry 
  - Added `@sentry/node@5.6.2` as a dependency

## [0.1.0] 2019-03-12
### Added
- Added `README.md`
  - Added Overview and Installation/Configuration Instructions
- Added `.gitignore`
- Use `yarn` for dependency management
  - Added `package.json` and `yarn.lock`
  - Added three major dependency
    - `devour-clinet@^2.0.15`
    - `websocket@^1.0.28`
    - `winston@^3.0.1`
- Added basic functionality
  - Communicate with external API to fetch `KeywordedReponses`
  - Communicate with Coolq bot using Websocket through [coolq-http-api](https://github.com/richardchien/coolq-http-api) to monitor for keywords and reply with responses
- Added logging
- Added MIT license

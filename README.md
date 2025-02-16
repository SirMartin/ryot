<h1 align="center">Ryot</h1>

<h3 align="center">
  A self hosted platform for tracking various facets of your life - media, fitness etc.
</h3>

<br/>

<div align="center">
  <a href="https://github.com/ignisda/ryot/stargazers">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ignisda/ryot">
  </a>
  <a href="https://github.com/ignisda/ryot/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-GPLv3-purple">
  </a>
  <a href="https://github.com/IgnisDa/ryot/pkgs/container/ryot">
    <img alt="Image size" src="https://ghcr-badge.egpl.dev/ignisda/ryot/size">
  </a>
</div>

<p align="center">
    <a href="https://ignisda.github.io/ryot" target="_blank" rel="noopener noreferrer">Documentation</a> •
    <a href="https://ignisda.github.io/ryot/configuration" target="_blank" rel="noopener noreferrer">Configuration</a> •
    <a href="https://ryot.fly.dev" target="_blank" rel="noopener noreferrer">Demo</a>
</p>

<br/>

Ryot (**R**oll **Y**our **O**wn **T**racker), pronounced "riot", aims to be the only self
hosted tracker you will ever need!

## 💻 Demo

You can use the demo instance hosted on [Fly.io](https://ryot.fly.dev). Login
and register with the username `demo` and password `demo-password`. This instance
is automatically deployed from the latest release.

**NOTE**: The data in this instance can be deleted randomly.

## 📝 ELI5

Imagine you have a special notebook where you can write down all the media you have
consumed, like books you've read, shows you have watched, video games you have played or
workouts you have done. Now, imagine that instead of a physical notebook, you have a
special tool on your computer or phone that lets you keep track of all these digitally.

## 💡 Why?

- Existing solutions do not have very good UI.
- Pretty graphs and summaries make everyone happy. Ryot aims to have a lot of them.
- There is a lack of a good self-hosted fitness and health tracking solution.
- Ryot consumes very little memory (around 10MB idle eyeballing `docker stats`).

## 🚀 Features

- ✅ [Supports](https://github.com/IgnisDa/ryot/discussions/4) tracking media
  and fitness
- ✅ Import data from Goodreads, Trakt, Strong App [etc](https://ignisda.github.io/ryot/importing.html)
- ✅ Integration with Jellyfin, Kodi, Plex, Audiobookshelf [etc](https://ignisda.github.io/ryot/integrations.html)
- ✅ Sends notifications to Discord, Ntfy, Apprise etc
- ✅ Self-hosted
- ✅ PWA enabled
- ✅ Documented GraphQL API
- ✅ Easy to understand UI
- ✅ Lightning fast (written in Rust BTW)
- ✅ Free and open-source

## 🙏 Acknowledgements

It is highly inspired by [MediaTracker](https://github.com/bonukai/MediaTracker).
Moreover thanks to all those people whose stuff I have used.

The logo is taken from
[Flaticon](https://www.flaticon.com/free-icon/mess_4789882?term=chaos&page=1&position=2&origin=tag&related_id=4789882).

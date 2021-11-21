<p align="center">
  <a href="https://decent.land">
    <img src="./img/logo25.png" height="124">
  </a>
  <h3 align="center"><code>@decentdotland/public-square-api</code></h3>
</p>


[![See it on NPM!](https://img.shields.io/npm/v/public-square-api?style=for-the-badge)](https://www.npmjs.com/package/public-square-api)
[![License](https://img.shields.io/apm/l/vim-mode?style=for-the-badge)]()


# public-square-api
an api for the public-square Protocol

## Install

```
npm install public-square-api
```

## Examples

### I) get public-square's feed

#### method 1: data decoded from the TX's `data` property
```javascript
import { getFeed } from "public-square-api"

async function loadTribusFeed() {
    const feed = await getFeed();

    return feed;
}

```

#### method 2 (LazyAccess): data decoded from the TX's `lazyAcess` tag
```javascript
import { getLazyFeed } from "public-square-api"

async function loadTribusFeed() {
    const feed = await getLazyFeed();

    return feed;
}

```

returns an array of posts metadata objects:
```js
[
  {
    pid: 'JzK-8crzmr76Uj7SkiP_XhD6Ig-B8N6OsSSSmOIL3g8',
    poster: 'vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0',
    timestamp: 1637349516,
    data: { text: 'stonks 📈📈', media: [] }
  },
  {
    pid: 'RfE5vkrluExB7Q-JgPFEr6PbbcWcmtq5emF64QkxN5w',
    poster: 'vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0',
    timestamp: 1637349516,
    data: { text: 'welcome to the PublicSquare! 👋', media: [] }
  },
  ...
]


```

### II) get posts TXIDs per address

code:
```js
// assuming the code is async-await
const address = "...";
const postsTxs = await getPostsOf(address);

```

output:

The same output of `getFeed()` but filtered for a single address.

## License
This project is licensed under the MIT license

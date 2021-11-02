# public-square-api
an api for the public-square Protocol

## Install

```
npm install public-square-api
```

## Examples

### I) get public-square's feed

code:
```javascript
import { getFeed } from "./public-square-api"

async function loadTribusFeed() {
    const feed = await getFeed();

    return feed;
}

```

output:

returns an object of `txid: content` entries:
```js
{ dsjYdFNFRF7YK13FBSw9V5_iBjf6FYbODX8_8XwvcTE: 'hello world! 🐘' }

```

### II) get posts TXIDs per address

code:
```js
// assuming the code is async-await
const address = "...";
const postsTxs = await getPostsOf(address);|

console.log(postsTxs)

```

output:

Array of Arweave data TXIDs

## License
This project is licensed under the MIT license

# Await

## A demo of using async/await to get results multiple HTTP requests

After successfully using promises for years, I wanted to wrap my head around the concept of `async/await`, introduced in ES7.

Until recently, this required all kinds of *Babel-Fu*, but NodeJS version 7.6 started supporting them natively, so gone are all the babel, plugins, webpack etc. modules from the package.json!

### The question

I figured out long ago, that the best way to learn new technology, is to solve a "real" problem with it. So this sample answers a very simple question: which of the leading search sites forces you to load more data (bytes) in order to see its front page?

### The answer

We simply `get` the front page of the 3 main search site (and you can easily add more sites - not just search engines, as long as they look like www.**name**.com), and compare the length of the body to the others.

### Module used

I started by using the NPM module [request-promise](https://www.npmjs.com/package/request-promise) that wraps the well-known [request](https://www.npmjs.com/package/request) module with promises support. But I later switched to [superagent](https://www.npmjs.com/package/superagent) - partly because I plan on using this code in a client-side demo next, and partly because it's much lighter. It now also supports `async/await` [out of the box](https://visionmedia.github.io/superagent/#promise-and-generator-support):

> SuperAgent's request is a "thenable" object that's compatible with JavaScript promises and async/await syntax. Do not call .end() if you're using promises.

The rest is pure JS.

### The method

1. An `async` function receives a site name, `get`s its body, and returns an object containing the site name and body length. Should an error occur, the length would be 0, and an error field will return. This would (potentially) allow us to filter out the erroneous results.
1. We then map the list of site names to promise calls, and use `Promise.all()` to get all of them.
1. After getting an array of results, we can use `Array.reduce()` to find the index of the longest text.

A sample result would look like this:

```bash
> node index

Mon Apr 03 2017 13:41:07 GMT-0700 (Pacific Daylight Time)
[ { site: 'google', length: 11475 },
  { site: 'yahoo', length: 419676 },
  { site: 'bing', length: 102672 } ]
longest response: yahoo
```

Note: the current date is printed, since the results are time dependent - they change all the time.

### Potential pitfalls

- A potential pitfall is the need to use `try-catch-finally` to handle an error situation, in lieu of using `Promise.reject()`.
- We also need to filter the results to weed out the error, as there's no `reject.all` available for `Promise.all()`.
- The last annoyance I encountered was a 'Parsing error: Unexpected token function' from ESLint on any `async` followed by `function`. This was solved by upping the "ecmaVersion" from 6 to 8 in the `.eslintrc` file.

const request = require('superagent');

async function aget(site) {
  let result = {site: site, length: 0};
  try {
    let response = await request.get(`http://www.${site}.com`);
    result.length = response.text.length;
  }
  catch(ex) {
    result.error = ex.message;
  }
  finally {
    return result;
  }
}

async function test() {
  const sites = ['google', 'yahoo', 'bing'];
  console.log(Date());
  let results = await Promise.all(sites.map(s => aget(s)));
  console.log(results);
  let largestIndex = results.reduce((prev, cur, i, arr) => cur.length > arr[prev].length ? i: prev, 0);
  console.log(`longest response: ${sites[largestIndex]}`);
}

test();

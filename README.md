# puppeteer-flights

Search for business class flights between continents

## How it works
You need to supply a list of to and from airports and a date. It can work one way or return flights (I think return is less accurate). Puppeteer will look at a little calendar widget and fetch prices from there.

You can also specify price ceiling to reduce search space.

Usage
```
npm i
node .
```

This should produce one json and one csv file with results.

## Motivation
Business class flights between New Zealand and Europe are extremely exhausting and expensive. You can save quite a bit by flying economy to places like Sydney or Melbourne and then Economy to your last stop. Also, taking one extra leg can be also quite a bit cheaper (especially on way from Europe to NZ/AU).

Moreover, all flight search websites seem to have implemented hoops from efficiently searching business class fares. Google will occasionally sneakily add Economy long haul leg, kiwi.com claims to be able to search between large areas (like Central Europe to Asia), but only does so for Economy class.
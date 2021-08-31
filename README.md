# puppeteer_demo
This repo aim to use puppeteer to crawler common web in china.

## 1. get chrome in docker
I recommend [browserless](https://github.com/browserless/chrome)'s chrome docker, it can remote clients to connect, drive, and execute headless work

```
docker run \
   -d \
   -p 9000:3000 \
   --shm-size 2gb \
   --name browserless9000 \
   --restart always \
   -e "DEBUG=browserless/chrome" \
   -e "MAX_CONCURRENT_SESSIONS=10" \
   browserless/chrome:latest
```

## 2. Installation
    npm install

## 3. introduce how to turn puppeteer into a normal chrome

## 4. use cases in crawler



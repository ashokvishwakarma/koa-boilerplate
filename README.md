# koajs-boilerplate
An easy getting started boilerplate using KoaJS, Mongoose, Kue and Koa-Router

## Files

```
koa-boilerplate/
  logs/
  src/
    config/
      api.js
      app.js
      database.js
      log.js
      mail.js
      redis.js
      session.js
      storage.js
      index.js
    controllers/
      AuthController.js
      UserController.js
    middlewares/
      auth.js
      params.js
      response.js
    models/
      User.js
    routes/
      auth.js
      user.js
      index.js
    utils/
      env.js
      file.js
      helper.js
      logger.js
      mail.js
      message.js
      queue.js
      routesLoader.js
      session.js
    index.js
  storage/
  template/
    email/
      common/
      layout.html
      register.html
  test/
    api.test.js
  .babelrc
  .env.example
  .gitignore
  .package.json
  README.md
```

## Commands

```
npm install // install dependencies
npm start // start application in dev mode
npm run build // build compiled files from source
npm run lint // Es6 linter
npm run test // run test using mocha
npm run prod // build and run from dist folder

// See package.json for more details
```

## Author

Ashok Vishwakarma

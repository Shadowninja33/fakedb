const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const cookieParser = require('cookie-parser');
const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');

const config = {
    name: 'babydriver-backend',
    port: 3000,
    host: '0.0.0.0',
};

const app = express();

const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));
app.use(cookieParser());

//databaseSystem.setupDatabaseSchema();

sessionSystem.setupServer(app);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the BabyDriver Backend REST API');
});

const userDataRoutes = require('./user-data-routes');
const contactRoutes = require('./contact-routes');
const imageRoutes = require('./image-routes');
const sessionRoutes = require('./session-routes');

app.get('/user/:id?', userDataRoutes);
app.put('/user', userDataRoutes);
app.post('/user/email', userDataRoutes);
app.post('/user/password', userDataRoutes);

app.post('/user/session', sessionRoutes);
app.delete('/user/session', sessionRoutes);

app.put('/user/contact', contactRoutes);
app.post('/user/contact', contactRoutes);
app.put('/user/contact/emergency', contactRoutes);
app.post('/user/contact/emergency', contactRoutes);

app.get('/user/picture/:userId', imageRoutes);
app.put('/user/picture', imageRoutes);
app.delete('/user/picture', imageRoutes);

app.use(function(err, req, res, next) {
    if (err.error_message && err.error_code && err.error_code == 500) {
        logger.error(err.error_message);
    }
    next(err);
});

app.use(function(err, req, res, next) {
    if (err.error_message && err.error_code) {
        res.status(err.error_code);
        res.send({
            code: err.error_code,
            error: err.error_message
        });
    } else {
        res.status(500);
        res.send({
            code: 500,
            error: err
        });
        //next(err);
    }
});

app.use(function(req, res, next) {
    res.status(404);
    res.send({
        code: 404,
        error: 'No such route'
    });
});

//connecting the express object to listen on a particular port as defined in the config object. 
app.listen(config.port, config.host, (e) => {
    if (e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

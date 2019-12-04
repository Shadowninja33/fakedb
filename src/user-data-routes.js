const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');
const passwordSystem = require('./password-system');

const router = require('express').Router();

router.put('/user', (req, res, next) => {
    if (!req.body.email) {
        next({
            error_code: 400,
            error_message: 'Missing email field'
        });
    } else if (!req.body.password) {
        next({
            error_code: 400,
            error_message: 'Missing password field'
        });
    } else {
        if (!req.body.school_user) {
            req.body.school_user = false;
        }
        var hashData = passwordSystem.saltHashPassword(req.body.password);
        databaseSystem.getSQLPool().query('INSERT INTO babydriver_users (email, password, password_salt, school_user) VALUES (?, ?, ?, ?)', [req.body.email, hashData.passwordHash, hashData.salt, req.body.school_user], function(err, result, fields) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.sqlMessage
                });
            } else {
                res.status(200).send({
                    action_result: {
                        user_id: result.insertId,
                        user_email: req.body.email,
                        school_user: req.body.school_user
                    }
                });
            }
        });
    }
});

router.post('/user/email', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.email) {
            next({
                error_code: 400,
                error_message: 'Missing email field'
            });
        } else {
            databaseSystem.getSQLPool().query('UPDATE babydriver_users SET email = ? WHERE id = ?', [req.body.email, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    sessionSystem.updateSession(req, req.body.email);
                    res.status(200).send({
                        action_result: {
                            new_user_email: req.body.email
                        }
                    });
                }
            });
        }
    }
});

router.post('/user/password', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.body.password) {
            next({
                error_code: 400,
                error_message: 'Missing password field'
            });
        } else {
            var hashData = passwordSystem.saltHashPassword(req.body.password);
            databaseSystem.getSQLPool().query('UPDATE babydriver_users SET password = ?, password_salt = ? WHERE id = ?', [hashData.passwordHash, hashData.salt, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: 'Password updated successfully'
                    });
                }
            });
        }
    }
});

router.get('/user/:id?', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.params.id) {
            res.status(200).send({
                action_result: sessionSystem.getUser(req)
            });
        } else {
            databaseSystem.getSQLPool().query('SELECT id, email FROM babydriver_users WHERE id = ?', [req.params.id], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else if (result.length == 0) {
                    next({
                        error_code: 404,
                        error_message: 'User not found'
                    });
                } else {
                    res.status(200).send({
                        action_result: result[0]
                    });
                }
            });
        }
    }
});

module.exports = router;
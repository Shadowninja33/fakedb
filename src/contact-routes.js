const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');

const router = require('express').Router();

router.put('/user/contact/emergency', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var phone = req.body.phone;

        if (!firstname || !lastname) {
            next({
                error_code: 400,
                error_message: 'Missing name field'
            });
        } else if (!email) {
            next({
                error_code: 400,
                error_message: 'Missing email field'
            });
        } else if (!phone) {
            next({
                error_code: 400,
                error_message: 'Missing phone number field'
            });
        } else {
            databaseSystem.getSQLPool().query('INSERT INTO emergency_contacts (user_id, first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?, ?)', [sessionSystem.getUser(req).user_id, firstname, lastname, email, phone], function(err, result, fields) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    res.status(200).send({
                        action_result: {
                            emergency_contact_id: result.insertId,
                            emergency_contact_first_name: firstname,
                            emergency_contact_last_name: lastname,
                            emergency_contact_email: email,
                            emergency_contact_phone: phone
                        }
                    });
                }
            });
        }
    }
});

router.post('/user/contact/emergency', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var id = req.body.contactid;
        if (!id) {
            next({
                error_code: 400,
                error_message: 'Missing emergency contact id'
            });
        } else {
            var updates = {};
            if (!updates.errored && req.body.firstname) {
                databaseSystem.getSQLPool().query('UPDATE emergency_contacts SET first_name = ? WHERE id = ?', [req.body.firstname, id], function(err, result, fields) {
                    if (err) {
                        updates.errored = true;
                        next({
                            error_code: 500,
                            error_message: err.sqlMessage
                        });
                    } else {
                        updates.new_firstname = req.body.firstname;
                    }
                });
            }
            if (!updates.errored  && req.body.lastname) {
                databaseSystem.getSQLPool().query('UPDATE emergency_contacts SET last_name = ? WHERE id = ?', [req.body.lastname, id], function(err, result, fields) {
                    if (err) {
                        updates.errored = true;
                        next({
                            error_code: 500,
                            error_message: err.sqlMessage
                        });
                    } else {
                        updates.new_lastname = req.body.lastname;
                    }
                });
            }
            if (!updates.errored && req.body.email) {
                databaseSystem.getSQLPool().query('UPDATE emergencycontacts SET email = ? WHERE id = ?', [req.body.email, id], function(err, result, fields) {
                    if (err) {
                        updates.errored = true;
                        next({
                            error_code: 500,
                            error_message: err.sqlMessage
                        });
                    } else {
                        updates.new_email = req.body.email;
                    }
                });
            }
            if (!updates.errored && req.body.phone) {
                databaseSystem.getSQLPool().query('UPDATE emergency_contacts SET phone_number = ? WHERE id = ?', [req.body.phone, id], function(err, result, fields) {
                    if (err) {
                        updates.errored = true;
                        next({
                            error_code: 500,
                            error_message: err.sqlMessage
                        });
                    } else {
                        updates.new_phone = req.body.phone;
                    }
                });
            }

            if (!updates.errored) {
                res.status(200).send({
                    action_result: updates
                });
            }
        }
    }
});

router.put('/user/contact', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var phone = req.body.phone;

        if (!firstname || !lastname) {
            next({
                error_code: 400,
                error_message: 'Missing name field'
            });
        } else if (!phone) {
            next({
                error_code: 400,
                error_message: 'Missing phone number field'
            });
        } else {
            databaseSystem.getSQLPool().query('INSERT INTO user_contacts (user_id, first_name, last_name, phone_number) VALUES (?, ?, ?, ?)', [sessionSystem.getUser(req).user_id, firstname, lastname, phone], function(err, result, fields) {
                if (err) {
                    next(err);
                } else {
                    res.status(200).send({
                        action_result: {
                            contact_first_name: firstname,
                            contact_last_name: lastname,
                            contact_phone_number: phone
                        }
                    });
                }
            });
        }
    }
});

router.post('/user/contact', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var updates = {};
        if (!updates.errored && req.body.firstname  && req.body.lastname) {
            databaseSystem.getSQLPool().query('UPDATE user_contacts SET first_name = ?, last_name = ? WHERE id = ?', [req.body.firstname, req.body.lastname, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    updates.errored = true;
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    updates.new_firstname = req.body.firstname;
                    updates.new_lastname = req.body.lastname;
                }
            });
        }
        if (!updates.errored && req.body.phone) {
            databaseSystem.getSQLPool().query('UPDATE user_contacts SET phone_number = ? WHERE id = ?', [req.body.phone, sessionSystem.getUser(req).user_id], function(err, result, fields) {
                if (err) {
                    updates.errored = true;
                    next({
                        error_code: 500,
                        error_message: err.sqlMessage
                    });
                } else {
                    updates.new_phone_number = req.body.phone;
                }
            });
        }

        if (!updates.errored) {
            res.status(200).send({
                action_result: updates
            });
        }
    }
});

module.exports = router;
const databaseSystem = require('./database-system');
const sessionSystem = require('./session-system');
const multer = require('multer');

const router = require('express').Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/user/picture/:userId', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        var userId = req.params.userId;

        if (!userId) {
            userId = sessionSystem.getUser(req).user_id;
        }

        databaseSystem.getMinio().getObject('profile-photos', userId + '.png', function(err, stream) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.message
                });
            } else {
                stream.pipe(res);
            }
        });
    }
});

router.put('/user/picture', upload.single('picture'), (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        if (!req.file || !req.file.buffer) {
            next({
                error_code: 400,
                error_message: 'No profile picture provided'
            });
        } else {
            databaseSystem.getMinio().putObject('profile-photos', sessionSystem.getUser(req).user_id + '.png', req.file.buffer, function(err, etag) {
                if (err) {
                    next({
                        error_code: 500,
                        error_message: err.message
                    });
                } else {
                    res.status(200).send({
                        action_result: 'Profile image updated'
                    });
                }
            });
        }
    }
});

router.delete('/user/picture', (req, res, next) => {
    if (sessionSystem.validateUserSession(req, res, next)) {
        databaseSystem.getMinio().removeObject('profile-photos', sessionSystem.getUser(req).user_id + '.png', function(err) {
            if (err) {
                next({
                    error_code: 500,
                    error_message: err.message
                });
            } else {
                res.status(200).send({
                    action_result: 'Profile image deleted'
                });
            }
        });
    }
});

module.exports = router;
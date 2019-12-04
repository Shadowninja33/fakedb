const mysql = require('mysql');
const redis = require('redis');
const minio = require('minio');

var sqlConnection = mysql.createPool({
    host: 'db',
    port: '3306',
    user: 'user',
    password: 'password',
    database: 'db'
});
  
var redisConnection = redis.createClient({
    host: 'redis',
    port: 6379
});

var minioConnection = new minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'minio123'
});

var getSQLPool = function() {
    return sqlConnection;
}

var getRedis = function() {
    return redisConnection;
}

var getMinio = function() {
    return minioConnection;
}

// var setupDatabaseSchema = function() {
//     sqlConnection.query('CREATE TABLE IF NOT EXISTS babydriver_users (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(50) NOT NULL, password VARCHAR(150) NOT NULL, password_salt VARCHAR(50) NOT NULL, school_user BOOLEAN NOT NULL default 0, PRIMARY KEY(id), UNIQUE INDEX email_index (email), INDEX user_type_index (school_user));', function (err, rows, fields) {
//         if (err) {
//             logger.error("Problem creating the user table " + err.sqlMessage);
//         }
//     });
//     minioConnection.bucketExists('profile-photos', function(checkErr, exists) {
//         if (checkErr) {
//             logger.error("Problem checking the profile photo bucket " + checkErr.message);
//         } else if (!exists) {
//             minioConnection.makeBucket('profile-photos', 'us-east-1', function(createErr) {
//                 if (createErr) {
//                     logger.error("Problem creating the profile photo bucket " + createErr.message);
//                 }
//             });
//         }
//     });
//     sqlConnection.query('CREATE TABLE IF NOT EXISTS user_contacts (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, name VARCHAR(50), phone_number VARCHAR(50), PRIMARY KEY(id), UNIQUE INDEX user_id_index (user_id));', function (err, rows, fields) {
//         if (err) {
//             logger.error("Problem creating the user contact table " + err.sqlMessage);
//         }
//     });
//     sqlConnection.query('CREATE TABLE IF NOT EXISTS emergency_contacts (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, name VARCHAR(50), email VARCHAR(50), phone_number VARCHAR(50), PRIMARY KEY(id), INDEX user_id_index (user_id));', function (err, rows, fields) {
//         if (err) {
//             logger.error("Problem creating the emergency contact table " + err.sqlMessage);
//         }
//     });
// }

module.exports = {
    getSQLPool,
    getRedis,
    getMinio,
//    setupDatabaseSchema
};

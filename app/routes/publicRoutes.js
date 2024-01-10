const express = require('express');
const { sayHiTest, sendDataTest, handleLoginC } = require('../controllers/publicController');
const router = express.Router();

// Define a GET route
router.get('/data', sayHiTest);

// Define a POST route
router.post('/data', sendDataTest);
router.post('/login', handleLoginC);

module.exports = router;
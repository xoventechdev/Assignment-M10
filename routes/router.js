const express = require('express');
const controller = require('../controllers/indexController')
const router = express.Router();

router.get('/', controller.getHome);
router.get('/file-create', controller.getFileCreate);
router.get('/file-upload', controller.getFileUpload);
router.get('/contact', controller.getContact);
router.get('/about', controller.getAbout);


router.post('/createFile', controller.createFile);


module.exports = router
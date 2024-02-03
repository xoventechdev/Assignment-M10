const fs = require('fs');
const path = require('path');

exports.getHome = (req, res) => {
    res.render('../views/index');
}

exports.getFileCreate = (req, res) => {
    res.render('../views/file-create', {text : '', status :''});
}

exports.getFileUpload = (req, res) => {
    res.render('../views/file-upload');
}

exports.getContact = (req, res) => {
    res.render('../views/contact');
}

exports.getAbout = (req, res) => {
    res.render('../views/about');
}


exports.createFile = (req, res) => {
    const fileName = req.body.fileName;
    const fileContent = req.body.fileContent;

    // fs.writeFile(path.resolve(__dirname, '..', 'res', fileName), fileContent, (err) => {
    fs.writeFile('./res/'+fileName, fileContent, (err) => {
        if (err) {
            res.render('../views/file-create', { text: `The file ${fileName} is not created`, status : 'warning'});
        } else {
            res.render('../views/file-create', { text: `The file ${fileName} has been created`, status : 'success'});
        }
    });
}

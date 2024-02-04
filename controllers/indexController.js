const fs = require('fs');
exports.getHome = (req, res) => {
    res.render('../views/index');
}

exports.getFileCreate = (req, res) => {

    let imageList = null;

    fs.readdir('./res/', function(err, files) {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            imageList = files;
            res.render('../views/file-create', { text: '', status: '', files: imageList });
        }
    });
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
        const files = fs.readdir('./res/');

        fs.writeFile('./res/' + fileName, fileContent,function (err){
            if (err) {
                res.send({text: `The file ${fileName} is not created`,
                status: 'warning'})
            }else {
                res.send({text: `The file ${req.body.fileName} has been created`,
                status: 'success'})
            }
        });

        
 
};

exports.deleteFile =  (req, res) => {
    const fileName = req.query.fileName;
    const files = fs.readdir('./res/');

    fs.unlink('./res/' + fileName, function(err) {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            res.render('../views/file-create', {
                text: `The file ${fileName} has been deleted`,
                status:'success',
                files: files
            });
        }
    });
}

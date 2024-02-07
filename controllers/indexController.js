const fs = require('fs');
const multer = require('multer');
const fileForge = require('express-fileforge'); 

exports.getHome = (req, res) => {
    res.render('../views/index');
}


exports.getFileCreate = (req, res) => {
    const allowedExtensions = ['txt', 'html', 'css', 'js', 'php'];
    fs.readdir('./res/', function(err, files) {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            const filteredFiles = files.filter(file => {
                const fileExtension = file.split('.').pop().toLowerCase();
                return allowedExtensions.includes(fileExtension);
            });
            res.render('../views/file-create', { text: '', status: '', files: filteredFiles });
        }
    });
};


exports.getFileUpload = (req, res) => {

    let imageListPromise = new Promise((resolve, reject) => {
        fs.readdir('./res/upload/multer/', function(err, files) {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(files);
        });
    });

    let imageListFileforgePromise = new Promise((resolve, reject) => {
        fs.readdir('./res/upload/fileforge/', function(err, filesFileforge) {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(filesFileforge);
        });
    });

    Promise.all([imageListPromise, imageListFileforgePromise])
        .then(([imageList, imageListFileforge]) => {
            res.render('../views/file-upload', { text: '', status: '', files: imageList, imageListFileforge: imageListFileforge });
        })
        .catch(err => {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
};


exports.getContact = (req, res) => {
    res.render('../views/contact');
}

exports.getAbout = (req, res) => {
    res.render('../views/about');
}



exports.createFile = (req, res) => {
    const fileName = req.body.fileName;
    const fileContent = req.body.fileContent;

    let fileExtension = '';
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
        fileExtension = fileName.slice(lastDotIndex + 1).toLowerCase();
    } else {
        return res.send({
            text: 'File extension is missing',
            status: 'warning'
        });
    }

    const allowedExtensions = ['txt', 'html', 'css', 'js', 'php'];
    if (!allowedExtensions.includes(fileExtension)) {
        return res.send({
            text: `File extension "${fileExtension}" is not allowed`,
            status: 'warning'
        });
    }

    fs.writeFile('./res/' + fileName, fileContent, function(err) {
        if (err) {
            return res.send({
                text: `The file ${fileName} is not created`,
                status: 'warning'
            });
        } else {
            return res.send({
                text: `The file ${req.body.fileName} has been created`,
                status: 'success'
            });
        }
    });
};


exports.deleteFile = (req, res) => {
    const fileName = req.query.fileName;

    fs.readdir('./res/', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        fs.unlink('./res/' + fileName, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            res.status(200).json({
                text: `The file ${fileName} has been deleted`,
                status: 'success',
                files: files
            });
        });
    });
};



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './res/upload/multer/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadToMulter = multer({ storage: storage });

exports.uploadMulter = (req, res) => {
    uploadToMulter.single('uploadMulter')(req, res, function(err) {
        if (err) {
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        } else {
            res.status(200).json({
                text: `The file ${req.file.originalname} has been uploaded`,
                status: 'success'
            });
        }
    });
};



exports.uploadFileforge = async (req, res) => {

    console.log(req);

    try {
        let uploadedFile = await fileForge.saveFile(req, path.resolve(__dirname),'res', 'abc.pdf');
        res.status(200).json({
            text: `The file ${uploadedFile} has been uploaded`,
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }

}


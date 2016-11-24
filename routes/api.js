let express = require('express'),
    router = express.Router(),
    config = require('../config.json'),
    multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.folderForFiles)
    },
    filename:    function(req, file, cb) {
        cb(null, file.originalname)
    }
});

let upload = multer({storage});

router.post('/sendFile', upload.single('file'), (req, res) => {
    function extractEmails() {
        let workbook = require('xlsx').readFile(config.folderForFiles + req.file.originalname);

        let worksheet = workbook.Sheets[workbook.SheetNames[0]];

        let r = [];

        for (let key in worksheet) {
            if (worksheet.hasOwnProperty(key) && key.indexOf('A') === 0) {
                r.push(worksheet[key].w);
            }
        }
        return r;
    }

    res.json(extractEmails());
});

module.exports = router;
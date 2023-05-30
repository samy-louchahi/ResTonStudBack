const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stuffCtrl = require('../controller/stuff');
const multer = require('../middleware/multerConfig');


router.get('/', stuffCtrl.getAllStuff);
router.post('/',multer, stuffCtrl.createThing);

router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth,multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);


module.exports = router;
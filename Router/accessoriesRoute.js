const express = require('express'); 
const accessControllers = require('../Controller/accessoriesController');

const router = express();

router.post('/',[ accessControllers.AddAccess]);
router.get('/',[  accessControllers.getAccess]);
router.put('/update/access/:id',[  accessControllers.updateAccess]);
router.delete('/:id',[ accessControllers.removeAccess])


module.exports = router;
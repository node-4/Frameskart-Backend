const express = require('express'); 
const bannerControllers = require('../Controller/bannerController');

const router = express();

router.post('/',[ bannerControllers.AddBanner]);
router.get('/',[  bannerControllers.getBanner]);
router.put('/updateBanner/:id',[  bannerControllers.updateBanner]);
router.delete('/:id',[ bannerControllers.removeBanner])


module.exports = router;
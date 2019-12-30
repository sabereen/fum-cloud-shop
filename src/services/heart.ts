const express = require('express');
const router = express.Router();



router.get('/heartbeat', function(req, res, next) {
  return res.status(200).json("Account Management is up and runing");
});

module.exports = router;
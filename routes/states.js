const express = require('express');
const router = express.Router();
const path = require('path');
const statesController = require('../controller/statesController');
const verifyStates = require('../middleware/verifyStates');

// // Test Route - Delete in Production
// router.get('/', (req, res) => {
//     res.send('GET all states route works');
// });

// // Test Route - Delete in Production
// router.get('/:state/capital', (req, res) => {
//     res.send(`Capital route works for ${req.params.state}`);
// });

// // Test Route - Delete in Production
// router.get('/:state', (req, res) => {
//     res.send(`GET state route works: ${req.params.state}`);
// });


// GET all states (handles ?contig=true/false)
router.get('/', statesController.getAllStates);

// Specific routes FIRST
router.route('/:state/funfact')
    .get(verifyStates, statesController.getFunfact)
    .post(verifyStates, statesController.createNewFunfact)
    .patch(verifyStates, statesController.updateFunfact)
    .delete(verifyStates, statesController.deleteFunfact); 

router.get('/:state/capital', verifyStates, statesController.getCapital);

router.get('/:state/nickname', verifyStates, statesController.getNickname);

router.get('/:state/population', verifyStates, statesController.getPopulation);

router.get('/:state/admission', verifyStates, statesController.getAdmission);

// General route LAST
router.get('/:state', verifyStates, statesController.getState);

module.exports = router;
const states = require('../model/statesData.json');

const codes = states.map(state => state.code.toUpperCase());

const verifyState = (req, res, next) => {
    const inputCode = req.params.state.toUpperCase();

    if (!codes.includes(inputCode)) {
        return res.status(404).json({message: "Invalid state abbreviation parameter"});
    }

    req.code = inputCode;

    next();
}

module.exports = verifyState;
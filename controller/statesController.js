const Funfacts = require('../model/Funfacts');
const statesData = require('../model/statesData.json');

// Get all states
const getAllStates = async (req, res) => {
    try {
        // Get all records from MongoDB
        const funfactsDB = await Funfacts.find();

        // merge JSON and Database data
        let merged = statesData.map(state => {
            const match = funfactsDB.find(
                db => db.stateCode === state.code
            );

            return match
                ? { ...state, funfacts: match.funfacts }
                : state;
        });

        // if contig query is provided, return contig or non-contig states list
        if (req.query.contig === 'true') {
            merged = merged.filter(s => !['AK', 'HI'].includes(s.code));
        } else if (req.query.contig === 'false') {
            merged = merged.filter(s => ['AK', 'HI'].includes(s.code));
        }

        res.json(merged);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get one state
const getState = async (req, res) => {
    try {
        // 1. Get state from JSON
        const stateJSON = statesData.find(
            s => s.code === req.params.state.toUpperCase()
        );

        // 2. Get funfacts from MongoDB
        const dbState = await Funfacts.findOne({
            stateCode: req.params.state.toUpperCase()
        });

        // 3. Merge JSON & Database data
        const result = dbState
            ? { ...stateJSON, funfacts: dbState.funfacts }
            : stateJSON;

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get random fun fact
const getFunfact = async (req, res) => {

    try {

        // get one record from DB
        const dbState = await Funfacts.findOne({
            stateCode: req.params.state.toUpperCase()
            }, 
            { funfacts: 1, _id: 0 }
        );

        const stateJSON = statesData.find(
            s => s.code === req.params.state.toUpperCase()
        );

        const state = stateJSON.state;

        if (!dbState || !dbState.funfacts || dbState.funfacts.length === 0) {
            return res.json({message: `No Fun Facts found for ${state}`});
        }

        const size = dbState.funfacts.length;
        const randomFact = dbState.funfacts[Math.floor(Math.random() * size)];
        res.json({ funfact: randomFact});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get admission
const getAdmission = (req, res) => {
    try {
        const stateJSON = statesData.find( s => s.code === req.params.state.toUpperCase());
        return res.json({ 
            state: stateJSON.state,
            admitted: stateJSON.admission_date
        });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

// Get nickname
const getNickname = (req, res) => {
    try {
        const stateJSON = statesData.find( s => s.code === req.params.state.toUpperCase());
        return res.json({ 
            state: stateJSON.state,
            nickname: stateJSON.nickname
        });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

// Get capital
const getCapital = (req, res) => {
    try {
        const stateJSON = statesData.find( s => s.code === req.params.state.toUpperCase());
        return res.json({ 
            state: stateJSON.state,
            capital: stateJSON.capital_city
        });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }  
};

// Get population
const getPopulation = (req, res) => {
    try {
        const stateJSON = statesData.find( s => s.code === req.params.state.toUpperCase());
        return res.json({ 
            state: stateJSON.state,
            population: stateJSON.population.toLocaleString()
        });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }    
};

// Create new funfact POST endpoint
const createNewFunfact = async (req, res) => {
    if (req.body.funfacts === undefined) {
        return res.status(400).json({ message: "State fun facts value required"});
    }
    else if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array"});
    }

    try {
        // get state record from DB
        const state = await Funfacts.findOne({ stateCode: req.params.state.toUpperCase() });
        
        // push array parameter to state record
        state.funfacts.push(...req.body.funfacts);
        await state.save();        

        // return updated record
        return res.status(201).json({ 
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v
         });
    } catch (err) {
        console.error(err);
    }
};

// Update funfact PATCH endpoint
const updateFunfact = async (req, res) => {
    try {
        // get single state data from JSON file
        const stateObj = statesData.find(s => s.code === req.params.state);

        // get single state record from DB
        const state = await Funfacts.findOne({ stateCode: req.params.state.toUpperCase() });

        if (req.body.index && req.body.funfact && state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateObj.state}` });
        } else if (!req.body.index) {
            return res.status(400).json({ message: "State fun fact index value required"});
        } else if (!req.body.funfact) {
            return res.status(400).json({ message: "State fun fact value required"});
        }
        
        // check for valid array index
        const index = req.body.index-1;        
        if ((index <= 0) || (index >= state.funfacts.length)) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateObj.state}`});
        }

        // push array parameter to state record
        state.funfacts[index] = req.body.funfact;
        await state.save();

        // return updated record
        return res.status(201).json({ 
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v
         });        
    } catch (err) {
        console.error(err);
    }
};

// Delete funfact DELETE endpoint
const deleteFunfact = async (req, res) => {
    try {
        // get single state data from JSON file
        const stateObj = statesData.find(s => s.code === req.params.state);

        // get single state record from DB
        const state = await Funfacts.findOne({ stateCode: req.params.state.toUpperCase() });

        if (req.body.index && state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateObj.state}` });
        } else if (!req.body.index) {
            return res.status(400).json({ message: "State fun fact index value required"});
        }

        // check for valid array index
        const index = req.body.index-1;        
        if ((index <= 0) || (index >= state.funfacts.length)) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${stateObj.state}`});
        }

        // delete array element from state record
        state.funfacts.splice(index, 1);
        await state.save();

        // return updated record
        return res.status(200).json({ 
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v
         });        
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getState,
    getAdmission,
    getNickname,
    getCapital,
    getPopulation,
    getAllStates,
    getFunfact,
    createNewFunfact,
    updateFunfact,
    deleteFunfact
};
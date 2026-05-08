# Final Project (Backend Web Development)- Node.js/Express and MongoDB REST API

This project is a RESTful API built with Node.js/Express and MongoDB. It allows users to retrieve and manage a collection of US states data such as state population, state admission date, and state fun facts.

Each state may or may not have an array of fun facts which is stored in a MongoDB database.

## Features

- RESTful API design
- Built with JavaScript, Node.js, and Express
- JSON-based responses for all endpoints
- Manage:
  - funfacts
- Non-relational database (MongoDB)
- Error handling for missing or invalid parameters

## Database Structure

The project uses a MongoDB database named StatesDB with one funfacts collection:

### funfacts Collection

- stateCode (type: String, required = true, unique = true)
- funfacts (type: [String])

## API Endpoints

Base URL:
https://final-project-states-api.onrender.com

---

### states Endpoints

- GET `/states` → Get all states and fun facts
- GET `/states/?config=true` → Get all state data for contiguous US states
- GET `/states/?config=false` → Get all state data for non-contiguous US states
- GET `/states/:state` → Get all data for the state URL parameter
- GET `/states/:state/funfact` → Get a random fun fact for the state URL parameter
- GET `/states/:state/capital` → Get {‘state’: stateName, ‘capital’: capitalName} for the state URL parameter
- GET `/states/:state/nickname` → Get {‘state’: stateName, ‘nickname’: nickname} for the state URL parameter
- GET `/states/:state/population` → Get {‘state’: stateName, ‘population’: population} for the state URL parameter
- GET `/states/:state/admission` → Get {‘state’: stateName, ‘admission’: admissionDate} for the state URL parameter
- POST `/states/:state/funfact` → Create new fun fact
- PATCH `/states/:state/funfact` → Update one fun fact
- DELETE `/states/:state/funfact` → Delete one fun fact

---

## Error Handling

The API provides clear JSON error messages for:

- Missing parameters
- Invalid requests
- Resource not found

## Technologies Used

- JavaScript (Object-Oriented Programming)
- Node.js/Express
- MongoDB (Non-relational Database)
- REST API architecture
- JSON

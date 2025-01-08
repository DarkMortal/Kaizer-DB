#!/usr/bin/env node

const readline = require('readline');
const executeQuery = require('./src/wrapper');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptInput() {
    rl.question('> ', input => {
        if (input) {
            if (input === null || input.trim() === ''){
                console.log("Please provide a valid input");
                promptInput();
            }
            else{
                let query = input.trim();
                executeQuery(query).then(_ => promptInput()).catch( err => {
                    if (typeof err === 'string') console.log(`Error: ${err}`);
                    else console.log("Error: Invalid query");
                    promptInput();
                });
            }
        } else {
            // Exit if no input is provided (Ctrl+D)
            console.log('Exiting...');
            rl.close();
        }
    });
}

// Listen for escape key
rl.on('SIGINT', () => {
    console.log('Exiting...');
    rl.close();
});

console.log("Kaizer-db Copyright 2024 (MIT License)\nDeveloped by Saptarshi Dey\nEnter input (Press Ctrl+D to exit):");
// Driver Code
promptInput();
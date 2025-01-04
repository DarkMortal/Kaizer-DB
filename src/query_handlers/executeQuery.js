const fs = require('fs');
const readline = require('readline');

// Utility function to create an array of empty strings of length n
const createNullArray = (n) => Array.from({ length: n }, () => '');

// Function to evaluate a logical expression from an array of booleans and operators
function calculateBooleanResult(booleanArray, operatorArray) {
    let i = 0;
    let evalString = booleanArray[i].toString();

    // Build the logical expression by iterating over the operatorArray
    while (i < operatorArray.length) {
        let op = '';
        if (operatorArray[i].toUpperCase() === 'OR') op = '||';
        if (operatorArray[i].toUpperCase() === 'AND') op = '&&';

        evalString += ` ${op} ${booleanArray[i + 1].toString()}`;
        i++;
    }

    return eval(evalString);  // Evaluate the boolean expression
}

// Function to evaluate a WHERE clause condition
function evaluateWhereClause(lhs, rhs, operator) {
    let x = parseFloat(lhs);
    let y = parseFloat(rhs);

    // If either lhs or rhs is not a number, handle them as strings
    if(isNaN(x) || isNaN(y)) {
        switch (operator) {
            case '=': return lhs == rhs;
            case '!=': return lhs != rhs;
            case '>': return lhs > rhs;
            case '<': return lhs < rhs;
            case '>=': return lhs >= rhs;
            case '<=': return lhs <= rhs;
            default: throw "Invalid operator";
        }
    } else {
        // Compare numerical values
        switch (operator) {
            case '=': return x == y;
            case '!=': return x != y;
            case '>': return x > y;
            case '<': return x < y;
            case '>=': return x >= y;
            case '<=': return x <= y;
            default: throw "Invalid operator";
        }
    }
}

// Class to wrap query operations on CSV tables
class queryWrapper {
    
    // Constructor to initialize the parent directory for table files
    constructor(options) {
        this.parentDir = options.parentDir.match(/\.*\/*(\w+)\/*/);

        if (this.parentDir === null || this.parentDir === undefined) {
            this.parentDir = ""; return;
        }
        this.parentDir = `${this.parentDir[1]}/`; // Set the directory path for table files

        // Create the directory if it does not exist
        if (!fs.existsSync(this.parentDir)) fs.mkdirSync(this.parentDir);
    }

    // Function to create a new table with the specified fields
    async createTable(tablename, fields) {
        const fileName = `./${this.parentDir}${tablename}.csv`;
        const fileContent = fields.join(',');

        // Check if the table already exists
        try {
            fs.accessSync(fileName, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
            throw "Table already exists";  // If exists, throw an error
        } catch (exc) {
            if (exc.toString() === "Table already exists") throw "Table already exists";
            fs.writeFileSync(fileName, fileContent, err => {
                if (err) throw err;
            });
        }
        return `Created Table: ${tablename}`;
    }

    // Function to insert records into an existing table
    async insertRecords(tablename, fields, tuples) {
        const fileName = `./${this.parentDir}${tablename}.csv`;

        // Validate tuple dimensions
        tuples.forEach((value, index) => {
            if (fields.length !== value.length) throw `Invalid tuple dimension for tuple ${index + 1}`;
        });
        let header = [];

        try {
            // Open the file to check if it exists
            fs.accessSync(fileName, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
            const fileStream = fs.createReadStream(fileName);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.once('line', (line) => {
                header = line.split(',');  // Read the header row
                rl.close();

                // Ensure the field dimensions match
                if (fields.length > header.length) throw "Invalid row size parameter";

                let headerMap = {};
                header.forEach((field, index) => headerMap[field] = index);  // Create a map for field names to indices

                let tempTupleArr = [];
                // Map the tuples to the corresponding field positions in the header
                for (let i = 0; i < tuples.length; i++) {

                    let tempArr = createNullArray(header.length);
                    fields.forEach((field, index) => {
                        if (header.includes(field)) tempArr[headerMap[field]] = tuples[i][index];
                        else throw `Invalid field name: ${field}`;
                    });
                    tempTupleArr.push(tempArr);
                }

                // Prepare the content to be appended to the file
                let fileContent = '\n';
                tempTupleArr.forEach(tuple => fileContent += `${tuple.join(',')}\n`);

                // Remove the last newline character and append the records to the file
                fileContent = fileContent.slice(0, -1);

                fs.appendFile(fileName, fileContent, err => {
                    if (err) throw err;
                });
            });

            return `${tuples.length} records written to Table: ${tablename}`;
        } catch (err) {
            // Handle file not found error
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Function to read data from a table with optional WHERE filtering
    async readTable(tablename, fields, whereClauses, operators) {
        if (fields.length !== 1 && fields[0] !== '*') fields.forEach(field => {
            if (/[^a-zA-Z0-9\s]/.test(field)) throw `Invalid field name: ${field}`;  // Validate field names
        });

        const fileName = `./${this.parentDir}${tablename}.csv`;

        try {
            const data = fs.readFileSync(fileName, 'utf8').split('\n');
            const header = data[0].split(',');
            let headerMap = {};
            header.forEach((field, index) => headerMap[field] = index);

            let result = [];

            for (let i = 1; i < data.length; i++) {
                let tupleData = data[i].split(',');

                let isThisTupleValid = true;

                // Apply WHERE clause filters
                if (whereClauses.length > 0) {
                    let booleanValues = [];

                    whereClauses.forEach(clause => {
                        if (!header.includes(clause.keyAttr)) throw `Invalid field in WHERE clause: ${clause.keyAttr}`;
                        const lhs = tupleData[headerMap[clause.keyAttr]];
                        const rhs = clause.keyAttrValue;
                        booleanValues.push(evaluateWhereClause(lhs, rhs, clause.comparator));  // Evaluate the condition for each WHERE clause
                    });

                    // Evaluate the overall result of the WHERE clauses using the operators
                    isThisTupleValid = calculateBooleanResult(booleanValues, operators);
                }

                if (!isThisTupleValid) continue;

                let tempData = {};
                // If fields is "*", return all fields; otherwise return only the requested ones
                if (fields.length === 1 && fields[0] === '*')
                    header.forEach(field => tempData[field] = tupleData[headerMap[field]]);
                else fields.forEach(field => {
                    if (header.includes(field)) tempData[field] = tupleData[headerMap[field]];
                    else throw `Invalid field name: ${field}`;
                });
                result.push(tempData);
            }

            return result;
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Function to update records in a table based on given WHERE conditions
    async updateTable(tablename, updateFields, whereClauses, operators) {

        const fileName = `./${this.parentDir}${tablename}.csv`;
        const tempFileName = `./${this.parentDir}${tablename}2.csv`;

        let recordsCount = 0;

        try {
            const data = fs.readFileSync(fileName, 'utf8').split('\n');
            const header = data[0].split(',');

            // Validate update fields and WHERE clauses
            updateFields.forEach(fields => {
                if (!header.includes(fields.field)) throw `Invalid field in UPDATE: ${fields.field}`;
            });

            whereClauses.forEach(clause => {
                if (!header.includes(clause.keyAttr)) throw `Invalid field in WHERE clause: ${clause.keyAttr}`;
            });

            const writeStream = fs.createWriteStream(tempFileName);
            writeStream.write(data[0]);
            let headerMap = {};
            header.forEach((field, index) => headerMap[field] = index);

            for (let i = 1; i < data.length; i++) {
                let tupleData = data[i].split(',');

                let isThisTupleValid = true;

                if (whereClauses.length > 0) {
                    let booleanValues = [];

                    whereClauses.forEach(clause => {
                        const lhs = tupleData[headerMap[clause.keyAttr]];
                        const rhs = clause.keyAttrValue;
                        booleanValues.push(evaluateWhereClause(lhs, rhs, clause.comparator));  // Evaluate WHERE clause conditions
                    });

                    isThisTupleValid = calculateBooleanResult(booleanValues, operators);
                }

                if (isThisTupleValid) {
                    // Update the fields that match the WHERE clause
                    updateFields.forEach(fields => {
                        tupleData[headerMap[fields.field]] = fields.value;
                    });
                    writeStream.write("\n" + tupleData.join(','));
                    recordsCount++;
                } else writeStream.write("\n" + data[i]);
            }

            await writeStream.close();
            await fs.unlinkSync(fileName);  // Remove old table
            await fs.renameSync(tempFileName, fileName);  // Rename the updated table

            return `${recordsCount} records updated`;
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Function to delete records in a table based on given WHERE conditions
    async deleteRecord(tablename, whereClauses, operators) {

        const fileName = `./${this.parentDir}${tablename}.csv`;
        const tempFileName = `./${this.parentDir}${tablename}2.csv`;

        let recordsCount = 0;

        try {
            const data = fs.readFileSync(fileName, 'utf8').split('\n');
            const header = data[0].split(',');

            // Validate WHERE clauses
            whereClauses.forEach(clause => {
                if (!header.includes(clause.keyAttr)) throw `Invalid field in WHERE clause: ${clause.keyAttr}`;
            });

            const writeStream = fs.createWriteStream(tempFileName);
            writeStream.write(data[0]);
            let headerMap = {};
            header.forEach((field, index) => headerMap[field] = index);

            for (let i = 1; i < data.length; i++) {
                let tupleData = data[i].split(',');

                let isThisTupleValid = true;

                if (whereClauses.length > 0) {
                    let booleanValues = [];

                    whereClauses.forEach(clause => {
                        const lhs = tupleData[headerMap[clause.keyAttr]];
                        const rhs = clause.keyAttrValue;
                        booleanValues.push(evaluateWhereClause(lhs, rhs, clause.comparator));  // Evaluate WHERE clause conditions
                    });

                    isThisTupleValid = calculateBooleanResult(booleanValues, operators);
                }

                if (isThisTupleValid) recordsCount++;  // Count the rows to be deleted
                else writeStream.write("\n" + data[i]);
            }

            await writeStream.close();
            await fs.unlinkSync(fileName);  // Remove old table
            await fs.renameSync(tempFileName, fileName);  // Rename the updated table

            return `${recordsCount} records deleted`;
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Function to list all the available tables
    async getTables() {
        const pattern = /(\w+).csv$/;
        let tables = [];
        let files = fs.readdirSync(`./${this.parentDir}`);
        files.forEach(file => {
            let match = file.match(pattern);
            if (match) tables.push({ 'Tables': match[1].trim() });  // Extract table names
        });
        return tables;
    }

    // Function to delete a specific table
    async deleteTable(tablename) {
        try {
            const fileName = `./${this.parentDir}${tablename}.csv`;
            fs.unlinkSync(fileName);  // Delete the table file
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            else throw err;
        }
    }
}

module.exports = queryWrapper;  // Export the queryWrapper class for use in other modules

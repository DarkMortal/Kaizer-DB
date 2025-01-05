const fs = require('fs');
const readline = require('readline');

// Creates an array of empty strings with specified length
const createNullArray = (n) => Array.from({ length: n }, () => '');

// Evaluates a series of boolean conditions connected by AND/OR operators
// Takes arrays of boolean values and operators, builds an evaluation string, and returns final result
function calculateBooleanResult(booleanArray, operatorArray) {
    let i = 0;
    let evalString = booleanArray[i].toString();

    while (i < operatorArray.length) {
        let op = '';
        if (operatorArray[i].toUpperCase() === 'OR') op = '||';
        if (operatorArray[i].toUpperCase() === 'AND') op = '&&';

        evalString += ` ${op} ${booleanArray[i + 1].toString()}`;
        i++;
    }

    return eval(evalString);
}

// Evaluates conditions in WHERE clauses by comparing two values with given operator
// Handles both numeric and string comparisons automatically
function evaluateWhereClause(lhs, rhs, operator){
    
    let x = parseFloat(lhs);
    let y = parseFloat(rhs);

    if(isNaN(x) || isNaN(y)) switch (operator) {
        case '=': return lhs == rhs;
        case '!=': return lhs != rhs;
        case '>': return lhs > rhs;
        case '<': return lhs < rhs;
        case '>=': return lhs >= rhs;
        case '<=': return lhs <= rhs;
        default: throw "Invalid operator";
    }
    
    else switch (operator) {
        case '=': return x == y;
        case '!=': return x != y;
        case '>': return x > y;
        case '<': return x < y;
        case '>=': return x >= y;
        case '<=': return x <= y;
        default: throw "Invalid operator";
    }
}

// Main class that handles CSV-based table operations similar to a simple database
// Supports creating, reading, updating, and deleting tables and records
class queryWrapper {

    // Initializes the database directory structure
    constructor(options) {
        this.parentDir = options.parentDir.match(/\.*\/*(\w+)\/*/);

        if (this.parentDir === null || this.parentDir === undefined) {
            this.parentDir = ""; return;
        }
        this.parentDir = `${this.parentDir[1]}/`;
        if (!fs.existsSync(this.parentDir)) fs.mkdirSync(this.parentDir);
    }

    // Creates a new CSV table with specified field names as headers
    // Throws error if table already exists
    async createTable(tablename, fields) {
        const fileName = `./${this.parentDir}${tablename}.csv`;
        const fileContent = fields.join(',');

        try {
            fs.accessSync(fileName, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
            throw "Table already exists";
        } catch (exc) {
            if (exc.toString() === "Table already exists") throw "Table already exists";
            fs.writeFileSync(fileName, fileContent, err => {
                if (err) throw err;
            });
        }
        return `Created Table: ${tablename}`;
    }

    // Inserts new records into existing table
    // Validates field names and tuple dimensions before insertion
    async insertRecords(tablename, fields, tuples) {
        const fileName = `./${this.parentDir}${tablename}.csv`;

        tuples.forEach((value, index) => {
            if (fields.length !== value.length) throw `Invalid tuple dimension for tuple ${index + 1}`;
        });
        let header = [];

        try{
            fs.accessSync(fileName, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
            const fileStream = fs.createReadStream(fileName);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.once('line', (line) => {
                header = line.split(',');
                rl.close();

                if (fields.length > header.length) throw "Invalid row size parameter";

                let headerMap = {};
                header.forEach((field, index) => headerMap[field] = index);

                let tempTupleArr = [];
                for (let i = 0; i < tuples.length; i++) {

                    let tempArr = createNullArray(header.length);
                    fields.forEach((field, index) => {
                        if (header.includes(field)) tempArr[headerMap[field]] = tuples[i][index];
                        else throw `Invalid field name: ${field}`;
                    });
                    tempTupleArr.push(tempArr);
                }

                let fileContent = '\n';
                tempTupleArr.forEach(tuple => fileContent += `${tuple.join(',')}\n`);

                // remove the last newline character
                fileContent = fileContent.slice(0, -1);

                // writing the records to the table
                fs.appendFile(fileName, fileContent, err => {
                    if (err) throw err;
                });
            });

            return `${tuples.length} records written to Table: ${tablename}`;
        }catch(err){
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Reads and filters table data based on specified fields and WHERE conditions
    // Supports selecting all fields (*) or specific fields
    async readTable(tablename, fields, whereClauses, operators) {
        if (fields.length !== 1 && fields[0] !== '*') fields.forEach(field => {
            if (/[^a-zA-Z0-9\s]/.test(field)) throw `Invalid field name: ${field}`;
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

                //TODO: filter tupleData based on whereClauses and operators
                if (whereClauses.length > 0) {

                    let booleanValues = [];

                    whereClauses.forEach(clause => {
                        if (!header.includes(clause.keyAttr)) throw `Invalid field in WHERE clause: ${clause.keyAttr}`;
                        const lhs = tupleData[headerMap[clause.keyAttr]];
                        const rhs = clause.keyAttrValue;
                        booleanValues.push(evaluateWhereClause(lhs, rhs, clause.comparator));
                    });

                    isThisTupleValid = calculateBooleanResult(booleanValues, operators);
                }

                if (!isThisTupleValid) continue;

                let tempData = {};
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

    // Updates records in table that match WHERE conditions
    // Creates a temporary file for updates to maintain data integrity
    async updateTable(tablename, updateFields, whereClauses, operators) {

        const fileName = `./${this.parentDir}${tablename}.csv`;
        const tempFileName = `./${this.parentDir}${tablename}2.csv`;

        let recordsCount = 0;

        try {
            const data = fs.readFileSync(fileName, 'utf8').split('\n');
            const header = data[0].split(',');

            //TODO: check if all fields are valid
            updateFields.forEach(fields => {
                if (!header.includes(fields.field)) throw `Invalid field in UPDATE: ${fields.field}`;
            });

            //TODO: check if all fields in WHERE clause are valid
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

                //TODO: filter tupleData based on whereClauses and operators
                if (whereClauses.length > 0) {

                    let booleanValues = [];

                    whereClauses.forEach(clause => {
                        //if(!header.includes(clause.keyAttr)) throw "Invalid field in WHERE clause";
                        const lhs = tupleData[headerMap[clause.keyAttr]];
                        const rhs = clause.keyAttrValue;
                        booleanValues.push(evaluateWhereClause(lhs, rhs, clause.comparator));
                    });

                    isThisTupleValid = calculateBooleanResult(booleanValues, operators);
                }

                if (isThisTupleValid) {
                    updateFields.forEach(fields => {
                        tupleData[headerMap[fields.field]] = fields.value;
                    });
                    writeStream.write("\n" + tupleData.join(','));
                    recordsCount++;
                } else writeStream.write("\n" + data[i]);
            }

            await writeStream.close();
            await fs.unlinkSync(fileName, err => console.info(err));
            await fs.renameSync(tempFileName, fileName, err => console.info(err));

            return `${recordsCount} records updated`;
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Deletes records from table that match WHERE conditions
    // Uses temporary file approach to maintain data integrity during deletion
    async deleteRecord(tablename, whereClauses, operators) {

        const fileName = `./${this.parentDir}${tablename}.csv`;
        const tempFileName = `./${this.parentDir}${tablename}2.csv`;

        let recordsCount = 0;

        try {
            const data = fs.readFileSync(fileName, 'utf8').split('\n');
            const header = data[0].split(',');

            //TODO: check if all fields in WHERE clause are valid
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

                //TODO: filter tupleData based on whereClauses and operators
                if (whereClauses.length > 0) {

                    let booleanValues = [];

                    whereClauses.forEach(clause => {
                        //if(!header.includes(clause.keyAttr)) throw "Invalid field in WHERE clause";
                        const lhs = tupleData[headerMap[clause.keyAttr]];
                        const rhs = clause.keyAttrValue;
                        booleanValues.push(evaluateWhereClause(lhs, rhs, clause.comparator));
                    });

                    isThisTupleValid = calculateBooleanResult(booleanValues, operators);
                }

                if (isThisTupleValid) recordsCount++;
                else writeStream.write("\n" + data[i]);
            }

            await writeStream.close();
            await fs.unlinkSync(fileName, err => console.info(err));
            await fs.renameSync(tempFileName, fileName, err => console.info(err));

            return `${recordsCount} records deleted`;
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            throw err;
        }
    }

    // Returns list of all tables in the database
    async getTables() {
        const pattern = /(\w+).csv$/;
        let tables = [];
        let files = fs.readdirSync(`./${this.parentDir}`);
        files.forEach(file => {
            let match = file.match(pattern);
            if (match) tables.push({ 'Tables': match[1].trim() });
        });
        return tables;
    }

    // Deletes an entire table from the database
    async deleteTable(tablename) {
        try {
            const fileName = `./${this.parentDir}${tablename}.csv`;
            fs.unlinkSync(fileName);
        } catch (err) {
            if (/no such file or directory/i.test(err.toString())) throw `No table named ${tablename} exists in the current database`;
            else throw err;
        }
    }
}

module.exports = queryWrapper;
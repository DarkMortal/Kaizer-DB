const regexDefault = /^\s*(SELECT|select|Select)\s+([\*,\s*,\w+]+)\s+(FROM|from|From)\s+[\',\"]*\s*([\w*]+)\s*[\',\"]*\s*\;$/;
const regexWhere = /^\s*(SELECT|select|Select)\s+([\*,\s*,\w+]+)\s+(FROM|from|From)\s+[\',\"]*\s*([\w*]+)[\',\"]*\s*(?:\s*(WHERE|where|Where)\s*(.*))?\;$/i;
const parseWhereRegex = /^\s*(\w+)\s*([=,>,<,>=,<=,!=]+)\s*[\',\"]*(\w+)[\',\"]*/;
const createTableRegex = /^\s*(CREATE|create|Create)\s+(TABLE|table|Table)\s+[\',\"]*\s*(\w+)\s*[\',\"]*\s+\((.*?)\)\;$/;
const insertTableRegex = /^\s*(INSERT|insert|Insert)\s+(INTO|into|Into)\s+[\',\"]*(\w+)[\',\"]*\s*\((.*?)\)\s*(VALUES|values|Values)\s*(.*)\;$/i;
const updateTableRegex = /^\s*(UPDATE|update|Update|)\s+(TABLE|table|Table)\s+[\',\"]*\s*(\w+)\s*[\',\"]*\s+(SET|set|Set)\s+(.*)?\s+(WHERE|where|Where)\s*(.*)?\;$/;
const deleteRecordRegex = /^\s*(DELETE|delete|Delete)\s+(FROM|from|From)\s+[\',\"]*\s*(\w+)\s*[\',\"]*\s+(WHERE|where|Where)\s*(.*)?\;$/;

const dropTableRegex = /^\s*(DROP|drop|Drop)\s+(TABLE|table|Table)\s+[\',\"]*\s*(\w+)\s*[\',\"]*\s*\;/;
const getTablesRegex = /^\s*(SHOW|show|Show)\s+(TABLES|tables|Tables)\s*\;$/;
const createDatabase = /^\s*(CREATE|create|Create|USE|use|Use)\s+(DATABASE|database|Database)\s+[\',\"]*\s*(\w+)\s*[\',\"]*\s*\;$/;

const regexDefaultOrder = /^\s*(SELECT|select|Select)\s+([\*,\s*,\w+]+)\s+(FROM|from|From)\s+[\',\"]*\s*([\w*]+)\s*[\',\"]*\s*(ORDER|Order|order)\s*(BY|By|by)\s*(\w*)\s*(\s*|ASC|Asc|asc|DESC|Desc|desc)\;$/;
const regexWhereOrder = /^\s*(SELECT|select|Select)\s+([\*,\s*,\w+]+)\s+(FROM|from|From)\s+[\',\"]*\s*([\w*]+)[\',\"]*\s*(?:\s*(WHERE|where|Where)\s*(.*))?\s*(ORDER|Order|order)\s*(BY|By|by)\s*(\w*)\s*(\s*|ASC|Asc|asc|DESC|Desc|desc)\;$/i;

const operatorArrayGlobal = ['AND','OR','and','or','And','Or'];
const validateName = (tablename) => /^[^_,^\d][a-zA-z](\w*)$/.test(tablename);

function parseQuery(queryStr) {

    var query = queryStr.match(getTablesRegex);
    if (query) return {type: "GET_ALL"}

    query = queryStr.match(createDatabase);
    if (query){
        let dbname = query[3].trim();
        if(!validateName(dbname)) throw "Invalid database name";
        return {database: dbname, type: "CREATE_DB"}
    }

    query = queryStr.match(dropTableRegex);
    if (query){
        let tablename_ = query[3].trim();
        if(!validateName(tablename_)) throw "Invalid table name";
        return {tablename: tablename_, type: "DELETE_TABLE"}
    }
    
    query = queryStr.match(regexDefault);
    if (query){
        let tablename = query[4];
        if(!validateName(tablename)) throw "Invalid Table Name";

        return {
            fields: query[2].split(',').map(s => s.trim()),
            table: tablename,
            whereClauses: [],
            operators: [],
            type: "READ"
        };
    }

    query = queryStr.match(regexDefaultOrder);
    if(query){
        let tablename = query[4];
        if(!validateName(tablename)) throw "Invalid Table Name";

        if(query[8] == '') throw "Sorting column can't be empty";

        let state = query[8].toLowerCase();
        if(state == '') state = 'asc';

        return {
            fields: query[2].split(',').map(s => s.trim()),
            table: tablename,
            whereClauses: [],
            operators: [],
            order_field: query[7],
            order_state: state,
            type: "READ_ORDER"
        };
    }

    query = queryStr.match(regexWhereOrder);
    if (query) {
        let tablename = query[4];
        if(!validateName(tablename)) throw "Invalid Table Name";

        if(query[9] == '') throw "Sorting column can't be empty";

        let clauses = [], operators = [];
        let whereClauseArray = query[6].split(/AND | OR | and | or | And | Or/i);
        whereClauseArray.forEach(clause => {
            let match = clause.match(parseWhereRegex);
            clauses.push({
                keyAttr: match[1],
                comparator: match[2],
                keyAttrValue: match[3]
            })
        });

        let operatorArray = query[6].split(/(<=|>=|<|>|=)/);
        operatorArray.forEach(operator => {
            let t_arr = operator.trim().split(/\s+/);
            if(t_arr.length > 1){
                if(t_arr.length === 3){
                    if(operatorArrayGlobal.includes(t_arr[1]))
                        operators.push(t_arr[1].toUpperCase());
                    else throw `Invalid Operator : ${t_arr[1]}`
                }else throw "Invalid query";
            }
        });

        let state = query[10].toLowerCase();
        if(state == '') state = 'asc';

        return {
            fields: query[2].split(',').map(s => s.trim()),
            table: tablename,
            whereClauses: clauses,
            operators: operators,
            order_field: query[9],
            order_state: state,
            type: "READ_ORDER"
        }
    };

    query = queryStr.match(regexWhere);
    if (query) {
        let tablename = query[4];
        if(!validateName(tablename)) throw "Invalid Table Name";

        let clauses = [], operators_ = [];
        let whereClauseArray = query[6].split(/AND | OR | and | or | And | Or/i);
        whereClauseArray.forEach(clause => {
            let match = clause.match(parseWhereRegex);
            clauses.push({
                keyAttr: match[1],
                comparator: match[2],
                keyAttrValue: match[3]
            })
        });

        let operatorArray = query[6].split(/(<=|>=|<|>|=)/);
        operatorArray.forEach(operator => {
            let t_arr = operator.trim().split(/\s+/);
            if(t_arr.length > 1){
                if(t_arr.length === 3){
                    if(operatorArrayGlobal.includes(t_arr[1]))
                        operators_.push(t_arr[1].toUpperCase());
                    else throw `Invalid Operator : ${t_arr[1]}`
                }else throw "Invalid query";
            }
        });

        return {
            fields: query[2].split(',').map(s => s.trim()),
            table: tablename,
            whereClauses: clauses,
            operators: operators_,
            type: "READ"
        }
    };

    query = queryStr.match(updateTableRegex);
    if(query){
        let tablename = query[3];
        if(!validateName(tablename)) throw "Invalid Table Name";

        let updateFields_ = [], whereClauses_ = [], operators_ = [];

        query[5].split(',').map(s => s.trim()).forEach(e => {
            let match = e.match(parseWhereRegex);
            if(match[2] !== '=') throw 'Invalid assignment operator';
            updateFields_.push({
                field: match[1],
                value: match[3]
            });
        });
        query[7].split(/AND | OR | and | or | And | Or/i).map(s => s.trim()).forEach(e => {
            let match = e.match(parseWhereRegex);
            whereClauses_.push({
                keyAttr: match[1],
                comparator: match[2],
                keyAttrValue: match[3]
            });
        });
        let operatorArray = query[7].split(/(<=|>=|<|>|=)/);
        operatorArray.forEach(operator => {
            let t_arr = operator.trim().split(/\s+/);
            if(t_arr.length > 1){
                if(t_arr.length === 3){
                    if(operatorArrayGlobal.includes(t_arr[1]))
                        operators_.push(t_arr[1].toUpperCase());
                    else throw `Invalid Operator : ${t_arr[1]}`
                }else throw "Invalid query";
            }
        });

        return {
            table: tablename,
            updateFields: updateFields_,
            whereClauses: whereClauses_,
            operators: operators_,
            type: "UPDATE"
        };
    }

    query = queryStr.match(createTableRegex);
    if(query) {
        let tablename = query[3];
        if(!validateName(tablename)) throw "Invalid Table Name";

        return {
            fields: query[4].split(',').map(s => s.trim()),
            table: tablename,
            type: "CREATE"
        }
    }

    query = queryStr.match(insertTableRegex);
    if(query) {
        let tablename = query[3];
        if(!validateName(tablename)) throw "Invalid Table Name";

        let fields = query[4].split(',').map(s => s.trim().match(/[\',\"]*\s*(\w+)[\',\"]*\s*/)[1]);
        let inputTuples = query[6].match(/\(([^)]+)\)/g);
        let tuplesArray = [];
        inputTuples.forEach(tuple => tuplesArray.push(tuple.slice(1,-1).split(',').map(s => s.trim().match(/[\',\"]*\s*(\w+)[\',\"]*\s*/)[1])));
        
        return {
            fields: fields,
            values: tuplesArray,
            table: tablename,
            type: "INSERT"
        }
    }

    query = queryStr.match(deleteRecordRegex);
    if(query){
        let tablename = query[3];
        if(!validateName(tablename)) throw "Invalid Table Name";

        let whereClauses_ = [], operators_ = [];
        query[5].split(/AND | OR | and | or | And | Or/i).map(s => s.trim()).forEach(e => {
            let match = e.match(parseWhereRegex);
            whereClauses_.push({
                keyAttr: match[1],
                comparator: match[2],
                keyAttrValue: match[3]
            });
        });
        let operatorArray = query[5].split(/(<=|>=|<|>|=)/);
        operatorArray.forEach(operator => {
            let t_arr = operator.trim().split(/\s+/);
            if(t_arr.length > 1){
                if(t_arr.length === 3){
                    if(operatorArrayGlobal.includes(t_arr[1]))
                        operators_.push(t_arr[1].toUpperCase());
                    else throw `Invalid Operator : ${t_arr[1]}`
                }else throw "Invalid query";
            }
        });

        return {
            table: tablename,
            whereClauses: whereClauses_,
            operators: operators_,
            type: "DELETE"
        };
    }

    throw "Invalid query";
}

module.exports = parseQuery;
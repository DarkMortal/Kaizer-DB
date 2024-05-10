const parseQuery = require('../query_handlers/queryParser');
const queryWrapper = require('../query_handlers/executeQuery');
const table = require('./tableViewer');

let wrapper = null;

async function executeQuery(query) {
    let parsedQuery = parseQuery(query);
    let queryResult = null;

    if (parsedQuery.type === "GET_ALL"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        queryResult = await wrapper.getTables();
        if(queryResult.length > 0) table(queryResult);
        console.log(`Total number of Tables: ${queryResult.length}`);
    }
    if (parsedQuery.type === "DELETE_TABLE"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        await wrapper.deleteTable(parsedQuery.tablename);
        console.log(`Deleted Table: ${parsedQuery.tablename}`);
    }
    if (parsedQuery.type === "CREATE_DB"){
        wrapper = new queryWrapper({parentDir: parsedQuery.database});
        console.log(`Using database: ${parsedQuery.database}`);
    }
    if (parsedQuery.type === "CREATE"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        queryResult = await wrapper.createTable(parsedQuery.table, parsedQuery.fields);
        console.log(queryResult);
    }
    if (parsedQuery.type === "INSERT"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        queryResult = await wrapper.insertRecords(parsedQuery.table, parsedQuery.fields, parsedQuery.values);
        console.log(queryResult);
    }
    if (parsedQuery.type === "READ"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        queryResult = await wrapper.readTable(parsedQuery.table, parsedQuery.fields, parsedQuery.whereClauses, parsedQuery.operators);
        if(queryResult.length > 0) table(queryResult);
        console.log(`${queryResult.length} rows returned`);
    }
    if (parsedQuery.type === "UPDATE"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        queryResult = await wrapper.updateTable(parsedQuery.table, parsedQuery.updateFields, parsedQuery.whereClauses, parsedQuery.operators);
        console.log(queryResult);
    }
    if (parsedQuery.type === "DELETE"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";
        queryResult = await wrapper.deleteRecord(parsedQuery.table, parsedQuery.whereClauses, parsedQuery.operators);
        console.log(queryResult);
    }
}

module.exports = executeQuery;
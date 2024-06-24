const parseQuery = require('./query_handlers/queryParser');
const queryWrapper = require('./query_handlers/executeQuery');
const table = require('./modules/tableViewer');
const sort_tuples = require('./modules/sortingTuples');

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
    if (parsedQuery.type === "READ" || parsedQuery.type === "READ_ORDER"){
        if(wrapper === null || wrapper === undefined) throw "No Database selected";

        // if there is ORDER BY clause then that field needs to be included in the list of fields
        if(parsedQuery.type === "READ_ORDER"){
            if(parsedQuery.fields.length == 1){
                if(parsedQuery.fields[0] !== '*' && parsedQuery.fields[0] !== parsedQuery.order_field) throw "Order by field needs to be included in fetch list";
            }
            if(parsedQuery.fields.length > 1){
                if(!parsedQuery.fields.includes(parsedQuery.order_field)) throw "Order by field needs to be included in fetch list";
            }
        }

        queryResult = await wrapper.readTable(parsedQuery.table, parsedQuery.fields, parsedQuery.whereClauses, parsedQuery.operators);
        if(queryResult.length > 0){
            if(parsedQuery.type === "READ_ORDER")
                queryResult.sort(sort_tuples(parsedQuery.order_field, parsedQuery.order_state));
            table(queryResult);
        }
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
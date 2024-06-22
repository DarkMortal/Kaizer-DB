const parseQuery = require('../src/query_handlers/queryParser');
const queryWrapper = require('../src/query_handlers/executeQuery');
const sort_tuples = require('../src/query_handlers/modules/sortingTuples');

let wrapper = new queryWrapper({ parentDir: "tests" });

test("Test Case 3", async () => {
    let parsedQuery = parseQuery("Select Name, PowerLevel, Defense from test_data where Attack > 200 Order by Defense;");
    let queryResult = await wrapper.readTable(parsedQuery.table, parsedQuery.fields, parsedQuery.whereClauses, parsedQuery.operators);
    queryResult.sort(sort_tuples(parsedQuery.order_field, parsedQuery.order_state));

    expect(parsedQuery).toStrictEqual({
        fields: ['Name', 'PowerLevel', 'Defense'],
        table: 'test_data',
        whereClauses: [{ keyAttr: 'Attack', comparator: '>', keyAttrValue: '200' }],
        operators: [],
        order_field: 'Defense',
        order_state: 'asc',
        type: 'READ_ORDER'
    });

    expect(queryResult).toStrictEqual([
        { Name: 'Rykon_Hayashi', PowerLevel: '8100', Defense: '310' },
        { Name: 'Arkon_Hayashi', PowerLevel: '8000', Defense: '330' },
        { Name: 'Kakarot_Uchiha', PowerLevel: '9001', Defense: '340' },
        { Name: 'Drago_Uzumaki', PowerLevel: '8010', Defense: '350' }
    ]);
});
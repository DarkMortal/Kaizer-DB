const parseQuery = require('../source_files/query_handlers/queryParser');
const queryWrapper = require('../source_files/query_handlers/executeQuery');

let wrapper = new queryWrapper({ parentDir: "tests" });

test("Test case 2", async () => {
    let parsedQuery = parseQuery("Select Name, PowerLevel from test_data where Attack > 200 and Defense >= 340;");
    let queryResult = await wrapper.readTable(parsedQuery.table, parsedQuery.fields, parsedQuery.whereClauses, parsedQuery.operators);

    expect(parsedQuery).toStrictEqual({
        fields: ['Name', 'PowerLevel'],
        table: 'test_data',
        whereClauses: [
            { keyAttr: 'Attack', comparator: '>', keyAttrValue: '200' },
            { keyAttr: 'Defense', comparator: '>=', keyAttrValue: '340' }
        ],
        operators: ['AND'],
        type: 'READ'
    });

    expect(queryResult).toStrictEqual([
        { Name: 'Kakarot_Uchiha', PowerLevel: '9001' },
        { Name: 'Drago_Uzumaki', PowerLevel: '8010' }
    ]);
});
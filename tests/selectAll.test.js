const parseQuery = require('../query_handlers/queryParser');
const queryWrapper = require('../query_handlers/executeQuery');

let wrapper = new queryWrapper({ parentDir: "tests" });

test("Test case 1", async () => {
    let parsedQuery = parseQuery("Select * from test_data where Attack > 200 and Defense >= 340;");
    let queryResult = await wrapper.readTable(parsedQuery.table, parsedQuery.fields, parsedQuery.whereClauses, parsedQuery.operators);

    expect(parsedQuery).toStrictEqual({
        fields: ['*'],
        table: 'test_data',
        whereClauses: [
            { keyAttr: 'Attack', comparator: '>', keyAttrValue: '200' },
            { keyAttr: 'Defense', comparator: '>=', keyAttrValue: '340' }
        ],
        operators: ['AND'],
        type: 'READ'
    });

    expect(queryResult).toStrictEqual([
        {
            Name: 'Kakarot_Uchiha',
            Attack: '500',
            Defense: '340',
            PowerLevel: '9001'
        },
        {
            Name: 'Drago_Uzumaki',
            Attack: '460',
            Defense: '350',
            PowerLevel: '8010'
        }
    ]);
});
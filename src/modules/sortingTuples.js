function sort_tuples(key, order){
    return function compare(a, b){
        let val1 = a[key], val2 = b[key];
        try{
            val1 = parseFloat(val1);
            val2 = parseFloat(val2);
        }catch{
            // do nothing
        }
        if(val1 < val2){
            if (order == 'asc') return -1;
            if (order == 'desc') return 1;
        }
        if(val1 > val2){
            if (order == 'asc') return 1;
            if (order == 'desc') return -1;
        }
        return 0;
    }
}

module.exports = sort_tuples;
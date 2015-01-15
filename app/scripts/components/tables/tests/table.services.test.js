describe('Table Service:', function () {

    beforeEach(module('ngApp.components', 'tables.services','tablicious.directive'));

    var testColumns = [{
        id:'a',
        enabled:true,
    },{
        id:'b',
        enabled:false,
    }]


    describe('finding out if an element in an array is enabled',function(){
        describe('returning true or false when passed an array and an id',function(){
            it("should return true if the array has an object with a matching id and that object has a property enabled and that property is true",inject(function(TableService){
                assert.isTrue(TableService.objectWithMatchingIdInArrayIsEnabled(testColumns,'a'));
            }))
            it("should return false if the array has an object with a matching ID and that object has an undefined enabled property or it is false",inject(function(TableService){
                assert.isFalse(TableService.objectWithMatchingIdInArrayIsEnabled(testColumns,'b'));
            }))
            it("should return undefined if the array has no element with that id",inject(function(TableService){
                assert.isUndefined(TableService.objectWithMatchingIdInArrayIsEnabled(testColumns,'c'))
            }));
        });
    })

    describe("validaitng the provided data against the config",function(){

        var sampleConfig = {
            order:['a,b'],
            headings:[{
                displayName:"a",
                id:"a",
            }, {
                displayName:"b",
                id:"b",
            }]
        };

        // TODO - TEST ALL THE THINGS
        describe("validating the congruency of the data",function(){
            it('should return true when data is congruent',inject(function(TableService){
                var sampleData = [
                    {a:1,b:2,d:3},
                    {a:4,b:5,d:6},
                    {a:7,b:8,d:9}
                ];

                assert.isTrue(TableService.dataIsCongruent(sampleData));
            }));

            it('should return false  if the data is non-congruent',inject(function(TableService){
                var sampleData = [
                    {a:1,b:2,d:3},
                    {a:4,e:5,f:6},
                    {c:7,b:8,g:9}
                ];

                assert.isFalse(TableService.dataIsCongruent(sampleData));
            }));
        })

    });

    describe("flattening nested data",function(){
        var sampleConfig = {
            order:['a,b,c'],
            headings:[{
                id:"a",
                children:[{
                    id:"b"
                    },{
                    id:"c",
                    }
                ]
            }]
        };

        it("should flatten a nested object",inject(function(TableService){
            var sampleData = {a:{
                b:1,
                c:2
            }};

            var flattenedObject = TableService.flattenObjectAtKey(sampleData,'a');
            assert.equal(flattenedObject.c, 2);
            assert.equal(flattenedObject.b, 1);

        }));

        it("should flatten a nested array",inject(function(TableService){
            var sampleData = [{a:{
                b:1,
                c:2
            }},{a:{
                b:1,
                c:2
            }}];

            var key = "a";

            var flattenedData = TableService.flattenArrayAtKey(sampleData,key);

            flattenedData.forEach(function(datum,index){
                assert.equal(datum.c, sampleData[index][key].c);
                assert.equal(datum.b, sampleData[index][key].b);
            })

        }));
    })

    describe("turning an object into an array",function(){
        var sampleObject = {a:1,b:2,c:3,d:'red',e:10e4, f:[]};

        describe("how it takes an object and turns it into an array of objects each with a key and value property",function(){
            it('should make an array where every member of the array has two properties, ID and val',inject(function(TableService){

                var result = TableService.objectToArray(sampleObject);
                result.forEach(function(tuple){
                    assert.isTrue(tuple.hasOwnProperty('id'));
                    assert.isTrue(tuple.hasOwnProperty('val'));
                })

            }));

            it('should make an array which has a length equal to the number of keys in the object provided',inject(function(TableService){
                var result = TableService.objectToArray(sampleObject);
                assert.equal(result.length, _.keys(sampleObject).length);
            }))

            it('should make an array where each value of the original object is found as the val property of the subarray with the ID property matching the object key',inject(function(TableService){
                var result = TableService.objectToArray(sampleObject);
                result.forEach(function(tuple){
                    assert.equal(tuple.val,sampleObject[tuple.id]);
                });
            }));

            it('should not be missing any data',inject(function(TableService){
                var result = TableService.objectToArray(sampleObject);
                _.keys(sampleObject).forEach(function(key){
                    var matchingTuple = _.find(result,function(tuple){
                        return tuple.id === key;
                    })
                    assert.isDefined(matchingTuple);
                    assert.equal(sampleObject[key], matchingTuple.val);
                })
            }));

        })
    })

    describe("expanding the headings in a table configuration object",function(){

        var sampleHeadings = [{
            displayName:"A",
            id:"a",
        }, {
            displayName:"B",
            id:"b",
            children:[{
                displayName:"C",
                id:"c",
            },
            {
                displayName:"D",
                id:"d",
            }]
        }];

        it('should return an array with the nested headings at the top level',inject(function(TableService){
            var expandedHeadings = TableService.expandHeadings(sampleHeadings);
            assert.equal(expandedHeadings.length, 4);

            var columnC = _.find(expandedHeadings,function(heading){return heading.id === 'c'});
            assert.isDefined(columnC);
            assert.equal(columnC.displayName, 'C');
        }));


    })


});

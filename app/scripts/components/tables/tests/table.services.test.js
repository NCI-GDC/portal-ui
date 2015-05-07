describe('Table Service:', function () {

    beforeEach(module('ngApp.components', 'tables.services','tableicious.directive','tables.validator'));

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
            it('should return true when data is congruent',inject(function(TableValidator){
                var sampleData = [
                    {a:1,b:2,d:3},
                    {a:4,b:5,d:6},
                    {a:7,b:8,d:9}
                ];

                assert.isTrue(TableValidator.dataIsCongruent(sampleData));
            }));

            it('should not return true  if the data is non-congruent',inject(function(TableValidator){
                var sampleData = [
                    {a:1,b:2,d:3},
                    {a:4,e:5,f:6},
                    {c:7,b:8,g:9}
                ];

                assert.isFalse(TableValidator.dataIsCongruent(sampleData) === true);
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


    });

    describe('Getting the rowspan and colspan of a heading', function() {
        describe("how it returns how many rows tall a heading should be",function(){
            it('returns 2 for a heading with no children', inject(function(TableService) {
                var heading = {id:'a',displayName:'A'};
                assert.equal(TableService.getHeadingRowSpan(heading), 2);
            }));
            it('returns 1 for a heading with one or more children', inject(function(TableService) {
                var heading = {
                    id:'a',
                    displayName:'A',
                    children:[
                        {id:'b',displayName:"B"},
                        {id:'c',displayName:"C"}
                    ]};
                assert.equal(TableService.getHeadingRowSpan(heading), 1);
            }));

        })
    });

    describe("Determining when a column should be enabled",function(){
        describe("The behaviour when the heading has no enabled property",function() {
            it("should return true if no condition is defined", inject(function (TableService) {
                var heading = {
                    id: 'a',
                    displayName: 'A',
                };

                var $scope = {};

                assert.isTrue(TableService.getHeadingEnabled(heading, $scope));
            }));
        });

        describe("the behavior when a property is defined",function(){

            it("should return false if a condition is defined but not met",inject(function(TableService) {
                var heading = {
                    id:'a',
                    displayName:'A',
                    enabled:function($scope){
                        return $scope.a === 'B';
                    }
                };

                var $scope = {a:"A"};

                assert.isFalse(TableService.getHeadingEnabled(heading,$scope));
            }));

            it("should return true if a condition is defined and is met",inject(function(TableService) {
                var heading = {
                    id:'a',
                    displayName:'A',
                    enabled:function($scope){
                        return $scope.a === 'A';
                    }
                };

                var $scope = {a:"A"};

                assert.isTrue(TableService.getHeadingEnabled(heading,$scope));
            }));

            it("should return true if a condition is defined and is met",inject(function(TableService) {
                var heading = {
                    id:'a',
                    displayName:'A',
                    enabled:function($scope){
                        return $scope.a === 'A';
                    }
                };

                var $scope = {a:"A"};

                assert.isTrue(TableService.getHeadingEnabled(heading,$scope));
            }));

            it("should throw an error if the enabled function throws an error",inject(function(TableService) {
                var heading = {
                    id:'a',
                    displayName:'A',
                    enabled:function($scope){
                        return $scope.a === $scope.a.b.c;
                    }
                };

                var $scope = {a:"A"};

                expect(function(){
                    TableService.getHeadingEnabled(heading,$scope);
                }).to.throw()
            }));

        })
    });

    describe("getting the value of an entity in an array of tuples",function(){
        it ("should return the right value when passed a valid array and ID",inject(function(TableService){
            var tuples = [{
                id:"a",
                val:"A"
            },{
                id:"b",
                val:"B"
            }];

            expect(TableService.getValueFromRow(tuples,'a')).to.equal('A');
            expect(TableService.getValueFromRow(tuples,'b')).to.equal('B');
        }));

        it ("should return undefined if the tuple with that ID can't be found",inject(function(TableService){
            var tuples = [{
                id:"c",
                val:"C"
            },{
                id:"d",
                val:"D"
            }];

            expect(TableService.getValueFromRow(tuples,'a')).to.be.undefined;
            expect(TableService.getValueFromRow(tuples,'b')).to.be.undefined;
        }));

    });

    describe('extracting nested values from tuples using a string',function(){
        it("should be the same as just finding a value if the string has no delimiters",inject(function(TableService){
            var tuples = [{
                id:"bin",
                val:"baz"
            }];

            expect(TableService.delimitedStringToValue('bin',tuples)).to.be.equal('baz');
        }))

        it("should dig into the values to find the correct one if there is a delimited string",inject(function(TableService){
            var tuples = [{
                id:"bin",
                val:"baz"
            },{
                id:"quo",
                val:{
                    foo:'bar'
                }
            },{
                id:"nim",
                val:{
                    foo:{
                        zab:"zoo"
                    }
                }
            }];

            expect(TableService.delimitedStringToValue('quo.foo',tuples)).to.be.equal('bar');
            expect(TableService.delimitedStringToValue('nim.foo.zab',tuples)).to.be.equal('zoo');
        }))

        it("should accept a custom delimiter",inject(function(TableService){
            var tuples = [{
                id:"quo",
                val:{
                    foo:'bar'
                }
            }];

            expect(TableService.delimitedStringToValue('quo!foo',tuples,'!')).to.be.equal('bar');
        }))

        it("should return undefined if the path defined is impossible",inject(function(TableService){
            var tuples = [{
                id:"quo",
                val:{
                    foo:{
                        zab:"zoo"
                    }
                }
            }];

            expect(TableService.delimitedStringToValue('quo.zim.gir',tuples)).to.be.undefined;
        }))
    });

    describe("templating the contents of a cell",function(){
        // todo
        //it ("should return the value of that cell if no template is defined",inject(function(TableService){
        //    var heading = [{
        //        id:"foo",
        //        displayName:"FOO"
        //    }];
        //
        //    expect(TableService.getTemplate(heading,{id:'foo',val:'bar'},[{id:'foo',val:'bar'}]).to.equal('bar'));
        //}));
    })


});

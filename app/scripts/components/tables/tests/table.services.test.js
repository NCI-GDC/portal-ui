describe('Table Service:', function () {

    beforeEach(module('ngApp.components', 'tables.services'));

    var testColumns = [{
        id:'a',
        enabled:false,
    },{
        id:'b',
        enabled:true,
    }]


    describe('finding out if an element in an array is enabled',function(){
        describe('returning true or false when passed an array and an id',function(){
            it("should return true if the array has an object with a matching id and that object has a property enabled and that property is true",inject(function(TableService){
                assert.isFalse(TableService.objectWithMatchingIdInArrayIsEnabled(testColumns,'a'));
            }))
            it("should return false if the array has an object with a matching ID and that object has an undefined enabled property or it is false",inject(function(TableService){
                assert.isTrue(TableService.objectWithMatchingIdInArrayIsEnabled(testColumns,'b'));
            }))
            it("should return undefined if the array has no element with that id",inject(function(TableService){
                assert.isUndefined(TableService.objectWithMatchingIdInArrayIsEnabled(testColumns,'c'))
            }));
        });
    })


});

describe('Table Service:', function () {

    beforeEach(module('ngApp.components', 'tables.services'));

    describe('Tables Service:', function () {
        describe('finding out if an element in an array is enabled',function(){
            describe('returning true or false when passed an array and an id',inject(function(TableService){
                it("should return true if the array has an object with a matching id and that object has a property enabled and that property is true",function(){
                    console.log("Running first test");
                    throw new Error();
                }))
                it("should return false if the array has an object with a matching ID and that object has no enabled property or it is false",function(){

                })
                it("should throw an error if the array has no element with that id",function(){

                })
            }));
        })

    });

});

describe('casinoService tests', function (){
  var casino;
  
  beforeEach( module('pokerCasino'));
  // excuted before each "it" is run.
  beforeEach(inject(function(_Casino_) {
      casino = _Casino__;
    })
  );
     
  // check to see if it has the expected function
  /*it('should have an exciteText function', function () { 
    expect(angular.isFunction(casino.getAllPlayers())).toBe(true);
  });*/
  
  // check to see if it does what it's supposed to do.
  /*it('should make text exciting', function (){
    var result = basicService.exciteText('bar');
    expect(result).toBe('bar!!!');
  });*/
});
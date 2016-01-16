describe('tableService tests', function (){
  var table;
  
  beforeEach( module('pokerCasino'));
  // excuted before each "it" is run.
  beforeEach(inject(function(_Table_) {
      table = _Table_;
    })
  );
     
  // check to see if it has the expected function
 it('poker hand combination tests', function () { 
    expect(angular.isFunction(table.deal)).toBe(true);
  });
  
  // check to see if it does what it's supposed to do.
  it('poker hand combination tests - nothing', function (){
    var result = table.handCombination(['AH','9D','3C','4S','5H']);
    expect(result).toBe(0);
  });

  it('poker hand combination tests - straight flush', function (){
    var result = table.handCombination(['3H','4H','5H','6H','7H']);
    expect(result).toBe(8);
  });

  it('poker hand combination tests - fullhouse', function (){
    var result = table.handCombination(['AS','AD','3H','3D','3C']);
    expect(result).toBe(6);
  });

  it('poker hand combination tests - royal flush', function (){
    var result = table.handCombination(['TC','JC','QC','KC','AC']);
    expect(result).toBe(9);
  });

  it('poker hand combination tests - 2 pairs', function (){
    var result = table.handCombination(['TC','TD','QC','QD','AC']);
    expect(result).toBe(2);
  });

  it('poker hand combination tests - threes', function (){
    var result = table.handCombination(['TC','TD','TH','KC','AC']);
    expect(result).toBe(3);
  });

  it('poker hand combination tests - flush', function (){
    var result = table.handCombination(['TC','6C','QC','KC','AC']);
    expect(result).toBe(5);
  });
});
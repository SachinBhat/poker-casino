'use strict';

describe('Controller: casinoController', function () {

  // load the controller's module
  beforeEach(module('pokerCasino'));

  var casinoController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    casinoController = $controller('casinoController', {
      $scope: scope
    });
  }));
/*
  it('populated tables',function(casinoController){
    window.alert("test started");
    scope.deal();
    expect(scope.players[0].id).toEqual(0);
  });
*/
  
});

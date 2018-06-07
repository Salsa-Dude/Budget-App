
// BUDGET CONTROLLER
var budgetController = (function() {

})();

// UI CONTROLLER
var UIController = (function() {

})();

// GlOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl) {

  var ctrlAddItem = function() {
    // Get the field input data
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(e) {
    if(e.keyCode === 13) {
      ctrlAddItem();
    }
  });

})(budgetController,UIController);
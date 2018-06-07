
// BUDGET CONTROLLER
var budgetController = (function() {

})();

// UI CONTROLLER
var UIController = (function() {
  
  const Domstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value'
  };
  
  return {
    getInput: function() {
      return {
        type: document.querySelector(Domstrings.inputType).value,
        description: document.querySelector(Domstrings.inputDescription).value,
        value: document.querySelector(Domstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return Domstrings;
    }
  }
})();

// GlOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl) {

  const DOM = UICtrl.getDOMstrings();

  var ctrlAddItem = function() {
    // Get the field input data
    var input = UICtrl.getInput();
    console.log(input);
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(e) {
    if(e.keyCode === 13) {
      ctrlAddItem();
    }
  });

})(budgetController,UIController);
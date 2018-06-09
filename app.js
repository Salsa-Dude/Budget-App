
// BUDGET CONTROLLER
var budgetController = (function() {
  
  const Expense = function(id,desc,value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  const Income = function(id,desc,value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  const data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    }
  };

  return {
    addItem: function(type,desc,value) {
      let ID,newItem;
      
    // Create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      

      if(type === 'expense') {
        newItem = new Expense(ID,desc,value);
      } else if(type === 'income') {
        newItem = new Income(ID,desc,value);
      }
      
      // Push newItem into our data structure
      data.allItems[type].push(newItem);

      return newItem;
    },
    testing: function() {
      console.log(data);
    }
  }

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

  const LoadEventListeners = function() {
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13) {
        ctrlAddItem();
      }
    });
  }

  var ctrlAddItem = function() {
    // Get the field input data
    const input = UICtrl.getInput();
    
    // Add item to budgetController data structure
    const newItem = budgetController.addItem(input.type, input.description, input.value);
  }
  
  return {
    init: function() {
      console.log('App Started..')
      LoadEventListeners();
    }
  }

})(budgetController,UIController);

controller.init();
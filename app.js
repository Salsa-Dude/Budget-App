
// BUDGET CONTROLLER
var budgetController = (function() {
  
  const Expense = function(id,desc,value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcuPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1
    }
  }

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    },
    budget: 0,
    percentage: -1
  };

  const calculateTotal = function(type) {
    let sum = 0;
    // Loop thru data 
    data.allItems[type].forEach(function(obj) {
      sum += obj.value;
    });
    
    // Add sum to data.totals
    data.totals[type] = sum;
  }

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
    deleteItem: function(type, id) {
      
      let ids = data.allItems[type].map(function(obj) {
        return obj.id;
      });

      console.log(id);

      const index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function() {
      
      // Calculate total income and expenses
      calculateTotal('expense');
      calculateTotal('income');

      // Calculate the budget: income - expense
      data.budget = data.totals.income - data.totals.expense;

      // Calculate the percentage of income that we spent
      if(data.totals.income > 0) {
        data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
      } else {
        data.percentage = -1;
      }
      
    },
    calculatePercentages: function() {
      data.allItems.expense.forEach(function(obj) {
        obj.calcuPercentage(data.totals.income);
      });
    },
    getPercentages: function() {
      const allPercentages = data.allItems.expense.map(function(obj) {
        return obj.getPercentage();
      });

      return allPercentages;
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentage
      }
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
    inputValue: '.add__value',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    expensePercentageLabel: '.item__percentage'
  };
  
  return {
    getInput: function() {
      return {
        type: document.querySelector(Domstrings.inputType).value,
        description: document.querySelector(Domstrings.inputDescription).value,
        value: parseFloat(document.querySelector(Domstrings.inputValue).value)
      };
    },
    addListItem: function(obj,type) {
      let html, element;

      if(type === 'income') {
        element = Domstrings.incomeContainer;
        html = `
          <div class="item clearfix" id="${type}-${obj.id}">
            <div class="item__description">${obj.desc}</div>
            <div class="right clearfix">
              <div class="item__value">${obj.value}</div>
              <div class="item__delete">
                 <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
          </div>
        `;
      } else if(type === 'expense') {
        element = Domstrings.expenseContainer;
        html = `
          <div class="item clearfix" id="${type}-${obj.id}">
            <div class="item__description">${obj.desc}</div>
            <div class="right clearfix">
              <div class="item__value">${obj.value}</div>
              <div class="item__percentage">21%</div>
                <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>
        `;
      }
      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);

    },
    deleteListItem: function(selectorID) {
      const element = document.getElementById(selectorID);
      element.parentElement.removeChild(element);
    },
    clearFields: function() {
      document.querySelector(Domstrings.inputDescription).value = '';
      document.querySelector(Domstrings.inputValue).value = '';
    },
    displayBudget: function(obj) {
      document.querySelector(Domstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(Domstrings.expenseLabel).textContent = obj.totalExpense;
      document.querySelector(Domstrings.incomeLabel).textContent = obj.totalIncome;
     
      if(obj.percentage > 0) {
        document.querySelector(Domstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(Domstrings.percentageLabel).textContent = '';
      }
    },
    displayPercentages: function(percentages) {
      const fields = document.querySelectorAll(Domstrings.expensePercentageLabel);
      const fieldsArray = Array.from(fields);

      // Loop thru array
      for(let i = 0; i < fieldsArray.length; i++) {
        if(percentages[i] > 0) {
          fieldsArray[i].textContent = percentages[i] + '%';
        } else {
          fieldsArray[i].textContent = '';
        }
      }


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
    
    document.querySelector('.container').addEventListener('click', ctrlDeleteItem);

  }

  const ctrlAddItem = function() {
    // Get the field input data
    const input = UICtrl.getInput();

    // Check input validation
    if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
       // Add item to budgetController data structure
      const newItem = budgetController.addItem(input.type, input.description, input.value);

      // Add item to UI
      UIController.addListItem(newItem, input.type);

      // Clear the fields
      UIController.clearFields();

      // Calculate and update budget
      updateBudget();

      // Calculate and update percentages
      updatePercentages();
    }
  }

  const ctrlDeleteItem = function(e) {
    let itemID, splitID,type,ID;
    
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    console.log(itemID);

    if(itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // Delete item from data structure
      budgetController.deleteItem(type,ID);

      // Delete item from UI
      UIController.deleteListItem(itemID);

      // Update and show the new budget
      updateBudget();

      // Calculate and update percentages
      updatePercentages();
    }
  }

  const updatePercentages = function() {
    // Calculate percentages
    budgetController.calculatePercentages();

    // Read percentages from budget controller
    const percentages = budgetController.getPercentages();

    // Update the UI with new percentages
    UIController.displayPercentages(percentages);
  };

  const updateBudget = function() {
    
    // Calculate budget
    budgetController.calculateBudget();
    // Return budget
    const budget = budgetController.getBudget();
    // display budget in UI
    UIController.displayBudget(budget);
  }
  
  return {
    init: function() {
      console.log('App Started..')
      LoadEventListeners();
    }
  }

})(budgetController,UIController);

controller.init();
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (User.current()) {
      const data = {
        mail: JSON.parse(User.current()).email,
        password: JSON.parse(User.current()).password
      }   
      
      const incomeSelect = document.getElementById('income-accounts-list');
      const expenseSelect = document.getElementById('expense-accounts-list');
      
      Account.list(data, (response) => {
        const options = [];
        
        response.data.forEach(account => {
          options.push(`<option value="${account.id}">${account.name}</option>`);
        })
        
        incomeSelect.innerHTML = options.join('');
        expenseSelect.innerHTML = options.join('');
        
      })
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {   
    if (data.name.trim()) {
      Transaction.create(data, (response) => {
        if (response.success) {
          App.getModal('newIncome').element.querySelector('form').reset();
          App.getModal('newExpense').element.querySelector('form').reset();
          App.getModal('newIncome').close();
          App.getModal('newExpense').close();
          App.update();
        } else {
          alert('Ошибка: ' + response.error);
        }
      });
    } else {
      alert('Введите название транзакции (пробелы не учитываются)');
    }
  }
}
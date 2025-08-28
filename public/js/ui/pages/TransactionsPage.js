/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element){
      throw new Error("Передан пустой элемент");
    } else {
      this.element = element;
    }
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelector('.remove-account').onclick = () => { this.removeAccount() }; //onclick для перезаписи слушателя событий

    document.querySelectorAll('.transaction__remove').forEach(btn => {

      if (btn) {
        btn.addEventListener('click', () => {
          const idTransaction = btn.getAttribute('data-id');
          this.removeTransaction(idTransaction);
        })
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {

    if (this.lastOptions) {
      let positiveAnswer = confirm('Вы действительно хотите удалить счёт?')
      if (positiveAnswer) {

        const data = {
          id: this.lastOptions.account_id,
        };

        Account.remove(data, (response) => {
          if (response.success) {
            App.updateWidgets();
            App.updateForms()
          }
        })

        this.clear();

      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let positiveAnswer = confirm('Вы действительно хотите удалить эту транзакцию?')
    if (positiveAnswer) {

      const data = {
        id: id
      };

      Transaction.remove(data, (response) => {
        if (response.success) {
          App.update();
        } else {
          alert('Ошибка: ' + response.error)
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;

      Account.get(options.account_id, (response) => {
        if (response.success) {
          this.renderTitle(response.data.name);

          if (User.current()) {
            const data = {
              account_id: options.account_id
            }

            Transaction.list(data, (response) => {
              this.renderTransactions(response.data);
              this.registerEvents();
            })
          }
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    
    const day = date.slice(8,10).replace(/^0+/, "");
    const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][date.slice(5,7) - 1];
    const year = date.slice(0,4);
    const hour = date.slice(11,13).replace(/^0+/, "");
    const minute = date.slice(14,16).replace(/^0+/, "");
    
    return `${day} ${month} ${year} г. в ${hour}:${minute}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type} row">
                <div class="col-md-7 transaction__details">
                  <div class="transaction__icon">
                      <span class="fa fa-money fa-2x"></span>
                  </div>
                  <div class="transaction__info">
                      <h4 class="transaction__title">${item.name}</h4>
                      <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="transaction__summ">
                      ${item.sum} <span class="currency">₽</span>
                  </div>
                </div>
                <div class="col-md-2 transaction__controls">
                    <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                        <i class="fa fa-trash"></i>  
                    </button>
                </div>
            </div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content');
    content.innerHTML = '';
    
    data.forEach(item => {
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    })
  }
}
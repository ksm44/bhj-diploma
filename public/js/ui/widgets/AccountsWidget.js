/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!element){
      throw new Error("Передан пустой элемент");
    } else {
      this.element = element;
    }
    
    this.activeAccountId = '';
    
    this.update(); //registerEvents() внутри update
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    document.querySelector('.create-account').addEventListener('click', () => {
      App.getModal('createAccount').open();
    });
    
    this.element.querySelectorAll('.account').forEach(account => {
      account.addEventListener('click', (e) => {
        this.onSelectAccount(account);
      });
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    
    
    if (User.current()) {
      const data = {
        mail: JSON.parse(User.current()).email,
        password: JSON.parse(User.current()).password
      }   
      
      Account.list(data, (response) => {
        if (response.success){
          this.clear();
          this.renderItem(response.data);
          this.registerEvents();
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    document.querySelectorAll('.account').forEach(account => {
      account.remove();
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    this.activeAccountId = element.getAttribute('data-id'); //id активного счета, чтобы оставлять его активным при добавлении/удалении транзакции
    
    document.querySelectorAll('.account').forEach( account => {
      account.classList.remove('active');
    });
    
    element.classList.add('active');
    App.clear();  
    App.showPage( 'transactions', { account_id: element.getAttribute('data-id') });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let active = ''; //проверяем был ли активным счёт до этого, чтобы оставить его также активным
    if(item.id == this.activeAccountId) {
        active = 'active';
    }
    
    //украшаем сумму в счёте
    let [rubles, kopecks] = item.sum.toString().split('.');
    rubles = rubles.replace(/\B(?=(\d{3})+(?!\d))/g, ','); //разбиваем запятыми через 3 цифры
    kopecks ? kopecks : kopecks = '00'; // всегда добавляем копейки
    
    return `
      <li class="account ${active}" data-id="${item.id}">
        <a href="#">
          <span>${item.name}</span> /
          <span>${rubles}.${kopecks} ₽</span>
        </a>
      </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){    
    data.forEach(item => {       
      this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
    })
  }
}
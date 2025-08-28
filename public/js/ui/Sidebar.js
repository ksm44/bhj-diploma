/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const menuBtn = document.querySelector('.sidebar-toggle');
    menuBtn.addEventListener('click', () => {
      const body = document.querySelector('body');
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const links = document.querySelectorAll('.menu-item');
    links.forEach(item => {
      if( item.classList.contains('menu-item_register')) {
        item.querySelector('a').addEventListener('click', (e) => {
          e.preventDefault();
          App.getModal('register').open();
        });
      }
      
      if( item.classList.contains('menu-item_login')) {
        item.querySelector('a').addEventListener('click', (e) => {
          e.preventDefault();       
          App.getModal('login').open();
        })
      }
      
			if (item.classList.contains('menu-item_logout')) {
				item.querySelector('a').addEventListener('click', (e) => {
					e.preventDefault();
					User.logout((response) => {
						if (response.success) {
							App.setState('init');
						} else {
							console.log('Ошибка: ' + response.error);
						}
					})
				})
			}
    })
  }
}
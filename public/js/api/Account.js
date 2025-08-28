/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  
  constructor() {
    super();
  }
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback){
    createRequest({
      url: this.URL + `/${id}`,
      method: 'GET',
      responseType: 'json',
      callback: (response) => {
        const result = JSON.parse(response);
        callback(result);
      }
    });
  }
}
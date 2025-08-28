/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return localStorage.getItem('user');
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      url: User.URL + '/current',
      method: 'GET',
      responseType: 'json',
      data: null,
      callback: (response) => {
        const result = JSON.parse(response);
        if (result && result.success) {
          this.setCurrent(result.user);
        } else {
          this.unsetCurrent();
        }
        callback(result);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: User.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (response) => {
        const result = JSON.parse(response);
        if (result && result.user) {
          this.setCurrent(result.user);
        }
        callback(result);
      }
    }); 
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {  
    createRequest({
      url: User.URL + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (response) => {
        const result = JSON.parse(response);
        if (result && result.success) {
          this.setCurrent(result.user);
        }
        callback(result);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: User.URL + '/logout',
      method: 'POST',
      responseType: 'json',
      callback: (response) => {
        const result = JSON.parse(response);
        if (result) {
          this.unsetCurrent();
        }
        callback(result);
      }
    });
  }
}

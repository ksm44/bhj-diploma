/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    
    try { 
        if ( options.method == 'GET') {                  
            let requestUrl = '';
            
            if( options.data ) {
                const queryString = Object.keys(options.data)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options.data[key])}`)
                .join('&');
                
                requestUrl = `${options.url}?${queryString}`;
            } else { // если нет data
                requestUrl = options.url;
            }
            
            xhr.open(options.method, requestUrl)
            xhr.send();
            
        } else { // если метод не GET
            xhr.open(options.method, options.url);
            if( options.data ) {
                const formData = new FormData();
                
                if (options.method == 'POST') {
                    formData.append( 'name', options.data.name );
                    formData.append( 'email', options.data.email );
                    formData.append( 'password', options.data.password );  
                }
                
                if (options.method == 'PUT') {
                    formData.append( 'name', options.data.name );
                    formData.append( 'sum', options.data.sum ); 
                    formData.append( 'type', options.data.type );
                    formData.append( 'account_id', options.data.account_id );     
                }
                
                if (options.method == 'DELETE') {
                    formData.append( 'id', options.data.id );
                }
                
                xhr.send(formData);
                
            } else { // если нет data
               xhr.send(); 
            }
        }
        
        xhr.onload = function() {         
            if (xhr.status === 200) {
                options.callback((null, xhr.response));
            } else {
                options.callback((xhr.statusText, null));
            }
        }
    } catch (e) {
        options.callback( e );
    }
};
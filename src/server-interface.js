function defaultRequest(type, request, sending, callback) {
  const xhr = new window.XMLHttpRequest();
  xhr.open(type, request);
  if (type=='POST') {
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(sending));
  } else {
    xhr.send();
  }
  xhr.onload = (event) => {
    switch (event.target.status) {
      case 200:
        callback(event.target.responseText);
        break;
      default:
        window.alert('Ошибка ' + event.target.responseText);
    }
  };
}

const server = {
  getJSON: (callback) => {
    defaultRequest('GET', '/json', null, callback);
  },
};

export default server;

import React, { Component } from 'react';
import server from './server-interface.js';
import './App.less';
import Autocomplite from './Autocomplite.js';

const falseValue = {
  Id: false,
  City: false,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: falseValue,
      DB: [],
    };
    this.onChange=this.onChange.bind(this);
    this.getJSONServer();
  }

  onChange(value) {
    this.setState({ choice: value || falseValue });
  }

  getJSONServer() {
    server.getJSON((resp) => {
      this.setState({ DB: JSON.parse(resp) });
    });
  }

  render() {
    return(
      <div align="center">
        <div className="container">
          <Autocomplite DB={this.state.DB} value={this.state.choice} onChange={this.onChange} size="8" />
          <div className="otherText" align="left">
            <p>В списке городов имеются неуникальные названия, например: "Первомайское". </p>
            <p>Пользователь не сможет однозначно идентифицировать название своего населенного пункта.</p>
            <p>Названий "Первомайское" больше 5 и они все не влазят в лайтбокс. Поэтому некоторые из них выбрать невозможно.</p>
            <div align="center">
              <p className="finish">{'Зафиксирован выбор: '+JSON.stringify(this.state.choice)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
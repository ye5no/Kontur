import React, { Component } from 'react';
import json from './kladr.json';
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
    };
    this.onChange=this.onChange.bind(this);
  }
  
  onChange(value) {
    this.setState({ choice: value || falseValue });
  }

  render() {
    return(
      <div align="center">
        <div className="container">
          <Autocomplite DB={json} value={this.state.choice} onChange={this.onChange} size="8" />
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
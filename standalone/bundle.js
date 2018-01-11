const resultHints = [
  'Введите город',
  'Город выбран',
  'Выберите город из списка',
  'В списке нет такого города',
  'Продолжайте вводить для формирования списка',
];

class App extends window.React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 0,
      className: 'default',
      matchesForRender: json.slice(0, 5),
      matchesAll: json.length,
      boxing: false,
      value: '',
      currentOnBox: 0,
      maxBoxSize: 5,
      choice: {
        Id: false,
        City: false,
      },
    };
    this.bluring = this.bluring.bind(this);
    this.focusing = this.focusing.bind(this);
    this.search = this.search.bind(this);
    this.choiceByKeyboard = this.choiceByKeyboard.bind(this);
    this.mouseMovement = this.mouseMovement.bind(this);
    this.choiceByMouse = this.choiceByMouse.bind(this);
  }

  focusing() {
    this.setState({
      className: 'default',
      boxing: true,
    });
  }

  bluring() {
    function blurTimer() {
      let choice=false;
      for (let i = 0, len = json.length; i < len; i++) {
        if (json[i].City.toLowerCase() == this.state.value.toLowerCase()) {
          choice = json[i];
          break;
        }
      }

      if (choice!==false) {
        this.setState({
          result: 1,
          className: 'success',
          matchesForRender: [choice],
          matchesAll: 1,
          boxing: false,
          value: choice.City,
          currentOnBox: 0,
          choice: choice,
        });
      } else {
        const result = (this.state.value=='') ? 0 : (this.state.matchesForRender.length==0) ? 3 : (this.state.matchesForRender.length>=25) ? 4 : 2;
        this.setState({
          result: result,
          className: (result==2) ? 'warning' : 'danger',
          boxing: false,
          currentOnBox: 0,
          choice: { Id: false, City: false },
        });
      }
    }

    setTimeout(blurTimer.bind(this), 200);
  }

  choiceByKeyboard(event) {
    switch (event.key) {
      case 'Enter':
        const choice = this.state.matchesForRender[Math.max(this.state.currentOnBox, 0)];
        this.setState({
          result: 1,
          className: 'success',
          matchesForRender: [choice],
          matchesAll: 1,
          boxing: false,
          value: choice.City,
          currentOnBox: 0,
          choice: choice,
        });
        break;
      case 'ArrowDown':
        this.setState({
          currentOnBox: Math.min(this.state.currentOnBox+1, this.state.maxBoxSize-1, this.state.matchesForRender.length-1),
        });
        break;
      case 'ArrowUp':
        this.setState({
          currentOnBox: Math.max(this.state.currentOnBox-1, 0),
        });
        break;
      default:
        this.setState({
          currentOnBox: 0,
        });
    }
  }

  choiceByMouse(event) {
    this.setState({
      value: event.target.id,
    });
  }

  mouseMovement() {
    this.setState({
      currentOnBox: -1,
    });
  }

  search(event) {
    const value = event.target.value.toLowerCase();
    const firstCharCities = [];
    const otherCities = [];
    let matchesFirst=0, matchesOther=0;
    for (let i=0, len=json.length; i<len; i++) {
      if (json[i].City.toLowerCase().indexOf(value)==0) {
        if (matchesFirst<this.state.maxBoxSize) firstCharCities.push(json[i]);
        matchesFirst++;
      }
      if (json[i].City.toLowerCase().indexOf(value)!=0 && json[i].City.toLowerCase().indexOf(value)!=-1) {
        if (matchesOther<this.state.maxBoxSize) otherCities.push(json[i]);
        matchesOther++;
      }
    }
    this.setState({
      matchesForRender: firstCharCities.concat(otherCities).slice(0, this.state.maxBoxSize),
      matchesAll: matchesFirst+matchesOther,
      boxing: true,
      value: value,
    });
  }

  render() {
    const showBox = { display: (this.state.boxing) ? 'block' : 'none' };
    const showBoxHint = { display: (this.state.matchesAll>this.state.maxBoxSize || this.state.matchesAll==0) ? 'block' : 'none' };
    const boxHint = (this.state.matchesAll==0)
      ? 'Совпадений не найдено'
      :'Показано '+this.state.maxBoxSize+' совпадений из '+this.state.matchesAll;

    let strings = '';
    if (this.state.boxing) {
      const currentOnBox = this.state.currentOnBox;
      const value = this.state.value;
      strings = this.state.matchesForRender.map((field, index) => {
        const first = field.City.toLowerCase().indexOf(value.toLocaleLowerCase());
        const len = value.length;
        const part1 = field.City.slice(0, first);
        const part2 = field.City.slice(first, first + len);
        const part3 = field.City.slice(first + len);
        return(
          <div
            className={(index==currentOnBox) ? 'boxStrings boxStrings-hovered' : 'boxStrings'}
            key={field.Id}
            id={field.City}
            onClick={this.choiceByMouse}
          >
            {part1}<strong>{part2}</strong>{part3}
          </div>
        );},
      );
    }

    return(
      <div align="center">
        <div className="container">
          <input
            type="text"
            placeholder="Начните вводить название города"
            className={this.state.className}
            onFocus={this.focusing}
            onBlur={this.bluring}
            onChange={this.search}
            onKeyUp={this.choiceByKeyboard}
            onMouseMove={this.mouseMovement}
            value={this.state.value}
          />
          <div align="left" className="box" style={showBox}>
            {strings}
            <div className="boxHint" style={showBoxHint}>{boxHint}</div>
          </div>
          <div className={'statusString-'+this.state.className} align="left">{resultHints[this.state.result]}</div>
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

window.ReactDOM.render(<App />, document.getElementById('content'));
import React, { Component } from 'react';
import Lightbox from './AC-Components/Lightbox.js';
import Inputbox from './AC-Components/Inputbox.js';
import StatusString from './AC-Components/StatusString.js';

const autocompiteStatus = {
  0: {
    className: 'default',
    hint: 'Введите город',
  },
  1: {
    className: 'success',
    hint: 'Город выбран',
  },
  2: {
    className: 'warning',
    hint: 'Выберите город из списка',
  },
  3: {
    className: 'danger',
    hint: 'В списке нет такого города',
  },
};

class Autocomplite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: this.props.size || 5,
      status: 0,
      focus: false,
      inputValue: this.props.value.City || '',
      currentOnBox: 0,
      matchesForRender: this.props.DB.slice(0, this.props.size) || [],
      matchesTotal: this.props.DB.length || 0,
      handleChoice: false,
    };
    this.search = this.search.bind(this);
    this.inputboxChange = this.inputboxChange.bind(this);
    this.inputboxFocus = this.inputboxFocus.bind(this);
    this.inputboxBlur = this.inputboxBlur.bind(this);
    this.inputboxKeyUp = this.inputboxKeyUp.bind(this);
    this.lightboxMouseMovement = this.lightboxMouseMovement.bind(this);
    this.lightboxMouseClick = this.lightboxMouseClick.bind(this);
  }

  search(val) {
    const value = val.toLowerCase();
    const list = this.props.DB;
    const len = list.length;
    const firstCharCities = [];
    const otherCities = [];
    let matchesFirst = 0, matchesOther = 0;
    for (let i = 0; i < len; i++) {
      const city = list[i].City.toLowerCase();
      if (city.indexOf(value) == 0) {
        if (matchesFirst < this.props.size) firstCharCities.push(list[i]);
        matchesFirst++;
      }
      if (city.indexOf(value) != 0 && city.indexOf(value) != -1) {
        if (matchesOther < this.props.size) otherCities.push(list[i]);
        matchesOther++;
      }
    }
    this.setState({
      matchesForRender: firstCharCities.concat(otherCities).slice(0, this.props.size),
      matchesTotal: matchesFirst + matchesOther,
    });
  }

  inputboxChange(event) {
    const value = event.target.value.toLowerCase();
    this.search(value);
    this.setState({
      inputValue: value,
      focus: true,
      currentOnBox: 0,
      handleChoice: false,
    });
  }

  inputboxFocus() {
    this.setState({
      status: 0,
      focus: true,
      currentOnBox: 0,
    });
  }

  inputboxBlur() {
    function blurTimer() {
      if (!this.state.handleChoice) {
        let choice = false;
        for (let i = 0, len = this.props.DB.length; i < len; i++) {
          if (this.props.DB[i].City.toLowerCase() == this.state.inputValue.toLowerCase()) {
            choice = this.props.DB[i];
            break;
          }
        }

        if (choice !== false) {
          this.setState({
            status: 1,
            focus: false,
            inputValue: choice.City,
          });
        } else {
          const status = (this.state.inputValue == '') ? 0 : (this.state.matchesForRender.length == 0) ? 3 : 2;
          this.setState({
            status: status,
            focus: false,
          });
        }
        this.props.onChange(choice);
      } else {
        this.setState({
          handleChoice: false,
        });
      }
    }

    setTimeout(blurTimer.bind(this), 200);
  }

  inputboxKeyUp(event) {
    switch (event.key) {
      case 'Enter':
        this.lightboxMouseClick();
        break;
      case 'ArrowDown':
        this.setState({
          currentOnBox: Math.min(this.state.currentOnBox+1, this.state.size-1, this.state.matchesForRender.length-1),
          focus: true,
        });
        break;
      case 'ArrowUp':
        this.setState({
          currentOnBox: Math.max(this.state.currentOnBox-1, 0),
        });
        break;
      default:
    }
  }

  lightboxMouseMovement(event){
    const index = event.target.getAttribute('data-indexonbox') || event.target.parentElement.getAttribute('data-indexonbox');
    this.setState({
      currentOnBox: index,
    });
  }

  lightboxMouseClick() {
    if (this.state.matchesForRender.length>0) {
      const choice = this.state.matchesForRender[this.state.currentOnBox];
      this.setState({
        status: 1,
        focus: false,
        inputValue: choice.City,
        currentOnBox: 0,
        handleChoice: true,
      });
      this.props.onChange(choice);
      this.search(choice.City);
    }
  }

  render() {
    return(
      <div>
        <Inputbox 
          status={autocompiteStatus[this.state.status]}
          value={this.state.inputValue}
          onChange={this.inputboxChange}
          onFocus={this.inputboxFocus}
          onBlur={this.inputboxBlur}
          onKeyUp={this.inputboxKeyUp}
        />
        <Lightbox
          size={this.state.size}
          focus={this.state.focus}
          total={this.state.matchesTotal}
          inputValue={this.state.inputValue}
          list={this.state.matchesForRender}
          currentOnBox={this.state.currentOnBox}
          
          onMouseOver={this.lightboxMouseMovement}
          onClick={this.lightboxMouseClick}
        />
        <StatusString
          status={autocompiteStatus[this.state.status]}
        />
      </div>
    );
  }
}

export default Autocomplite;
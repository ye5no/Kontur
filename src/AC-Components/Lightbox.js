import React from 'react';
import './Lightbox.less';

const Element = (props) => (
  <div
    className={props.className}
    data-indexonbox={props.index}
    onClick={props.onClick}
    onMouseOver={props.onMouseOver}
  >
    {props.parts[0]}<strong>{props.parts[1]}</strong>{props.parts[2]}
  </div>
);

const List = (props) => (
  props.list.map((field, index) => {
      const first = field.City.toLowerCase().indexOf(props.inputValue.toLocaleLowerCase());
      const len = props.inputValue.length;
      const parts = [
        field.City.slice(0, first),
        field.City.slice(first, first + len),
        field.City.slice(first + len),
      ];
      return(
        <Element
          key={field.Id}
          className={(index==props.currentOnBox) ? 'lightBoxElem lightBoxElem-hovered' : 'lightBoxElem'}
          name={field.City}
          id={field.Id}
          index={index}
          parts={parts}
          onClick={props.onClick}
          onMouseOver={props.onMouseOver}
        />
      );
  })
);


export default (props) => {
  const showBox = { display: (props.focus) ? 'block' : 'none' };
  const showBoxHint = { display: (props.total>props.size || props.total==0) ? 'block' : 'none' };
  const boxHint = (props.total==0)
    ? 'Совпадений не найдено'
    : 'Показано '+props.size+' совпадений из '+props.total;
  return(
    <div align="left" className="lightBox" style={showBox}>
      <List
        inputValue={props.inputValue}
        list={props.list}
        currentOnBox={props.currentOnBox}
        onClick={props.onClick}
        onMouseOver={props.onMouseOver}
      />
      <div className="boxHint" style={showBoxHint}>{boxHint}</div>
    </div>
  );
};
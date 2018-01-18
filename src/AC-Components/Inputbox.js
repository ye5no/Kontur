import React from 'react';
import './Inputbox.less';

export default (props) => (
  <input
    type="text"
    placeholder="Начните вводить название города"
    className={props.status.className}
    value={props.value}
    onChange={props.onChange}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    onKeyUp={props.onKeyUp}
  />
);
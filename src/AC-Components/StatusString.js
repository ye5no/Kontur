import React from 'react';
import './StatusString.less';

export default (props) => (
  <div className={'statusString-'+props.status.className} align="left">{props.status.hint}</div>
);

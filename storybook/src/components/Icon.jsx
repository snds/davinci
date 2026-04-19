import React from 'react';

export const ICON_CODEPOINTS = {
  home: '\ue88a',
  search: '\ue8b6',
  group: '\uf233',
  groups: '\uf233',
  work: '\ue8f9',
  chat_bubble: '\ue0ca',
  notifications: '\ue7f4',
  person: '\ue7fd',
  settings: '\ue8b8',
  bookmark: '\ue866',
  favorite: '\ue87d',
  event: '\ue878',
  newspaper: '\ueb81',
  history: '\ue889',
  info: '\ue88e',
  add: '\ue145',
  edit: '\ue3c9',
  link: '\ue157',
  delete: '\ue872',
  more_horiz: '\ue5d3',
  more_vert: '\ue5d4',
  public: '\ue80b',
  thumb_up: '\ue8dc',
  repeat: '\ue040',
  send: '\ue163',
  mail: '\ue0be',
  image: '\ue3f4',
  play_circle: '\ue1c4',
  article: '\uef42',
  location_on: '\ue0c8',
  arrow_forward: '\ue5c8',
  dark_mode: '\ue51c',
  light_mode: '\ue518',
  close: '\ue5cd',
  check: '\ue5ca',
  visibility: '\ue8f4',
  lock: '\ue897',
};

function Icon({ name, filled, style, className = '' }) {
  return (
    <span
      className={`material-symbols-rounded ${filled ? 'filled' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default Icon;

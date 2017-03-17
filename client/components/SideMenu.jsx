import React from 'react';

const SideMenu = () => (
  <aside className="menu">
    <p className="menu-label">
      General
    </p>
    <ul className="menu-list">
      <li><a href="/">Attack</a></li>
    </ul>
    <p className="menu-label">
      Results
    </p>
    <ul className="menu-list">
      <li><a>00000.bin</a></li>
      <li><a>11111.bin</a></li>
      <li><a>22222.bin</a></li>
    </ul>
  </aside>
);

export default SideMenu;

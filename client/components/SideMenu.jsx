import React from 'react';

const SideMenu = ({ resultFiles }) => (
  <section className="section">
    <aside className="menu">
      <p className="menu-label">
        General
      </p>
      <ul className="menu-list">
        <li>
          <a href="/">Attack</a>
        </li>
      </ul>
      <p className="menu-label">
        Results
      </p>
      <ul className="menu-list">
        {resultFiles.map(file => (
          <li key={file}>
            <a href={`/results/${file}`}>{file}</a>
          </li>
        ))}
      </ul>
    </aside>
  </section>
);

SideMenu.propTypes = {
  resultFiles: React.PropTypes.object.isRequired,
};

export default SideMenu;

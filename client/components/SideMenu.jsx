import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu = ({ resultFiles }) => (
  <section className="section">
    <aside className="menu">
      <p className="menu-label">
        General
      </p>
      <ul className="menu-list">
        <li>
          <Link to="/">Attack</Link>
        </li>
      </ul>
      <p className="menu-label">
        Results
      </p>
      <ul className="menu-list">
        {resultFiles.map(file => (
          <li key={file}>
            <Link to={`/results/${file}`}>{file}</Link>
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

import React from 'react';
import { Link } from 'react-router-dom';

const isCurrentAttack = () => location.pathname === '/';
const isCurrentResult = filename => location.pathname === `/results/${filename}`;

const SideMenu = ({ resultFiles }) => (
  <section className="section">
    <aside className="menu">
      <p className="menu-label">
        General
      </p>
      <ul className="menu-list">
        <li>
          <Link
            to="/"
            className={isCurrentAttack() ? 'is-active' : null}
          >
            Attack
          </Link>
        </li>
      </ul>
      <p className="menu-label">
        Results
      </p>
      <ul className="menu-list">
        {resultFiles.map(file => (
          <li key={file}>
            <Link
              to={`/results/${file}`}
              className={isCurrentResult(file) ? 'is-active' : null}
            >
              {file}
            </Link>
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

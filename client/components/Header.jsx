import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <header>
    <nav className="nav has-shadow">
      <div className="container">
        <div className="nav-left">
          <Link className="nav-item" to="/">Trunks</Link>
        </div>

        <div className="nav-right nav-menu">
          <a className="nav-item" href="https://github.com/tsenart/vegeta" target="_blank" rel="noopener noreferrer">
            Vegeta
          </a>
          <a className="nav-item" href="https://github.com/jgthms/bulma" target="_blank" rel="noopener noreferrer">
            Bulma
          </a>
          <a className="nav-item" href="https://github.com/umatoma/trunks" target="_blank" rel="noopener noreferrer">
            <span className="icon">
              <i className="fa fa-github" />
            </span>
          </a>
        </div>
      </div>
    </nav>
  </header>
);

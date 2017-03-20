import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isHamburgerActive, onToggleHamburger }) => (
  <header>
    <nav className="nav has-shadow">
      <div className="container">
        <div className="nav-left">
          <Link className="nav-item" to="/">Trunks</Link>
        </div>
        <span // eslint-disable-line
          className={isHamburgerActive ? 'nav-toggle is-active' : 'nav-toggle'}
          onClick={onToggleHamburger}
        >
          <span />
          <span />
          <span />
        </span>
        <div className={isHamburgerActive ? 'nav-right nav-menu is-active' : 'nav-right nav-menu'}>
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

Header.propTypes = {
  isHamburgerActive: React.PropTypes.bool.isRequired,
  onToggleHamburger: React.PropTypes.func.isRequired,
};

export default Header;

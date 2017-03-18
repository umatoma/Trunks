import React from 'react';
import { NavLink } from 'react-router-dom';

class SideMenu extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.resultFiles !== this.props.resultFiles) {
      return true;
    }
    if (nextProps.location !== this.props.location) {
      return true;
    }
    return false;
  }

  isCurrentAttack() {
    return this.props.location.pathname === '/';
  }

  isCurrentResult(filename) {
    return this.props.location.pathname === `/results/${filename}`;
  }

  render() {
    const { resultFiles } = this.props;
    return (
      <section className="section">
        <aside className="menu">
          <p className="menu-label">
            General
          </p>
          <ul className="menu-list">
            <li>
              <NavLink
                to="/"
                className={this.isCurrentAttack() ? 'is-active' : null}
              >
                Attack
              </NavLink>
            </li>
          </ul>
          <p className="menu-label">
            Results
          </p>
          <ul className="menu-list">
            {resultFiles.map(file => (
              <li key={file}>
                <NavLink
                  to={`/results/${file}`}
                  className={this.isCurrentResult(file) ? 'is-active' : null}
                >
                  {file}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    );
  }
}

SideMenu.propTypes = {
  resultFiles: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
};

export default SideMenu;

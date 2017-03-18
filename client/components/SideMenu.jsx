import React from 'react';
import { Link } from 'react-router-dom';

class SideMenu extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.resultFiles !== this.props.resultFiles) {
      return true;
    }
    if (nextProps.path !== this.props.path) {
      return true;
    }
    return false;
  }

  isCurrentAttack() {
    return this.props.path === '/';
  }

  isCurrentResult(filename) {
    return this.props.path === `/results/${filename}`;
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
              <Link
                to="/"
                className={this.isCurrentAttack() ? 'is-active' : null}
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
                  className={this.isCurrentResult(file) ? 'is-active' : null}
                >
                  {file}
                </Link>
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
  path: React.PropTypes.string.isRequired,
};

export default SideMenu;

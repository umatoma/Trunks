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

  render() {
    const { resultFiles } = this.props;
    return (
      <aside className="menu is-hidden-mobile">
        <p className="menu-label">
          General
        </p>
        <ul className="menu-list">
          <li>
            <NavLink exact to="/" activeClassName="is-active">
              <span className="icon is-small">
                <i className="fa fa-bolt" />
              </span>
              <span>Attack</span>
            </NavLink>
          </li>
        </ul>
        <p className="menu-label">
          Results
        </p>
        <ul className="menu-list">
          {resultFiles.map(file => (
            <li key={file}>
              <NavLink exact to={`/results/${file}`} activeClassName="is-active">
                <span className="icon is-small">
                  <i className="fa fa-file" />
                </span>
                <span>{file}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}

SideMenu.propTypes = {
  resultFiles: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
};

export default SideMenu;

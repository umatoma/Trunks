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
    if (nextProps.isModalActive !== this.props.isModalActive) {
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

  isResultPath() {
    return this.props.location.pathname.startsWith('/results/');
  }

  handleClickModalResultLink(filename) {
    this.props.onToggleModal();
    this.props.history.push(`/results/${filename}`);
  }

  render() {
    const { resultFiles, isModalActive, onToggleModal } = this.props;
    return (
      <div>
        <aside className="tk-side-menu menu is-hidden-mobile">
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
        <div className="tabs is-fullwidth is-hidden-tablet">
          <ul>
            <li className={this.isCurrentAttack() ? 'is-active' : null}>
              <NavLink to="/">
                <span className="icon is-small">
                  <i className="fa fa-bolt" />
                </span>
                <span>Attack</span>
              </NavLink>
            </li>
            <li className={this.isResultPath() ? 'is-active' : null}>
              <a onClick={onToggleModal}>
                <span className="icon is-small">
                  <i className="fa fa-file" />
                </span>
                <span>Results</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={isModalActive ? 'modal is-active' : 'modal'}>
          <div className="modal-background" />
          <div className="modal-content">
            <div className="card">
              <div className="card-header">
                <p className="card-header-title">Results</p>
              </div>
              <div className="card-content">
                <div className="content">
                  {isModalActive ? resultFiles.map(file => (
                    <p key={file}>
                      <a onClick={() => this.handleClickModalResultLink(file)}>
                        <span className="icon is-small">
                          <i className="fa fa-file" />
                        </span>&nbsp;
                        <span>{file}</span>
                      </a>
                    </p>
                  )) : null}
                </div>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onToggleModal} />
        </div>
      </div>
    );
  }
}

SideMenu.propTypes = {
  resultFiles: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  isModalActive: React.PropTypes.bool.isRequired,
  onToggleModal: React.PropTypes.func.isRequired,
};

export default SideMenu;

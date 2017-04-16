import React from 'react';
import { NavLink } from 'react-router-dom';

class SideMenuForMobile extends React.Component {
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
              {isModalActive ? resultFiles.map(file => (
                <a
                  key={file}
                  className="tk-card-item"
                  onClick={() => this.handleClickModalResultLink(file)}
                >
                  <span className="icon is-small">
                    <i className="fa fa-file" />
                  </span>&nbsp;
                  <span>{file}</span>
                </a>
              )) : null}
            </div>
          </div>
          <button className="modal-close" onClick={onToggleModal} />
        </div>
      </div>
    );
  }
}

SideMenuForMobile.propTypes = {
  resultFiles: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  isModalActive: React.PropTypes.bool.isRequired,
  onToggleModal: React.PropTypes.func.isRequired,
};

export default SideMenuForMobile;

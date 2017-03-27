import React from 'react';

const NOTIFY_TIMEOUT = 3000;

const style = i => ({
  float: 'right',
  position: 'fixed',
  top: 24 + (72 * i),
  right: 16,
  zIndex: 99999,
});

const className = (type) => {
  if (type) {
    return `notification is-${type}`;
  }
  return 'notification is-info';
};

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.dismissTimeout = setTimeout(() => {
      this.props.onDissmiss(this.props.notification);
    }, NOTIFY_TIMEOUT);
  }

  componentWillUnmount() {
    clearTimeout(this.dismissTimeout);
  }

  render() {
    const { index, notification, onDissmiss } = this.props;
    return (
      <div style={style(index)} className={className(notification.type)}>
        <button className="delete" onClick={() => onDissmiss(notification)} />
        {notification.message}
      </div>
    );
  }
}

Notification.propTypes = {
  index: React.PropTypes.number.isRequired,
  notification: React.PropTypes.object.isRequired,
  onDissmiss: React.PropTypes.func.isRequired,
};

export default Notification;

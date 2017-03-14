import React from 'react';

const style = idx => ({
  float: 'right',
  position: 'fixed',
  top: 16 + (64 * idx),
  right: 16,
  zIndex: 99999,
});

const className = (notify) => {
  if (notify.type) {
    return `notification is-${notify.type}`;
  }
  return 'notification is-primary';
};

const Notifications = ({ notifications, onClose }) => (
  <div>
    {notifications.map((n, i) => (
      <div key={n.key} style={style(i)} className={className(n)}>
        <button className="delete" onClick={() => { onClose(n.key); }} />
        {n.message}
      </div>
    ))}
  </div>
);

Notifications.propTypes = {
  notifications: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onClose: React.PropTypes.func.isRequired,
};

export default Notifications;

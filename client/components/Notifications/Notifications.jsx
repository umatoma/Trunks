import React from 'react';
import Notification from './Notification';

const Notifications = ({ notifications, onDissmiss }) => (
  <div>
    {notifications.map((n, i) => (
      <Notification
        key={n.key}
        index={i}
        notification={n}
        onDissmiss={onDissmiss}
      />
    ))}
  </div>
);

Notifications.propTypes = {
  notifications: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onDissmiss: React.PropTypes.func.isRequired,
};

export default Notifications;

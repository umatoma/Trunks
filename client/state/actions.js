export function addNotify(getState, { message, type = 'info' }) {
  const { notifications } = getState();
  return {
    notifications: notifications.add({ key: Date.now(), message, type }),
  };
}

export function removeNotify(getState, notification) {
  const { notifications } = getState();
  return {
    notifications: notifications.delete(notification),
  };
}

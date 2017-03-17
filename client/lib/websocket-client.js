class WebSocketClient {
  constructor(url) {
    // create websocket connection
    const conn = new WebSocket(url);
    conn.onclose = () => {
      console.log('close websocket connection'); // eslint-disable-line
      if (typeof this.handleClose === 'function') {
        this.handleClose();
      }
    };
    conn.onmessage = (evt) => {
      const { event, data } = JSON.parse(evt.data);
      switch (event) {
        case 'attackStart':
          if (typeof this.handleAttackStart === 'function') {
            this.handleAttackStart(data);
          }
          break;
        case 'attackFinish':
          if (typeof this.handleAttackFinish === 'function') {
            this.handleAttackFinish(data);
          }
          break;
        case 'attackMetrics':
          if (typeof this.handleAttackMetrics === 'function') {
            this.handleAttackMetrics(data);
          }
          break;
        default:
          break;
      }
    };
    this.conn = conn;
  }

  onClose(callback) {
    this.handleClose = callback;
  }

  onAttackStart(callback) {
    this.handleAttackStart = callback;
  }

  onAttackFinish(callback) {
    this.handleAttackFinish = callback;
  }

  onAttackMetrics(callback) {
    this.handleAttackMetrics = callback;
  }
}

export default WebSocketClient;

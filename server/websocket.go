package main

import (
	"log"
	"time"
	"net/http"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second
	// Send pings to peer with the priod. Must be less than pongWait
	pingPeriod = (pongWait * 9) / 10
	// Maximum message size allowed from peer
	maxMessageSize = 512
	// Outgoing default channel size
	sendChannelSize = 512
	// Broadcast Channel Size
	broadcastChannelSize = 16
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
	upgrador = websocket.Upgrader{
		ReadBufferSize: 1024,
		WriteBufferSize: 1024,
	}
)

type BroadCaster interface {
	Broadcast(event string, data interface{}) error
}

type message struct {
	Event string `json:"event"`
	Data  interface{} `json:"data"`
}

// WebSocketClient is a middleman between the websocket connection and the hub
type WebSocketClient struct {
	hub *WebSocketHub
	// The websocket connection
	conn *websocket.Conn
	// Buffered channel of outbound messages
	send chan *message
}

// WebSocketHub maintains the set of active clients
// and broadcasts messages to the clients
type WebSocketHub struct {
	// Registered clients
	clients map[*WebSocketClient]bool
	// Inbound messages from the clients
	broadcast chan *message
	// Register requests from the clients
	register chan *WebSocketClient
	// Unregister requests from clients
	unregister chan *WebSocketClient
}

func (c *WebSocketClient) read() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		message := new(message)
		if err := c.conn.ReadJSON(message); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}

		c.hub.broadcast <- message
	}
}

func (c *WebSocketClient) write() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteJSON(message); err != nil {
				log.Printf("err: %v", err)
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func serveWebSocket(hub *WebSocketHub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrador.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &WebSocketClient{
		hub: hub,
		conn: conn,
		send: make(chan *message, sendChannelSize),
	}
	client.hub.register <- client
	go client.write()
	client.read()
}

func NewWebSocketHub() *WebSocketHub {
	return &WebSocketHub{
		broadcast:  make(chan *message, broadcastChannelSize),
		register:   make(chan *WebSocketClient),
		unregister: make(chan *WebSocketClient),
		clients:    make(map[*WebSocketClient]bool),
	}
}

func (h *WebSocketHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			h.Broadcast(message.Event, message.Data)
		}
	}
}

// Broadcast sends message to then all clients
func (h *WebSocketHub) Broadcast(event string, data interface{}) error {
	message := &message{ Event: event, Data: data }
	for client := range h.clients {
		select {
		case client.send <- message:
		default:
			close(client.send)
			delete(h.clients, client)
		}
	}
	return nil
}

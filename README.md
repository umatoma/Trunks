# Trunks
Trunks is a simple HTTP load testing tool with UI

| Attack | Result |
| ------ | ------ |
| ![](https://user-images.githubusercontent.com/7200238/73227310-82a62000-41b6-11ea-9dc8-fd6a7d9364ea.png) | ![](https://user-images.githubusercontent.com/7200238/73227311-82a62000-41b6-11ea-8fea-d9e77acf87ce.png) |

# Install
**Currently, build only rpm for CentOS 6.**

CentOS 6
```bash
$ curl -O -L https://github.com/umatoma/trunks/releases/download/v0.1.0/trunks-v0.1.0-1.x86_64.rpm
$ sudo rpm -Uvh trunks-v0.1.0-1.x86_64.rpm
$ sudo service trunks start
Starting trunks:                                           [  OK  ]
$ sudo service trunks stop
Stopping trunks:                                           [  OK  ]
```

Mac
```bash
$ curl -O -L https://github.com/umatoma/trunks/releases/download/v0.1.0/trunks-v0.1.0-darwin-amd64.tar.gz
$ tar -C /usr/local/bin -xzf ./trunks-v0.1.0-darwin-amd64.tar.gz
$ trunks
INFO[0000] options                                       addr="0.0.0.0:3000" results=results
INFO[0000] start WebSocketHub
⇛ http server started on [::]:3000
```

Linux
```bash
$ curl -O -L https://github.com/umatoma/trunks/releases/download/v0.1.0/trunks-v0.1.0-linux-amd64.tar.gz
$ tar -C /usr/local/bin -xzf ./trunks-v0.1.0-darwin-amd64.tar.gz
$ trunks
INFO[0000] options                                       addr="0.0.0.0:3000" results=results
INFO[0000] start WebSocketHub
⇛ http server started on [::]:3000
```

# Browsers support
- Chrome

# Requirement
All you need is only a prebuild binary data.

# Development
1. Install Go
2. Install Node.js
3. git clone this repository
4. run `make all`
5. write your code!!

# Licence
[MIT](https://github.com/umatoma/trunks/blob/master/LICENSE)

# Author
[umatoma](github.com/umatoma)

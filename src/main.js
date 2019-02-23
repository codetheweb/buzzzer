const form = document.getElementsByClassName('interface')[0];

form.addEventListener('submit', e => {
  e.preventDefault();

  const room = e.target.room.value;
  const user = e.target.user.value;

  const peer = new Peer('buzzzer-' + room);

  window.conn = peer.connect('buzzzer-' + room);

  console.log(window.conn)

  window.conn.on('open', () => {
    console.log('opened!')
    window.conn.send('osadifh');
  });

  window.conn.on('data', data => {
    console.log(data)
  })
}, false);

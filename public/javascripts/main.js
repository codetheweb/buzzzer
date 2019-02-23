const soundEffect = new Audio('assets/buzzer.wav');

const socket = io();
let room, user, timeAtReset;

// Emitted when self joins
socket.on('host', isHost => {
  $('.welcome').addClass('hidden');

  if (isHost) {
    $('.host').removeClass('hidden');
  } else {
    $('.player').removeClass('hidden');
  }
});

// Emitted when player buzzes in
socket.on('buzzed', data => {
  // Play buzzer sound effect
  soundEffect.play();

  // Show results
  $('.results .playerId').text(data.playerId);
  $('.results .buzzTime').text(data.time / 1000);

  // Disable buzz button
  $('#buzz-button').removeClass('enabled').attr('disabled', 'disabled');
});

// Emitted when game is reset
socket.on('reset', () => {
  // Enable buzz button
  $('#buzz-button').addClass('enabled').removeAttr('disabled');

  // Clear results
  $('.results .playerId').text('...');
  $('.results .buzzTime').text('...');

  // Reset timer
  timeAtReset = + new Date();
});

$('#join-form').submit(e => {
  e.preventDefault();

  soundEffect.play().then(() => {
    soundEffect.pause();
  });

  room = e.target.room.value;
  user = e.target.user.value;

  socket.emit('room', {room, user});
});

$('#buzz-button').click(e => {
  const time = new Date() - timeAtReset;

  socket.emit('buzzed', {playerId: user, time: time})
});

$('#host-reset').click(e => {
  socket.emit('reset');
});

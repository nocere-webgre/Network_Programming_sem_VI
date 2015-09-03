var buttonPlay = $('.button-play');

var socket = io.connect('http://37.233.103.234:3000/');
var available = false;
var steps = {
    name: $('#set-login'),
    first: $('.first-step'),
    second: $('.second-step'),
    error: $('.error')
};
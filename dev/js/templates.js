var rooms = _.template(
    '<li>' +
        '<div class="rackets <% if (players == 1) { %>one-player<% } if (players > 1 ) { %>full<% } %>"></div>' +
        '<div class="btn <% if (players < 2) { %>join-to-game<% } %>" data-join="<%- key %>">' +
            '<div></div>' +
        '</div>' +
    '</li>'
);

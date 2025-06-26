const { Container } = require("./container")

module.exports = function() {
    let container = new Container();

    require('../providers/agent')(container);

    return container;
}
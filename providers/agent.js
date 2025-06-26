const { OpenAIAgent } = require("../services/open_ai_agent")

module.exports = function(container) {
    container.service('Agent', container => new OpenAIAgent());
}
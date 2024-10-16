const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.document = dom.window.document;
global.window = dom.window;

const { appendStyles, initCanvas } = require('../bitcoin/brc333ui.js');
global.window.UI = { appendStyles, initCanvas };

module.exports = { window: global.window };

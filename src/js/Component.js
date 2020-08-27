import morphdom from 'https://unpkg.com/morphdom@2.6.1/dist/morphdom-esm.js';

let id = 0;

/**
 * Component
 */
function Component(options) {
  this.$container = document.querySelector(options.container);
  this.options = options || {};
  this._id = id++;
  this.options.count = 0;
};

Component.prototype.toHTML = function() {
  return this.template(this.options);
};

Component.prototype.template = function() {
  const { host } = new URL(this.options.url);
  return `
<div id="component-container">
  <img class="logo" width="32" height="32" src="${`https://api.faviconkit.com/${host}/144`}" />
  <div class="site">${this.options.count}</div>
</div>
  `;
};

Component.prototype.UIevents = function() {
  this.render();
  setInterval(() => {
    this.options.count++;
    this.render();
  }, 1000);
}

Component.prototype.render = function() {
  morphdom(this.$container, this.template(this.options), { childrenOnly: false });
}

Component.prototype.destroy = function() {
  this.rootNode = undefined;
  this.virtual = undefined;
  this.$container.removeEventListener('click.' + this._id);
};

/**
 * Expose Component
 */
export default Component;

'use strict';

function noop() {}

function assign(tar, src) {
	for (var k in src) { tar[k] = src[k]; }
	return tar;
}

function assignTrue(tar, src) {
	for (var k in src) { tar[k] = 1; }
	return tar;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations, detach) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) { iterations[i].d(detach); }
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = noop;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function fire(eventName, data) {
	var this$1 = this;

	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) { return; }

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			try {
				handler.__calling = true;
				handler.call(this$1, data);
			} finally {
				handler.__calling = false;
			}
		}
	}
}

function get() {
	return this._state;
}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = options.store || component.root.store;
}

function on(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) { handlers.splice(index, 1); }
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) { return; }
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var this$1 = this;

	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this$1._differs(newState[key], oldState[key])) { changed[key] = dirty = true; }
	}
	if (!dirty) { return; }

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) { this._bind(changed, this._state); }

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function callAll(fns) {
	while (fns && fns.length) { fns.shift()(); }
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	on: on,
	set: set,
	_recompute: noop,
	_set: _set,
	_mount: _mount,
	_differs: _differs
};

/* src\logger.html generated by Svelte v2.9.7 */

var POSITION_TOP_LEFT = 'top-left';
var POSITION_TOP_RIGHT = 'top-right';
var POSITION_BOTTOM_LEFT = 'bottom-left';
var POSITION_BOTTOM_RIGHT = 'bottom-right';

function data() {
  return {
    logs: [],
    position: POSITION_BOTTOM_LEFT
  }
}
var methods = {
  clear: function clear () {
    this.logs = [];
    this.cache = {};
  },

  log: function log (name, value) {
    var log;
    if (log = this.cache[name]) {
      log.value = value;
    } else {
      log = { name: name, value: value };
      this.cache[name] = log;
      this.logs.push(log);
    }
    this.set({ logs: this.logs });
  }
};

function oncreate() {
  this.clear();
}
function setup(Logger) {
  Logger.POSITION_TOP_LEFT = POSITION_TOP_LEFT;
  Logger.POSITION_TOP_RIGHT = POSITION_TOP_RIGHT;
  Logger.POSITION_BOTTOM_LEFT = POSITION_BOTTOM_LEFT;
  Logger.POSITION_BOTTOM_RIGHT = POSITION_BOTTOM_RIGHT;
}
function add_css() {
	var style = createElement("style");
	style.id = 'svelte-190ghym-style';
	style.textContent = ".container.svelte-190ghym{position:absolute;opacity:0.9;background-color:#020;color:lime;font-family:monospace;font-size:12px;backface-visibility:hidden}.top-left.svelte-190ghym{top:0;left:0}.top-right.svelte-190ghym{top:0;right:0}.bottom-left.svelte-190ghym{bottom:0;left:0}.bottom-right.svelte-190ghym{bottom:0;right:0}.value.svelte-190ghym{will-change:content}";
	appendNode(style, document.head);
}

function create_main_fragment(component, ctx) {
	var div, table, tbody, div_class_value;

	var each_value = ctx.logs;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
	}

	return {
		c: function c() {
			div = createElement("div");
			table = createElement("table");
			tbody = createElement("tbody");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			div.className = div_class_value = "container " + ctx.position + " svelte-190ghym";
		},

		m: function m(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(table, div);
			appendNode(tbody, table);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}
		},

		p: function p(changed, ctx) {
			if (changed.logs) {
				each_value = ctx.logs;

				for (var i = 0; i < each_value.length; i += 1) {
					var child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block(component, child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.position) && div_class_value !== (div_class_value = "container " + ctx.position + " svelte-190ghym")) {
				div.className = div_class_value;
			}
		},

		d: function d(detach) {
			if (detach) {
				detachNode(div);
			}

			destroyEach(each_blocks, detach);
		}
	};
}

// (50:6) {#each logs as log}
function create_each_block(component, ctx) {
	var tr, td, text_value = ctx.log.name, text, text_1, td_1, text_2_value = ctx.log.value, text_2;

	return {
		c: function c() {
			tr = createElement("tr");
			td = createElement("td");
			text = createText(text_value);
			text_1 = createText(":");
			td_1 = createElement("td");
			text_2 = createText(text_2_value);
			td_1.className = "value svelte-190ghym";
		},

		m: function m(target, anchor) {
			insertNode(tr, target, anchor);
			appendNode(td, tr);
			appendNode(text, td);
			appendNode(text_1, td);
			appendNode(td_1, tr);
			appendNode(text_2, td_1);
		},

		p: function p(changed, ctx) {
			if ((changed.logs) && text_value !== (text_value = ctx.log.name)) {
				text.data = text_value;
			}

			if ((changed.logs) && text_2_value !== (text_2_value = ctx.log.value)) {
				text_2.data = text_2_value;
			}
		},

		d: function d(detach) {
			if (detach) {
				detachNode(tr);
			}
		}
	};
}

function get_each_context(ctx, list, i) {
	var child_ctx = Object.create(ctx);
	child_ctx.log = list[i];
	child_ctx.each_value = list;
	child_ctx.log_index = i;
	return child_ctx;
}

function Logger(options) {
	var this$1 = this;

	init(this, options);
	this._state = assign(data(), options.data);
	this._intro = true;

	if (!document.getElementById("svelte-190ghym-style")) { add_css(); }

	if (!options.root) {
		this._oncreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	this.root._oncreate.push(function () {
		oncreate.call(this$1);
		this$1.fire("update", { changed: assignTrue({}, this$1._state), current: this$1._state });
	});

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		callAll(this._oncreate);
	}
}

assign(Logger.prototype, proto);
assign(Logger.prototype, methods);

setup(Logger);

module.exports = Logger;

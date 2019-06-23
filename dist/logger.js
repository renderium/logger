function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (var i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            { iterations[i].d(detaching); }
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function attr(node, attribute, value) {
    if (value == null)
        { node.removeAttribute(attribute); }
    else
        { node.setAttribute(attribute, value); }
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        { text.data = data; }
}

var current_component;
function set_current_component(component) {
    current_component = component;
}

var dirty_components = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    var seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            var component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            { binding_callbacks.shift()(); }
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        while (render_callbacks.length) {
            var callback = render_callbacks.pop();
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_render);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_render.forEach(add_render_callback);
    }
}
var outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor) {
    var ref = component.$$;
    var fragment = ref.fragment;
    var on_mount = ref.on_mount;
    var on_destroy = ref.on_destroy;
    var after_render = ref.after_render;
    fragment.m(target, anchor);
    // onMount happens after the initial afterUpdate. Because
    // afterUpdate callbacks happen in reverse order (inner first)
    // we schedule onMount callbacks before afterUpdate callbacks
    add_render_callback(function () {
        var new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push.apply(on_destroy, new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_render.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    if (component.$$.fragment) {
        run_all(component.$$.on_destroy);
        if (detaching)
            { component.$$.fragment.d(1); }
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
    var parent_component = current_component;
    set_current_component(component);
    var props = options.props || {};
    var $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal: not_equal$$1,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_render: [],
        after_render: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    var ready = false;
    $$.ctx = instance
        ? instance(component, props, function (key, value) {
            if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    { $$.bound[key](value); }
                if (ready)
                    { make_dirty(component, key); }
            }
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_render);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.c();
        }
        if (options.intro)
            { transition_in(component.$$.fragment); }
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
var SvelteComponent = function SvelteComponent () {};

SvelteComponent.prototype.$destroy = function $destroy () {
    destroy_component(this, 1);
    this.$destroy = noop;
};
SvelteComponent.prototype.$on = function $on (type, callback) {
    var callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
    callbacks.push(callback);
    return function () {
        var index = callbacks.indexOf(callback);
        if (index !== -1)
            { callbacks.splice(index, 1); }
    };
};
SvelteComponent.prototype.$set = function $set () {
    // overridden by instance, if it has props
};

/* src\logger.svelte generated by Svelte v3.5.3 */

function add_css() {
	var style = element("style");
	style.id = 'svelte-1npu1ar-style';
	style.textContent = ".container.svelte-1npu1ar{position:absolute;opacity:0.9;background-color:#020;color:lime;font-family:monospace;font-size:12px;backface-visibility:hidden}.top-left.svelte-1npu1ar{top:0;left:0}.top-right.svelte-1npu1ar{top:0;right:0}.bottom-left.svelte-1npu1ar{bottom:0;left:0}.bottom-right.svelte-1npu1ar{bottom:0;right:0}.value.svelte-1npu1ar{will-change:content}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	var child_ctx = Object.create(ctx);
	child_ctx.log = list[i];
	return child_ctx;
}

// (34:6) {#each logs as log}
function create_each_block(ctx) {
	var tr, td0, t0_value = ctx.log.name, t0, t1, td1, t2_value = ctx.log.value, t2, t3;

	return {
		c: function c() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = text(":");
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			attr(td1, "class", "value svelte-1npu1ar");
		},

		m: function m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(td0, t1);
			append(tr, td1);
			append(td1, t2);
			append(tr, t3);
		},

		p: function p(changed, ctx) {
			if ((changed.logs) && t0_value !== (t0_value = ctx.log.name)) {
				set_data(t0, t0_value);
			}

			if ((changed.logs) && t2_value !== (t2_value = ctx.log.value)) {
				set_data(t2, t2_value);
			}
		},

		d: function d(detaching) {
			if (detaching) {
				detach(tr);
			}
		}
	};
}

function create_fragment(ctx) {
	var div, table, tbody, div_class_value;

	var each_value = ctx.logs;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c: function c() {
			div = element("div");
			table = element("table");
			tbody = element("tbody");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			attr(div, "class", div_class_value = "container " + ctx.position + " svelte-1npu1ar");
		},

		m: function m(target, anchor) {
			insert(target, div, anchor);
			append(div, table);
			append(table, tbody);

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
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.position) && div_class_value !== (div_class_value = "container " + ctx.position + " svelte-1npu1ar")) {
				attr(div, "class", div_class_value);
			}
		},

		i: noop,
		o: noop,

		d: function d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	var POSITION_TOP_LEFT = 'top-left', POSITION_TOP_RIGHT = 'top-right', POSITION_BOTTOM_LEFT = 'bottom-left', POSITION_BOTTOM_RIGHT = 'bottom-right';

  var logs = [];
  var cache = {};

  var position = $$props.position; if ( position === void 0 ) position = POSITION_BOTTOM_LEFT;

  function clear () {
    $$invalidate('logs', logs = []);
    cache = {};
  }

  function log (name, value) {
    var log;
    if (log = cache[name]) {
      log.value = value;
      $$invalidate('logs', logs);
    } else {
      log = { name: name, value: value };
      cache[name] = log;      $$invalidate('logs', logs = logs.concat(log));
    }
    return this
  }

	$$self.$set = function ($$props) {
		if ('position' in $$props) { $$invalidate('position', position = $$props.position); }
	};

	return {
		POSITION_TOP_LEFT: POSITION_TOP_LEFT,
		POSITION_TOP_RIGHT: POSITION_TOP_RIGHT,
		POSITION_BOTTOM_LEFT: POSITION_BOTTOM_LEFT,
		POSITION_BOTTOM_RIGHT: POSITION_BOTTOM_RIGHT,
		logs: logs,
		position: position,
		clear: clear,
		log: log
	};
}

var Logger = /*@__PURE__*/(function (SvelteComponent) {
	function Logger(options) {
		SvelteComponent.call(this);
		if (!document.getElementById("svelte-1npu1ar-style")) { add_css(); }
		init(this, options, instance, create_fragment, safe_not_equal, ["POSITION_TOP_LEFT", "POSITION_TOP_RIGHT", "POSITION_BOTTOM_LEFT", "POSITION_BOTTOM_RIGHT", "position", "clear", "log"]);
	}

	if ( SvelteComponent ) Logger.__proto__ = SvelteComponent;
	Logger.prototype = Object.create( SvelteComponent && SvelteComponent.prototype );
	Logger.prototype.constructor = Logger;

	var prototypeAccessors = { POSITION_TOP_LEFT: { configurable: true },POSITION_TOP_RIGHT: { configurable: true },POSITION_BOTTOM_LEFT: { configurable: true },POSITION_BOTTOM_RIGHT: { configurable: true },position: { configurable: true },clear: { configurable: true },log: { configurable: true } };

	prototypeAccessors.POSITION_TOP_LEFT.get = function () {
		return this.$$.ctx.POSITION_TOP_LEFT;
	};

	prototypeAccessors.POSITION_TOP_RIGHT.get = function () {
		return this.$$.ctx.POSITION_TOP_RIGHT;
	};

	prototypeAccessors.POSITION_BOTTOM_LEFT.get = function () {
		return this.$$.ctx.POSITION_BOTTOM_LEFT;
	};

	prototypeAccessors.POSITION_BOTTOM_RIGHT.get = function () {
		return this.$$.ctx.POSITION_BOTTOM_RIGHT;
	};

	prototypeAccessors.position.get = function () {
		return this.$$.ctx.position;
	};

	prototypeAccessors.position.set = function (position) {
		this.$set({ position: position });
		flush();
	};

	prototypeAccessors.clear.get = function () {
		return this.$$.ctx.clear;
	};

	prototypeAccessors.log.get = function () {
		return this.$$.ctx.log;
	};

	Object.defineProperties( Logger.prototype, prototypeAccessors );

	return Logger;
}(SvelteComponent));

export default Logger;

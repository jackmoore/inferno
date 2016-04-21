var Inferno = (function() {
	"use strict";

	function isArray(obj) {
		return obj instanceof Array;
	}

	function isStringOrNumber(obj) {
		return typeof obj === 'string' || typeof obj === 'number';
	}

	function isNullOrUndefined(obj) {
		return obj === undefined || obj === null;
	}

	function isInvalid(obj) {
		return obj === undefined || obj === null || obj === false;
	}

	function isFunction(obj) {
		return typeof obj === 'function';
	}

	function isString(obj) {
		return typeof obj === 'string';
	}

	function VNode(tag) {
		this._dom = null;
		this._tag = tag;
		this._className = null
		this._children = null;
		this._attrs = null;
		this._childrenType = 0;
	}

	VNode.prototype.className = function (children) {
		this._className = children;
		return this;
	};

	VNode.prototype.children = function (children) {
		this._children = children;
		return this;
	};

	function getType(input) {
		if (isInvalid(input)) {
			return 0;
		} else if (isArray(input)) {
			return 1;
		} else if (isStringOrNumber(input)) {
			return 2;
		} else {
			return 3;
		}
	}

	function createVNode(tag) {
		return new VNode(tag);
	}

	function mountText(text, parentDom, parentType) {
		if (text !== '') {
			if (parentType === 3) {
				parentDom.textContent = text;
				return;
			}
		}
		parentDom.appendChild(document.createTextNode(text));
	}

	function mountVNode(vNode, parentDom, parentType) {
		var tag = vNode._tag;
		var attrs = vNode._attrs;
		var children = vNode._children;
		var className = vNode._className;
		var dom = document.createElement(tag);

		vNode._dom = dom;

		if (children !== null) {
			mount(children, dom, parentType, vNode);
		}
		if (attrs !== null) {

		}
		if (className !== null) {
			dom.className = className;
		}
		parentDom.appendChild(dom);
	}

	function mount(input, parentDom, parentType, parentVNode) {
		var type = getType(input);

		if (parentVNode !== null) {
			parentVNode._childrenType = type;
		}

		switch (type) {
			case 1:
				for (var i = 0, length = input.length; i < length; i++) {
					mount(input[i], parentDom, parentType, null);
				}
				break;
			case 2:
				mountText(input, parentDom, parentType);
				break;
			case 3:
				mountVNode(input, parentDom, type);
				break;
			default:
				break;
		}
		return input;
	}

	function patchNode(lastVNode, nextVNode) {
		var dom = lastVNode._dom;
		var className = nextVNode._className;
		var lastChildren = lastVNode._children;
		var nextChildren = nextVNode._children;

		nextVNode._dom = dom;

		if (lastChildren !== null) {
			if (nextChildren !== null) {
				patch(lastChildren, nextChildren, dom, lastVNode._childrenType);
			}
		}
		if (className !== lastVNode._className) {
			dom.className = className;
		}
	}

	function patchText(text, parentDom) {
		parentDom.firstChild.nodeValue = text;
	}

	function patchNonKeyed(lastChildren, nextChildren, parentDom) {
		var lastChildrenLength = lastChildren.length;
		var nextChildrenLength = nextChildren.length;

		if (lastChildrenLength === nextChildrenLength) {
			for (var i = 0; i < nextChildrenLength; i++) {
				patch(lastChildren[i], nextChildren[i], parentDom);
			}
		}
	}

	function patch(lastInput, nextInput, parentDom, lastInputType) {
		if (lastInput !== nextInput) {
			var lastType = lastInputType || getType(lastInput);
			var nextType = getType(nextInput);

			if (lastType === 3) {
				if (nextType === 3) {
					patchNode(lastInput, nextInput);
				}
			} else if (lastType === 2) {
				if (nextType === 2) {
					patchText(nextInput, parentDom);
				}
			} else if (lastType === 1) {
				if (nextType === 1) {
					// assume non keyed
					patchNonKeyed(lastInput, nextInput, parentDom);
				}
			}
		}
		return nextInput;
	}

	return {
		mount: mount,
		patch: patch,
		createVNode: createVNode
	};
})();

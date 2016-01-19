var appendChild = HTMLElement.prototype.appendChild;
HTMLElement.prototype.appendChild = function(el) {
    if (el) {
        appendChild.apply(this, arguments);
    }
};

if (typeof HTMLElement.prototype.appendChildren !== 'function') {
    HTMLElement.prototype.appendChildren = function(children) {
        children = Array.isArray(children) ? children : [children];
        children.forEach(function(child) {
            if (child instanceof HTMLElement) {
                this.appendChild(child);
            } else if (child) {
                this.appendChild(document.createTextNode(child.toString()));
            }
        }, this);
    };
}

if (typeof HTMLElement.prototype.setAttributes !== 'function') {
    HTMLElement.prototype.setAttributes = function(attributes) {
        var isPlainObject = Object.prototype.toString.call(attributes) ===
                '[object Object]' &&
            typeof attributes.constructor === 'function' &&
            Object.prototype.toString.call(attributes.constructor.prototype) ===
                '[object Object]' &&
            attributes.constructor.prototype.hasOwnProperty('isPrototypeOf');
        if (isPlainObject) {
            for (var key in attributes) {
                this.setAttribute(key, attributes[key]);
            }
        } else {
            throw new DOMException(
                'Failed to execute \'setAttributes\' on \'Element\': ' +
                Object.prototype.toString.call(attributes) +
                ' is not a plain object.'
            );
        }
    };
}
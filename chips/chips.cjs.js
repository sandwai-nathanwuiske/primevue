'use strict';

var utils = require('primevue/utils');
var vue = require('vue');

var script = {
    name: 'Chips',
    emits: ['update:modelValue', 'add', 'remove', 'focus', 'blur'],
    props: {
        modelValue: {
            type: Array,
            default: null
        },
        max: {
            type: Number,
            default: null
        },
        separator: {
            type: String,
            default: null
        },
        addOnBlur: {
            type: Boolean,
            default: null
        },
        allowDuplicate: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: null
        },
        inputId: null,
        inputClass: null,
        inputStyle: null,
        inputProps: null,
        disabled: {
            type: Boolean,
            default: false
        },
        'aria-labelledby': {
            type: String,
			default: null
        },
        'aria-label': {
            type: String,
            default: null
        }
    },
    data() {
        return {
            id: utils.UniqueComponentId(),
            inputValue: null,
            focused: false,
            focusedIndex: null
        };
    },
    methods: {
        onWrapperClick() {
            this.$refs.input.focus();
        },
        onInput(event) {
            this.inputValue = event.target.value;
            this.focusedIndex = null;
        },
        onFocus(event) {
            this.focused = true;
            this.focusedIndex = null;
            this.$emit('focus', event);
        },
        onBlur(event) {
            this.focused = false;
            this.focusedIndex = null;
            if (this.addOnBlur) {
                this.addItem(event, event.target.value, false);
            }
            this.$emit('blur', event);
        },
        onKeyDown(event) {
            const inputValue = event.target.value;

            switch(event.code) {
                case 'Backspace':
                    if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                        if (this.focusedIndex !== null) {
                            this.removeItem(event, this.focusedIndex);
                        }
                        else this.removeItem(event, this.modelValue.length - 1);
                    }
                break;

                case 'Enter':
                    if (inputValue && inputValue.trim().length && !this.maxedOut) {
                        this.addItem(event, inputValue, true);
                    }
                break;

                case 'ArrowLeft':
                    if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                        this.$refs.container.focus();
                    }
                break;

                case 'ArrowRight':
                    event.stopPropagation();
                break;

                default:
                    if (this.separator) {
                        if (this.separator === ',' && event.key === ',') {
                            this.addItem(event, inputValue, true);
                        }
                    }
                break;
            }
        },
        onPaste(event) {
            if (this.separator) {
                let pastedData = (event.clipboardData || window['clipboardData']).getData('Text');
                if (pastedData) {
                    let value = this.modelValue || [];
                    let pastedValues = pastedData.split(this.separator);
                    pastedValues = pastedValues.filter(val => (this.allowDuplicate || value.indexOf(val) === -1));
                    value = [...value, ...pastedValues];
                    this.updateModel(event, value, true);
                }
            }
        },
        onContainerFocus() {
            this.focused = true;
        },
        onContainerBlur() {
            this.focusedIndex = -1;
            this.focused = false;
        },
        onContainerKeyDown(event) {
            switch (event.code) {
                case 'ArrowLeft':
                    this.onArrowLeftKeyOn(event);
                    break;

                case 'ArrowRight':
                    this.onArrowRightKeyOn(event);
                    break;

                case 'Backspace':
                    this.onBackspaceKeyOn(event);
                    break;
            }
        },
        onArrowLeftKeyOn() {
            if (this.inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                this.focusedIndex = this.focusedIndex === null ? this.modelValue.length - 1 : this.focusedIndex - 1;
                if (this.focusedIndex < 0) this.focusedIndex = 0;
            }
        },
        onArrowRightKeyOn() {
            if (this.inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {

                if (this.focusedIndex === this.modelValue.length - 1) {
                    this.focusedIndex = null;
                    this.$refs.input.focus();
                }
                else {
                    this.focusedIndex++;
                }
            }
        },
        onBackspaceKeyOn(event) {
            if (this.focusedIndex !== null) {
                this.removeItem(event, this.focusedIndex);
            }
        },
        updateModel(event, value, preventDefault) {
            this.$emit('update:modelValue', value);
            this.$emit('add', {
                originalEvent: event,
                value: value
            });
            this.$refs.input.value = '';
            this.inputValue = '';

            if (preventDefault) {
                event.preventDefault();
            }
        },
        addItem(event, item, preventDefault) {
            if (item && item.trim().length) {
                let value = this.modelValue ? [...this.modelValue]: [];
                if (this.allowDuplicate || value.indexOf(item) === -1) {
                    value.push(item);
                    this.updateModel(event, value, preventDefault);
                }
            }
        },
        removeItem(event, index) {
            if (this.disabled) {
                return;
            }

            let values = [...this.modelValue];
            const removedItem = values.splice(index, 1);
            this.focusedIndex = null;
            this.$refs.input.focus();
            this.$emit('update:modelValue', values);
            this.$emit('remove', {
                originalEvent: event,
                value: removedItem
            });
        }
    },
    computed: {
        maxedOut() {
            return this.max && this.modelValue && this.max === this.modelValue.length;
        },
        containerClass() {
            return ['p-chips p-component p-inputwrapper', {
                'p-disabled': this.disabled,
                'p-focus': this.focused,
                'p-inputwrapper-filled': ((this.modelValue && this.modelValue.length) || (this.inputValue && this.inputValue.length)),
                'p-inputwrapper-focus': this.focused
            }];
        },
        focusedOptionId() {
            return this.focusedIndex !== null ? `${this.id}_chips_item_${this.focusedIndex}` : null;
        }
    }
};

const _hoisted_1 = ["aria-labelledby", "aria-label", "aria-activedescendant"];
const _hoisted_2 = ["id", "aria-label", "aria-setsize", "aria-posinset"];
const _hoisted_3 = { class: "p-chips-token-label" };
const _hoisted_4 = ["onClick"];
const _hoisted_5 = {
  class: "p-chips-input-token",
  role: "option"
};
const _hoisted_6 = ["id", "disabled", "placeholder"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass($options.containerClass)
  }, [
    vue.createElementVNode("ul", {
      ref: "container",
      class: "p-inputtext p-chips-multiple-container",
      tabindex: "-1",
      role: "listbox",
      "aria-orientation": "horizontal",
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-label": _ctx.ariaLabel,
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
      onClick: _cache[5] || (_cache[5] = $event => ($options.onWrapperClick())),
      onFocus: _cache[6] || (_cache[6] = (...args) => ($options.onContainerFocus && $options.onContainerFocus(...args))),
      onBlur: _cache[7] || (_cache[7] = (...args) => ($options.onContainerBlur && $options.onContainerBlur(...args))),
      onKeydown: _cache[8] || (_cache[8] = (...args) => ($options.onContainerKeyDown && $options.onContainerKeyDown(...args)))
    }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.modelValue, (val, i) => {
        return (vue.openBlock(), vue.createElementBlock("li", {
          key: `${i}_${val}`,
          id: $data.id + '_chips_item_' + i,
          role: "option",
          class: vue.normalizeClass(['p-chips-token', {'p-focus': $data.focusedIndex === i}]),
          "aria-label": val,
          "aria-selected": true,
          "aria-setsize": $props.modelValue.length,
          "aria-posinset": i + 1
        }, [
          vue.renderSlot(_ctx.$slots, "chip", { value: val }, () => [
            vue.createElementVNode("span", _hoisted_3, vue.toDisplayString(val), 1)
          ]),
          vue.createElementVNode("span", {
            class: "p-chips-token-icon pi pi-times-circle",
            onClick: $event => ($options.removeItem($event, i)),
            "aria-hidden": "true"
          }, null, 8, _hoisted_4)
        ], 10, _hoisted_2))
      }), 128)),
      vue.createElementVNode("li", _hoisted_5, [
        vue.createElementVNode("input", vue.mergeProps({
          ref: "input",
          type: "text",
          id: $props.inputId,
          class: $props.inputClass,
          style: $props.inputStyle,
          disabled: $props.disabled || $options.maxedOut,
          placeholder: $props.placeholder,
          onFocus: _cache[0] || (_cache[0] = $event => ($options.onFocus($event))),
          onBlur: _cache[1] || (_cache[1] = $event => ($options.onBlur($event))),
          onInput: _cache[2] || (_cache[2] = (...args) => ($options.onInput && $options.onInput(...args))),
          onKeydown: _cache[3] || (_cache[3] = $event => ($options.onKeyDown($event))),
          onPaste: _cache[4] || (_cache[4] = $event => ($options.onPaste($event)))
        }, $props.inputProps), null, 16, _hoisted_6)
      ])
    ], 40, _hoisted_1)
  ], 2))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.p-chips {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-chips-multiple-container {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    cursor: text;\n    overflow: hidden;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n}\n.p-chips-token {\n    cursor: default;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n}\n.p-chips-input-token {\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-chips-token-icon {\n    cursor: pointer;\n}\n.p-chips-input-token input {\n    border: 0 none;\n    outline: 0 none;\n    background-color: transparent;\n    margin: 0;\n    padding: 0;\n    -webkit-box-shadow: none;\n            box-shadow: none;\n    border-radius: 0;\n    width: 100%;\n}\n.p-fluid .p-chips {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n";
styleInject(css_248z);

script.render = render;

module.exports = script;

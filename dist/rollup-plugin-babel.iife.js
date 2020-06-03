var RollupTypeScriptBabel = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var Counter = /*#__PURE__*/function () {
    function Counter() {
      _classCallCheck(this, Counter);

      _defineProperty(this, "value", 0);
    }

    _createClass(Counter, [{
      key: "getValue",
      value: function getValue() {
        return this.value;
      }
    }, {
      key: "add",
      value: function add() {
        this.value = this.value + 1;
      }
    }, {
      key: "subtract",
      value: function subtract() {
        this.value = this.value - 1;
      }
    }]);

    return Counter;
  }();

  var someHelpfulUtilFunction = function someHelpfulUtilFunction(value) {
    return value;
  };

  var Value = /*#__PURE__*/function () {
    function Value() {
      _classCallCheck(this, Value);

      _defineProperty(this, "value", 10);

      _defineProperty(this, "props", {
        x: 0,
        y: 0
      });
    }

    _createClass(Value, [{
      key: "getValue",
      value: function getValue() {
        return this.value;
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        this.value = value;
      }
    }, {
      key: "setProps",
      value: function setProps(props) {
        this.props = props;
      }
    }, {
      key: "getProps",
      value: function getProps() {
        return someHelpfulUtilFunction(this.props);
      }
    }]);

    return Value;
  }();
  new Value().setValue(1000);
  new Value().setProps({
    x: 1000,
    y: 1000
  });
  var counter = new Counter();
  counter.add();
  counter.add();
  counter.add();
  counter.getValue();
  counter.subtract();
  counter.subtract();
  counter.getValue();

  exports.Value = Value;

  return exports;

}({}));

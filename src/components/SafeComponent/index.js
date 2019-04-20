import React from "react";

class SafeComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this._original = {};

    this._safeUpdate("componentDidMount");
    this._safeUpdate("componentDidUpdate");
    this._safeUpdate("componentWillUnmount");
    this._safeUpdate("setState");
    this._safeUpdate("render");

    this.__isMounted = false;
  }

  _safeUpdate(name) {
    const orig = this[name];
    if (orig) this._original[name] = orig.bind(this);

    this[name] = this[`__safe_${name}`].bind(this);
  }

  __safe_componentDidMount() {
    this.__isMounted = true;
    this._original.componentDidMount && this._original.componentDidMount();
  }

  __safe_componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.__isMounted) {
      this._original.componentDidUpdate &&
        this._original.componentDidUpdate(prevProps, prevState, snapshot);
    }
  }

  __safe_componentWillUnmount() {
    this.__isMounted = false;
    this._original.componentWillUnmount &&
      this._original.componentWillUnmount();
  }

  __safe_setState(state, cb) {
    if (this.__isMounted) {
      this._original.setState(state, cb);
    }
  }

  __safe_render() {
    if (!this._renderResult || this.__isMounted) {
      this._renderResult = this._original.render();
    }
    return this._renderResult;
  }
}

export default SafeComponent;

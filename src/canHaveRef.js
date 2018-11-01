function canHaveRef(component) {
  return !!(
    (component &&
      component.prototype &&
      component.prototype.isReactComponent) ||
    component.render
  ); // function component wrapped with forwardRef
}

export default canHaveRef;

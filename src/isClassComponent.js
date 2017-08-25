function isClassComponent(component) {
  return !!(
    component &&
    component.prototype &&
    component.prototype.isReactComponent
  );
}

export default isClassComponent;

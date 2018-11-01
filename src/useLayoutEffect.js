import { useRef, useLayoutEffect as useReactLayoutEffect } from 'react';

function useLayoutEffect(create, inputs) {
  const didUpdate = useRef(false);

  useReactLayoutEffect(() => {
    if (didUpdate.current === false) {
      didUpdate.current = true;
      return create(false);
    }
    return create(true);
  }, inputs);
}

export default useLayoutEffect;

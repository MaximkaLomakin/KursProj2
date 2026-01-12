// Middleware для логирования Redux действий
export function logMiddleware(store) {
  return function(next) {
    return function(action) {
      console.log('Action:', action.type);
      const result = next(action);
      console.log('New state:', store.getState());
      return result;
    };
  };
}


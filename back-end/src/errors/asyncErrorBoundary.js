function asyncErrorBoundary(callback, defaultStatus) {
  return function (request, response, next) {
    Promise.resolve()
      .then(() => callback(request, response, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        next({ status, message });
      });
  };
}

module.exports = asyncErrorBoundary;

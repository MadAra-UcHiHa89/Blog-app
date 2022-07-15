function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Since sometimes even when there's an error, the status code is 200, we'll set it to 500
  res.status(statusCode);
  res.json({
    message: err?.message, // == err&& err.message i.e both err and err.message are truthsy . Each error thrown has a message described in new throw Error("message")
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack, // The stack trace i.e where the error occured if in production mode then don't show the stack trace else in development mode show the stack trace
  });
}

// Page not found error  / No route found error which will be sent to the error handler if no route is found

function pageNotFound(req, res, next) {
  const error = new Error(`Page not found- ${req.originalUrl} `);
  res.status(404);
  next(error); // Passing the error to the next  middleware
}

module.exports = { errorHandler, pageNotFound };

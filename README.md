# Handling GBs of Data in JavaScript using Streams

This repository contains a JavaScript application that demonstrates how to handle large amounts of data in a performant and efficient way using streams.

## Introduction

When working with large data sets in JavaScript, it can be challenging to prevent the application from getting stuck or becoming unresponsive. One way to solve this problem is to use streams, which provide a way to process data in small chunks instead of loading it all into memory at once.

This application demonstrates how to use streams to handle large amounts of data without getting stuck. The application reads data from a large file (several GBs in size) and processes it using streams to calculate various metrics such as average, maximum, and minimum values.

## Usage

To run the application, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory using the command line.
3. Run `yarn` to install the dependencies.
4. Run `yarn start` to start the application.

The application will read data from the file located in the `data` directory and display the calculated metrics in the console.

## Implementation Details

The application uses the Node.js built-in `fs` module to read data from the file and the `stream` module to process it. Specifically, it uses the `createReadStream` method to create a readable stream and the `pipeline` method to chain together multiple streams to perform various calculations on the data.

By using streams, the application can process the data in small, manageable chunks without having to load it all into memory at once. This makes the application much more performant and efficient, even when working with large amounts of data.

## Conclusion

Handling large amounts of data in JavaScript can be a challenging task, but by using streams, it's possible to create performant and efficient applications that don't get stuck or become unresponsive. This repository provides an example application that demonstrates how to use streams to process large amounts of data in JavaScript.

const autocannon = require("autocannon");

const runTest = (url) => {
  return new Promise((resolve, reject) => {
    autocannon(
      {
        url,
        duration: 30, // Test duration in seconds
      },
      (err, result) => {
        if (err) {
          console.error(`Error during the test for ${url}:`, err);
          reject(err);
          return;
        }
        console.log(`Test completed for ${url}`);
        console.log(`Requests: ${result.requests.total}`);
        console.log(`Duration: ${result.duration} seconds`);
        resolve();
      }
    );
  });
};

const run = async () => {
  try {
    await runTest("http://localhost:3000");
    await runTest("http://localhost:3000/stress-test");
  } catch (err) {
    console.error("An error occurred during the tests:", err);
  }
};

run();

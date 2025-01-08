export const handler = async function (event, context) {
    return {
          statusCode: 200,
          headers: {},
          body: { message: 'Hello from Lambda!' }
      };
  };
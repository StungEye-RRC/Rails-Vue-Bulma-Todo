/*
  Would like to see these methods all return the response
  instead of the JSON promise.

*/

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

const rails_api = {
  headers: {
    'Content-type': 'application/json; charset=utf-8',
    'X-CSRF-Token': document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content')
  },

  checkResponse: function(response, expectedStatus) {
    if (response.status !== expectedStatus) {
      throw new HttpError(response);
    }
  },

  getToDos: async function() {
    const response = await fetch('http://localhost:3000/to_dos.json');

    rails_api.checkResponse(response, 200);
    return response.json();
  },

  createToDo: async function(description) {
    const response = await fetch('http://localhost:3000/to_dos.json', {
      method: 'POST',
      body: JSON.stringify({ description: description, done: false }),
      headers: rails_api.headers
    });

    rails_api.checkResponse(response, 201);
    return response.json();
  },

  updateToDo: async function(todo) {
    const response = await fetch(
      `http://localhost:3000/to_dos/${todo.id}.json`,
      {
        method: 'PATCH',
        body: JSON.stringify({ done: todo.done }),
        headers: rails_api.headers
      }
    );

    rails_api.checkResponse(response, 200);
    return response;
  },

  deleteToDo: async function(id) {
    const response = await fetch(`http://localhost:3000/to_dos/${id}.json`, {
      method: 'DELETE',
      headers: rails_api.headers
    });

    rails_api.checkResponse(response, 204);
    return response;
  }
};

export default rails_api;

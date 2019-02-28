<template>
  <div id="app">
    <p class="error-message" v-if="httpError">
      {{ httpErrorMsg }}
    </p>
    <ol>
      <li v-for="(todo, index) in todos" :key="index">
        <label>
          <input type="checkbox" @change="updateToDo(index)" v-model="todo.done">
          <del v-if="todo.done">
            {{ todo.description }}
          </del>
          <span v-else>
            {{ todo.description }}
          </span>
        </label>
      </li>
    </ol>
    <input v-model.trim="newToDo" @keyup.enter="createToDo" :disabled="inputDisabled" placeholder="New To Do Item">
    <button @click="createToDo">Add</button>
    <button @click="deleteCompleted">Clear Completed</button>
  </div>
</template>

<script>
import RailsAPI from 'rails_api.js';

export default {
  data: function () {
    return {
      newToDo: '',
      todos: [],
      inputDisabled: false,
      httpError: false,
      httpErrorMsg: ''
    }
  },

  /*
    Had to enable @babel/polyfill to get async/await working:
    https://github.com/rails/webpacker/issues/518#issuecomment-437778297
  */
  methods: {
    displayErrorMessage: function(msg) {
      this.httpError = true;
      this.httpErrorMsg = msg;
    },

    createToDo: async function() {
      if (this.newToDo === '') return;

      this.inputDisabled = true;

      try {
        const todo = await RailsAPI.createToDo(this.newToDo);
        this.todos.push(todo);
        this.newToDo = '';
      } catch(error) {
        this.displayErrorMessage("Could not create to do item. Please check your network connection.");
      } finally {
        this.inputDisabled = false;
      }

    },

    updateToDo: async function(id) {
      const todo = this.todos[id];

      try {
        const response = await RailsAPI.updateToDo(todo);
      } catch(error) {
        this.displayErrorMessage("Could not update item status. Please check your network connection.");
        todo.done = !todo.done;
      }
    },

    deleteCompleted: async function() {
      let todones = this.todos.filter(todo => todo.done);

      try {
        for(const todone of todones) {
          const response = await RailsAPI.deleteToDo(todone.id);
          this.todos = this.todos.filter(todo => todo.id !== todone.id);
        }
      } catch (error) {
        this.displayErrorMessage("Could not delete item. Please check your network connection.");
      }
    }
  },

  mounted: async function() {
    try {
      this.todos = await RailsAPI.getToDos();
    } catch (error) {
        this.displayErrorMessage("Could not load items. Please check your network connection.");
    }
  }
}
</script>

<style scoped>
body {
  background: #20262e;
  padding: 20px;
  font-family: Helvetica, sans-serif;
}

#app {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}

ol {
  margin-bottom: 2em;
}

li {
  margin: 8px 0;
}

h2 {
  font-weight: bold;
  margin-bottom: 15px;
}

del {
  color: rgba(0, 0, 0, 0.3);
}
</style>

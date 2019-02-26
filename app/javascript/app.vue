<template>
  <div id="app">
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
      inputDisabled: false,
      todos: []
    }
  },

  /*
    Had to enable @babel/polyfill to get async/await working:
    https://github.com/rails/webpacker/issues/518#issuecomment-437778297
  */
  methods: {
    createToDo: async function() {
      if (this.newToDo === '') return;

      this.inputDisabled = true;
      const todo = await RailsAPI.createToDo(this.newToDo);
      this.todos.push(todo);
      this.newToDo = '';
      this.inputDisabled = false;
    },
    updateToDo: async function(id) {
      const todo = this.todos[id];
      const response = RailsAPI.updateToDo(todo);
    },
    deleteCompleted: async function() {
      let todones = this.todos.filter(todo => todo.done);

      for(const todone of todones) {
        const response = await RailsAPI.deleteToDo(todone.id);

        if (response.status === 204) {
          this.todos = this.todos.filter(todo => todo.id !== todone.id);
        }
      }
    }
  },

  mounted: async function() {
    this.todos = await RailsAPI.getToDos();
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

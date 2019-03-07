<template>
  <div id="app">
    <ErrorModal :errorDetails="errorDetails"></ErrorModal>

    <ul v-if="todos.length" class="is-size-5">
      <li v-for="(todo, index) in todos" :key="index">
        <label>
          <b-checkbox
            @change.native="updateToDo(index)"
            v-model="todo.done"></b-checkbox>
          <del v-if="todo.done">
            {{ todo.description }}
          </del>
          <span v-else>
            {{ todo.description }}
          </span>
        </label>
      </li>
    </ul>
    <p v-else>
      There are no outstanding to do list items. Please add one.
    </p>

    <b-input
      v-model.trim="newToDo"
      @keyup.native.enter="createToDo"
      ref="newItem"
      :disabled="createIsOnGoing"
      placeholder="New To Do Item"
      autofocus></b-input>
    <button
      class="button is-info"
      v-bind:class="{ 'is-loading': createIsOnGoing }"
      @click="createToDo">Add</button>
    <button
      class="button is-warning"
      v-bind:class="{ 'is-loading': deleteIsOnGoing }"
      @click="deleteCompleted">Clear Completed</button>
  </div>
</template>

<script>
import RailsAPI from 'RailsApi.js';
import ErrorModal from 'ErrorModal.vue';

export default {
  components: { ErrorModal },
  data: function () {
    return {
      newToDo: '',
      todos: [],
      createIsOnGoing: false,
      deleteIsOnGoing: false,
      errorDetails: { active: false, message: '', debugging: ''}
    }
  },

  methods: {
    displayErrorMessage: function(error, msg) {
      this.errorDetails.active = true;
      this.errorDetails.message = msg
      this.errorDetails.debugging =  `${error.name} ${error.response.status}`;
    },

    createToDo: async function() {
      if (this.newToDo === '') return;

      this.createIsOnGoing = true;

      try {
        const todo = await RailsAPI.createToDo(this.newToDo);
        this.todos.push(todo);
        this.newToDo = '';
      } catch(error) {
        this.displayErrorMessage(error, "Could not create to do item. Please check your network connection.");
      } finally {
        this.createIsOnGoing = false;
        this.$nextTick(() => this.$refs.newItem.focus()); // Requires a ref attribute on the b-input component.
      }

    },

    updateToDo: async function(id) {
      const todo = this.todos[id];

      try {
        const response = await RailsAPI.updateToDo(todo);
      } catch(error) {
        this.displayErrorMessage(error, "Could not update item status. Please check your network connection.");
        todo.done = !todo.done;
      }
    },

    deleteCompleted: async function() {
      this.deleteIsOnGoing = true;
      let todones = this.todos.filter(todo => todo.done);

      try {
        for(const todone of todones) {
          const response = await RailsAPI.deleteToDo(todone.id);
          this.todos = this.todos.filter(todo => todo.id !== todone.id);
        }
      } catch (error) {
        this.displayErrorMessage(error, "Could not delete item. Please check your network connection.");
      } finally {
        this.deleteIsOnGoing = false;
      }
    }
  },

  mounted: async function() {
    try {
      this.todos = await RailsAPI.getToDos();
    } catch (error) {
        this.displayErrorMessage(error, "Could not load items. Please check your network connection.");
    }
  }
}
</script>

<style scoped>
ul, p {
  margin-bottom: 2em;
}

li {
  margin: 1em 0;
}

del {
  color: rgba(0, 0, 0, 0.3);
}

/deep/ input.input {
  margin-bottom: 2em;
}
</style>

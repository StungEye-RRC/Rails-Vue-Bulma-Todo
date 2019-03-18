<template>
  <div id="app">
    <bLoading
      :active.sync="initialLoadIsOnGoing"
      :can-cancel="true"
    />

    <ul
      v-if="todos.length"
      class="is-size-5"
    >
      <li
        v-for="(todo, index) in todos"
        :key="index"
      >
        <label>
          <bCheckbox
            v-model="todo.done"
            @change.native="updateToDo(index)"
          />
          <del v-if="todo.done">{{ todo.description }}</del>
          <span v-else>{{ todo.description }}</span>
        </label>
      </li>
    </ul>
    <p v-else-if="!initialLoadIsOnGoing">There are no outstanding to do list items. Please add one.</p>

    <bInput
      ref="newItem"
      v-model.trim="newToDo"
      :disabled="createIsOnGoing"
      @keyup.native.enter="createToDo"
      placeholder="New To Do Item"
      autofocus
    />
    <button
      v-bind:class="{ 'is-loading': createIsOnGoing }"
      @click="createToDo"
      class="button is-info"
    >Add</button>
    <button
      v-bind:class="{ 'is-loading': deleteIsOnGoing }"
      @click="deleteCompleted"
      class="button is-warning"
    >Clear Completed</button>
  </div>
</template>

<script>
import RailsAPI from "RailsApi.js";

export default {
  data: function() {
    return {
      newToDo: "",
      todos: [],
      initialLoadIsOnGoing: true,
      createIsOnGoing: false,
      deleteIsOnGoing: false,
      errorDetails: { displayError: false, message: "", debugging: "" }
    };
  },

  methods: {
    displayErrorMessage: function(error, msg) {
      this.errorDetails.displayError = true;
      this.errorDetails.message = msg;
      this.errorDetails.debugging = `${error.name} ${error.response.status}`;
    },

    createToDo: async function() {
      if (this.newToDo === "") return;

      this.createIsOnGoing = true;

      const todo = await RailsAPI.createToDo(this.newToDo);
      this.todos.push(todo);
      this.newToDo = "";
      this.createIsOnGoing = false;
      this.$nextTick(() => this.$refs.newItem.focus()); // Requires a ref attribute on the b-input component.
    },

    updateToDo: async function(id) {
      const todo = this.todos[id];
      const response = await RailsAPI.updateToDo(todo);
    },

    deleteCompleted: async function() {
      this.deleteIsOnGoing = true;
      let todones = this.todos.filter(todo => todo.done);

      for (const todone of todones) {
        const response = await RailsAPI.deleteToDo(todone.id);
        this.todos = this.todos.filter(todo => todo.id !== todone.id);
      }
      this.deleteIsOnGoing = false;
    }
  },

  created: async function() {
    this.todos = await RailsAPI.getToDos();
    this.initialLoadIsOnGoing = false;
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}

ul,
p {
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

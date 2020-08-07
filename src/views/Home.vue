<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
      style="color:white"
      color="blue lighten-1"
      dense
    >
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">TODO APPLICATION</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="mr-5">{{ $store.state.name }}</span>
      <v-btn dark @click="logout" text>Logout</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="items"
              sort-by="calories"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>My Todo</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="showCreateDialog"
                    small
                    class="mx-2"
                    fab
                    dark
                    color="indigo"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon @click="showEditDialog(item)" small class="mr-2">
                  mdi-pencil
                </v-icon>
                <v-icon @click="deleteTodo(item.id)" small class="mr-2">
                  mdi-delete
                </v-icon>
                <v-icon
                  :disabled="!!item.finished_at"
                  @click="finishTodo(item.id)"
                  small
                >
                  mdi-check
                </v-icon>
              </template>
              <template v-slot:no-data>
                <span>No record found</span>
              </template>
              <template v-slot:item.finished_at="{ item }">
                <v-chip v-if="!item.finished_at" color="warning"
                  >Unfinished</v-chip
                >

                <v-tooltip v-else right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-if="item.finished_at"
                      v-on="on"
                      v-bind="attrs"
                      color="success"
                      >Finished</v-chip
                    >
                  </template>
                  <span>{{ item.finished_at }}</span>
                </v-tooltip>
              </template>
              <template v-slot:no-data>
                <span>No record found</span>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Todo</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Title" v-model="form.title"></v-text-field>
          <v-text-field label="Content" v-model="form.content"></v-text-field>
          <DatePicker :value.sync="form.start_at" label="Start at" />
          <DatePicker :value.sync="form.expired_at" label="Expired at" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Close</v-btn
          >
          <v-btn v-if="!editing" color="blue darken-1" @click="createTodo" text
            >Create</v-btn
          >
          <v-btn v-else color="blue darken-1" @click="updateTodo" text
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar :color="status" top v-model="snackbar">
      {{ msg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { index, store, update, destroy, finish } from "@/api/todo";
import { logout } from "@/api/user";
import { removeToken } from "../utils/auth";
import DatePicker from "@/components/DatePicker";
export default {
  components: { DatePicker },
  data() {
    return {
      dialog: false,
      msg: "",
      editing: false,
      snackbar: false,
      status: "",
      form: {
        id: "",
        title: "",
        content: "",
        start_at: new Date(),
        expired_at: new Date(),
      },
      headers: [
        {
          text: "Title",
          value: "title",

          sortable: false,
        },
        { text: "Content", value: "content", sortable: false },
        { text: "Start at", value: "start_at", sortable: false },
        { text: "Expire at", value: "expired_at", sortable: false },
        {
          text: "Status",
          value: "finished_at",
          sortable: false,
          align: "center",
        },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
      items: [],
    };
  },
  methods: {
    async getTodos() {
      const { data } = await index();
      this.items = data;
    },
    showCreateDialog() {
      this.editing = false;
      this.form = {
        id: "",
        title: "",
        content: "",
        start_at: new Date(),
        expired_at: new Date(),
      };
      this.dialog = true;
    },
    async createTodo() {
      try {
        await store(this.form);
        this.dialog = false;
        this.getTodos();
      } catch (error) {}
    },
    showEditDialog(item) {
      this.editing = true;
      for (let field in this.form) {
        this.form[field] = item[field];
      }
      this.dialog = true;
    },
    async createTodo() {
      try {
        await store(this.form);
        this.dialog = false;
        this.getTodos();
        this.showMessage("Created Successfully!", "success");
      } catch (error) {}
    },
    async updateTodo() {
      if (this.form.expired_at < this.form.start_at) {
        this.showMessage("Error!", "error");
        return;
      }
      try {
        await update(this.form.id, this.form);
        this.dialog = false;
        this.getTodos();
        this.showMessage("Updated Successfully!", "success");
      } catch (error) {}
    },
    async finishTodo(id) {
      try {
        await finish(id);
        this.getTodos();
        this.showMessage("Good Job!", "success");
      } catch (error) {}
    },
    async deleteTodo(id) {
      try {
        await destroy(id);
        this.getTodos();
        this.showMessage("Deleted Successfully!", "success");
      } catch (error) {}
    },
    showMessage(msg, status) {
      this.msg = msg;
      this.status = status;
      this.snackbar = true;
    },
    async logout() {
      await logout();
      this.$store.commit("SET_TOKEN", null);
      removeToken();
      this.$router.push("/login");
    },
  },
  created() {
    this.getTodos();
  },
};
</script>

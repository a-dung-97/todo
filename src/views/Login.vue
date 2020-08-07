<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title style="background:#42A5F5;color:white"
                >Login</v-card-title
              >
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-email"
                    type="text"
                    v-model="form.email"
                    @input="$v.form.email.$touch()"
                    @blur="$v.form.email.$touch()"
                    :error-messages="emailErrors"
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    v-model="form.password"
                    prepend-icon="mdi-lock"
                    type="password"
                    @input="$v.form.password.$touch()"
                    @blur="$v.form.password.$touch()"
                    :error-messages="passwordErrors"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="login" :loading="loading" color="primary"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar color="red" top v-model="snackbar">
      Tài khoản hoặc mật khẩu không đúng
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { login, getInfo } from "../api/user";
import { setToken } from "../utils/auth";
export default {
  mixins: [validationMixin],
  validations: {
    form: {
      email: { required, email },
      password: { required },
    },
  },
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required && errors.push("Bạn chưa nhập mật khẩu");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push("Bạn cần nhập 1 email");
      !this.$v.form.email.required && errors.push("Bạn chưa nhập email");
      return errors;
    },
  },
  data() {
    return {
      snackbar: false,
      loading: false,
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        this.loading = true;
        let data = await login(this.form);
        let access_token = data.access_token;
        this.$store.commit("SET_TOKEN", access_token);
        setToken(access_token);
        const { first_name, last_name } = await getInfo();
        this.$store.commit("SET_NAME", first_name + " " + last_name);
        this.$router.push("/");
      } catch (error) {
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    console.log(this.$store.state);
  },
};
</script>

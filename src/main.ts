import { createApp, nextTick } from "vue";
import App from "./App.vue";
import router from "./router";
import { i18n,setLanguage } from "./locales"

import "./assets/input.css";


const app = createApp(App);

app.use(i18n);
app.use(router);

app.mount("#app");

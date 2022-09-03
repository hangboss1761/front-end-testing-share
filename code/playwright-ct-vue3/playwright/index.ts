// Import styles, initialize component theme here.
import { beforeMount } from '@playwright/experimental-ct-vue/hooks';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

beforeMount(async ({ app }) => {
  app.use(ElementPlus);
});

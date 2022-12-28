<template>
  <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <el-option v-for="item in realOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    propsParams?: Record<string, any>;
    defaultValue?: string;
    options: OptionItem[];
  }>(),
  {
    propsParams: () => ({}),
    defaultValue: '',
    options: () => [],
  },
);

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const value = ref(props.defaultValue);
const list = ref<OptionItem[]>([]);
const loading = ref(false);
const realOptions = ref<OptionItem[]>(props.options);

onMounted(() => {
  list.value = states.map(item => {
    return { value: `value:${item}`, label: `label:${item}` };
  });
});

const remoteMethod = (query: string) => {
  if (query !== '') {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      realOptions.value = list.value.filter(item => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
    }, 200);
  } else {
    realOptions.value = [];
  }
};
</script>

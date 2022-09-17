import SelectBase from './BaseSelect.vue';
import RemoteFilterSelect from './RemoteFilterSelect.vue';
import EventSelect from './EventSelect.vue';
import { ElButton } from 'element-plus';

const baseOptions = [
  {
    value: '选项1',
    label: '黄金糕',
  },
  {
    value: '选项2',
    label: '双皮奶',
  },
  {
    value: '选项3',
    label: '蚵仔煎',
  },
  {
    value: '选项4',
    label: '龙须面',
  },
  {
    value: '选项5',
    label: '北京烤鸭',
  },
];

const selectModal = {
  pickSelectOption: ({ text, nth }: { text?: string; nth?: number }) => {
    if (text) {
      cy.get('.el-select-dropdown:visible .el-select-dropdown__item').contains(text).click();
    } else {
      cy.get(`.el-select-dropdown:visible .el-select-dropdown__item::nth-child(${nth})`).click();
    }
  },
  openPopover: () => {
    // 等待popover动画执行完毕
    cy.get('.el-input').click().wait(400);
  },
};

it('mount work', () => {
  cy.mount(SelectBase, {
    props: {
      options: baseOptions,
    },
  });

  selectModal.openPopover();

  /**
   * 官方文档推荐的cypress-plugin-snapshots插件在cypress10.6.0使用时报错
   * 相关issue见：https://github.com/meinaart/cypress-plugin-snapshots/issues/215
   * 这里使用https://github.com/FRSOURCE/cypress-plugin-visual-regression-diff 来实现视觉对比
   */
  cy.matchImage();
});

it('custom dropdown class', () => {
  cy.mount(SelectBase, {
    props: {
      // component props
      propsParams: {
        popperClass: 'ct-class',
      },
      options: baseOptions,
    },
  });

  selectModal.openPopover();
  cy.get('.ct-class.el-select-dropdown').should('be.visible');
});

it('default value work', () => {
  cy.mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  cy.get('.el-input input').should('have.value', baseOptions[0].label);
});

it('single select work', () => {
  cy.mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  selectModal.openPopover();
  selectModal.pickSelectOption({ text: baseOptions[1].label });
  cy.get('.el-input input').should('have.value', baseOptions[1].label);
});

it('disabled option work', () => {
  const options = [
    {
      value: '选项1',
      label: '黄金糕',
    },
    {
      value: '选项2',
      label: '双皮奶',
      disabled: true,
    },
  ];
  cy.mount(SelectBase, {
    props: {
      options: options,
      defaultValue: options[0].value,
    },
  });

  selectModal.openPopover();
  selectModal.pickSelectOption({ text: baseOptions[1].label });
  cy.get('.el-input input').should('have.value', baseOptions[0].label);
});

it('default value work', () => {
  cy.mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  cy.get('.el-input input').should('have.value', baseOptions[0].label);
});

it('keyboard operations work', () => {
  cy.mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  selectModal.openPopover();

  cy.get('.el-input').type('{downArrow}');
  cy.get('.el-input').type('{downArrow}');
  cy.get('.el-input').type('{enter}');

  cy.get('.el-input input').should('have.value', baseOptions[1].label);
});

it('clearable work', () => {
  cy.mount(SelectBase, {
    props: {
      propsParams: {
        clearable: true,
      },
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  cy.get('.el-input input').realHover();
  cy.get('.el-select__icon:visible').realClick();

  cy.get('.el-input input').should('have.value', '');
});

it('filterable work', () => {
  cy.mount(SelectBase, {
    props: {
      propsParams: {
        filterable: true,
      },
      options: baseOptions,
    },
  });

  cy.get('.el-input input').click().type(baseOptions[0].label);
  cy.get('.el-select-dropdown:visible .el-select-dropdown__item:visible').should('have.length', 1);
  cy.get('.el-select-dropdown:visible .el-select-dropdown__item').contains(baseOptions[0].label).should('be.visible');
});

it('filterable with custom filter-method', () => {
  cy.mount(RemoteFilterSelect, {
    props: {
      options: baseOptions,
    },
  });

  const query = 'Alabama';
  cy.get('.el-input input').click().type(query);
  cy.get('.el-select-dropdown:visible .el-select-dropdown__item:visible').should('have.length', 1);
  cy.get('.el-select-dropdown:visible .el-select-dropdown__item').contains(query).should('be.visible');
});

it('event work', () => {
  cy.mount(EventSelect, {
    props: {
      options: baseOptions,
    },
  });

  selectModal.openPopover();
  selectModal.pickSelectOption({ text: baseOptions[0].label });

  cy.get('.el-input').click();
  cy.get('.el-select__icon:visible').click();

  cy.get('.pw-change').should('have.text', 'true');
  cy.get('.pw-visible-change').should('have.text', 'true');
  cy.get('.pw-clear').should('have.text', 'true');
});

it('slot work', () => {
  cy.mount(ElButton, {
    slots: {
      default: () => <span>click me</span>,
    },
  });

  cy.get('button').should('have.text', 'click me');
});

it('slot work jsx', () => {
  cy.mount(() => <ElButton>click me</ElButton>);

  cy.get('button').should('have.text', 'click me');
});

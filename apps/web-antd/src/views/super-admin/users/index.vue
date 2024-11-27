<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { UsersApi } from '#/api/super-admin/users';

import { useVbenModal } from '@vben/common-ui';

import { Avatar, Button, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createUserApi,
  deleteUserApi,
  geUserListApi,
  updateUserApi,
} from '#/api/super-admin/users';

interface RowType {
  id: number;
  createdAt: string;
  nickName: string;
  username: string;
  email: string;
  phone: string;
  status: number;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'avatar', title: '头像', slots: { default: 'avatar' } },
    { field: 'id', title: 'id', width: 50 },
    { field: 'createdAt', title: '注册时间' },
    { field: 'nickName', title: '昵称' },
    { field: 'username', title: '用户名' },
    { field: 'email', title: '邮箱' },
    { field: 'phone', title: '手机号' },
    { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'action', title: '操作', slots: { default: 'action' } },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await geUserListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  data: [],
  // height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  stripe: true,
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

async function onCreateSubmit(values: Record<string, any>) {
  const createParams: UsersApi.CreateUserParams = {
    ...values,
    username: values.username,
    password: values.password,
  };
  await createUserApi(createParams);
}
const [CreateForm, createFormApi] = useVbenForm({
  handleSubmit: onCreateSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'username',
      label: '用户名',
      rules: 'required',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'password',
      label: '密码',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '正常', value: 0 },
          { label: '禁用', value: 1 },
        ],
        placeholder: '请输入',
      },
      fieldName: 'status',
      label: '状态',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'nickName',
      label: '昵称',
    },
  ],
  showDefaultActions: false,
});
const [CreateModal, createModalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    createModalApi.close();
  },
  onConfirm: async () => {
    await createFormApi.validateAndSubmitForm();
    createModalApi.close();
    gridApi.query();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = createModalApi.getData<Record<string, any>>();
      if (values) {
        createFormApi.setValues(values);
      }
    }
  },
  title: '新增用户',
});

// 修改用户
const [UpdateForm, updateFormApi] = useVbenForm({
  handleSubmit: onUpdateSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'id',
      label: 'id',
      rules: 'required',
      dependencies: {
        show() {
          return false;
        },
        triggerFields: ['id'],
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'username',
      label: '用户名',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '正常', value: 0 },
          { label: '禁用', value: 1 },
        ],
        placeholder: '请输入',
      },
      fieldName: 'status',
      label: '状态',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'nickName',
      label: '昵称',
    },
  ],
  showDefaultActions: false,
});
const [UpdateModal, updateModalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    updateModalApi.close();
  },
  onConfirm: async () => {
    await updateFormApi.validateAndSubmitForm();
    updateModalApi.close();
    gridApi.query();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = updateModalApi.getData<Record<string, any>>();
      if (values) {
        updateFormApi.setValues(values);
      }
    }
  },
  title: '修改用户',
});

async function onUpdateSubmit(values: Record<string, any>) {
  const updateParams: UsersApi.UpdateUserParams = {
    id: values.id,
    ...values,
  };
  await updateUserApi(updateParams);
}

const handleAdd = () => {
  createModalApi.open();
};
const handleUpdate = (row: RowType) => {
  updateFormApi.setValues(row);
  updateModalApi.open();
};
const [DeleteModal, deleteModalApi] = useVbenModal({
  title: '删除用户',
  onConfirm: async () => {
    const deleteParams: UsersApi.DeleteUserParams = {
      id: deleteModalApi.getData().id,
    };
    await deleteUserApi(deleteParams);
    gridApi.query();
    deleteModalApi.close();
  },
});
const handleDelete = async (row: RowType) => {
  deleteModalApi.setData(row);
  deleteModalApi.open();
};
</script>

<template>
  <div class="p-5">
    <div class="w-full">
      <Grid>
        <template #toolbar-actions>
          <Button type="primary" @click="handleAdd">新增</Button>
        </template>
        <template #avatar="{ row }">
          <Avatar :src="row.avatar" />
        </template>
        <template #status="{ row }">
          <Tag :color="row.status === 0 ? 'green' : 'red'">
            {{ row.status === 0 ? '正常' : '禁用' }}
          </Tag>
        </template>
        <template #action="{ row }">
          <Button type="link" @click="handleUpdate(row)">编辑</Button>
          <Button type="link" @click="handleDelete(row)">删除</Button>
        </template>
      </Grid>
    </div>
    <CreateModal>
      <CreateForm />
    </CreateModal>
    <UpdateModal>
      <UpdateForm />
    </UpdateModal>
    <DeleteModal>
      <div>
        <span>你确定要删除用户</span>
        <span class="ml-1 mr-1 font-bold text-red-500">{{
          deleteModalApi.getData().username
        }}</span>
        <span>吗？</span>
      </div>
    </DeleteModal>
  </div>
</template>

<script lang="ts" setup>
  import VAnswerActions from '@/components/VAnswerActions.vue';
  import VTextEditor from '@/components/VTextEditor.vue';
  import VButton from '@/components/VButton.vue';
  import useHomework from '@/stores/homework';
  import { ref, onMounted, computed } from 'vue';
  import VAnswer from '@/components/VAnswer.vue';
  import VCard from '@/components/VCard.vue';
  import type { Answer } from '@/types/homework';

  export interface Props {
    answer: Answer;
    questionId: string;
    parentId?: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'update'): void;
    (e: 'delete'): void;
    (e: 'edit'): void;
    (e: 'mounted', slug: string): void;
  }>();

  const homework = useHomework();

  const editMode = ref(false);
  const text = ref('');
  const editTime = ref(30);
  const deleteTime = ref(10);

  const isDisabled = computed(() => !(text.value.length > 0));

  const updateAnswer = async () => {
    if (isDisabled.value) return;
    await homework.updateAnswer(props.answer.slug, text.value);
    emit('update');
    editMode.value = false;
  };

  const handleDelete = async () => {
    if (confirm('Удалить ответ?')) {
      await homework.deleteAnswer(props.answer.slug);
      emit('update');
    }
  };

  const handleEdit = async () => {
    text.value = props.answer.text;
    editMode.value = true;
  };

  onMounted(() => {
    emit('mounted', props.answer.slug);
  });
</script>

<template>
  <div v-if="!editMode">
    <VAnswer :answer="answer as Answer">
      <template #header>
        <VAnswerActions
          :created="answer.created"
          :edit-time="editTime"
          :delete-time="deleteTime"
          @edit="handleEdit"
          @delete="handleDelete" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </VAnswer>
  </div>
  <VCard v-else class="px-0 pt-0 tablet:px-0">
    <VTextEditor
      v-model="text"
      @send="updateAnswer"
      class="mb-16 rounded-t border-b border-offwhite" />
    <div class="flex flex-row-reverse px-32">
      <VButton @click="updateAnswer" :disabled="isDisabled" class="h-32"
        >Сохранить</VButton
      >
    </div>
  </VCard>
</template>

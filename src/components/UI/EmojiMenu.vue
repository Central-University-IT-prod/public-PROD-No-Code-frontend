<script setup>
import { onClickOutside } from '@vueuse/core'
import { ref } from "vue";

const Emoji = [
  '⚡️',
  '🔥',
  '🤯',
  '👍',
  '❤️',
  '🥰',
  '👏',
  '😁',
  '🎉',
  '🤩',
  '🙏',
  '👌',
  '🕊',
  '😍',
  '❤‍🔥',
  '💯',
  '🤣',
  '🏆',
  '🍌',
  '🍓',
  '🍾',
  '💋',
  '😇',
  '🤝',
  '🤗',
  '🫡',
  '🎄',
  '☃️',
  '💅',
  '💘',
  '😘',
  '💊',
  '😎',
  '🤪',
  '🗿',
  '🆒',
  '🙉',
  '🦄',
  '👾',
  '😂',
  '👎',
  '🤬',
  '🤮',
  '💩',
  '💔',
  '😨',
  '😴',
  '😈',
  '🖕',
  '😡',
  '🤡',
  '🤔',
  '😱',
  '🤨',
  '😐',
  '🌚',
  '🌭',
  '🤨',
  '👀',
  '🙈',
  '🤓',
  '👻',
  '👨‍💻',
  '🎃',
  '🤷‍♂',
  '🤷',
  '🤷‍♀',
  '🥱',
  '🥴',
  '🐳',
  '🤨'
];

const emoji_menu = ref(null);

const emit = defineEmits(['addSmile', 'closeMenu'])

const addSmile = (smile) => {
  emit('addSmile', smile);
}

const closeMenu = () => {
  emit('closeMenu');
}

onClickOutside(emoji_menu, () => {
  closeMenu();
})
</script>

<template>
  <div ref="emoji_menu" class="w-56 h-60 flex flex-wrap text-xl bg-white border overflow-y-auto z-20 p-2">
    <button @click="addSmile(emoji)" class="p-1" v-for="emoji of Emoji" :key="emoji">
      {{ emoji }}
    </button>
  </div>
</template>
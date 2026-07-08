<script setup lang="ts">
defineProps<{
  /** Banner heading, defaults to a work-in-progress notice */
  title?: string
  /** Emoji or short text shown instead of the default construction icon */
  icon?: string
}>()
</script>

<template>
  <div class="announcement-banner">
    <span class="announcement-banner-icon">
      <slot name="icon">
        <span v-if="icon" class="announcement-banner-emoji">{{ icon }}</span>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="6" width="20" height="8" rx="1" />
          <path d="M17 14v7" />
          <path d="M7 14v7" />
          <path d="M17 3v3" />
          <path d="M7 3v3" />
          <path d="M10 14 2.3 6.3" />
          <path d="m14 6 7.7 7.7" />
          <path d="m8 6 8 8" />
        </svg>
      </slot>
    </span>
    <div class="announcement-banner-body">
      <p class="announcement-banner-title">{{ title ?? 'Work in progress' }}</p>
      <p v-if="$slots.default" class="announcement-banner-text">
        <slot />
      </p>
    </div>
  </div>
</template>

<style scoped>
.announcement-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 16px 0;
  padding: 16px 20px;
  border: 2px dashed var(--vp-c-warning-2);
  border-radius: 12px;
  background-color: var(--vp-c-warning-soft);
}

.announcement-banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  color: var(--vp-c-warning-1);
}

/* svg or img passed through the icon slot */
.announcement-banner-icon :deep(svg),
.announcement-banner-icon :deep(img) {
  width: 100%;
  height: 100%;
}

.announcement-banner-emoji {
  font-size: 20px;
  line-height: 1;
}

.announcement-banner-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.announcement-banner-title {
  margin: 0;
  font-weight: 700;
  line-height: 24px;
  color: var(--vp-c-warning-1);
}

.announcement-banner-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}
</style>

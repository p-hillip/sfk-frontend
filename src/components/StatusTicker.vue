<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'SERVICE DISRUPTION'
  },
  baseSpeed: {
    type: Number,
    default: 118
  },
  variant: {
    type: String,
    default: 'warning'
  }
})

const tickerItems = computed(() => Array(10).fill(props.text))
</script>

<template>
  <div class="ticker-wrapper" :class="`ticker-${variant}`">
    <div class="ticker-track" :style="{ '--ticker-base': `${baseSpeed}s` }">
      <div class="ticker-group">
        <template v-for="(item, index) in tickerItems" :key="index">
          <span class="ticker-item">
            <span class="ticker-text">{{ item }}</span>

            <svg v-if="variant === 'warning'" class="ticker-icon" viewBox="0 0 100 90" aria-hidden="true">
              <polygon class="ticker-triangle" points="50,4 96,86 4,86" />
              <text x="50" y="60" class="ticker-exclamation">!</text>
            </svg>
            <svg v-else-if="variant === 'alert'" class="ticker-icon" viewBox="0 0 100 90" aria-hidden="true">
              <circle class="ticker-alert-circle" cx="50" cy="45" r="38" />
              <text x="50" y="60" class="ticker-alert-text">!</text>
            </svg>
            <svg v-else class="ticker-icon" viewBox="0 0 100 90" aria-hidden="true">
              <circle class="ticker-info-circle" cx="50" cy="45" r="38" />
              <text x="50" y="54" class="ticker-info-text">i</text>
            </svg>
          </span>
        </template>
      </div>

      <div class="ticker-group" aria-hidden="true">
        <template v-for="(item, index) in tickerItems" :key="'dup-' + index">
          <span class="ticker-item">
            <span class="ticker-text">{{ item }}</span>
            <svg v-if="variant === 'warning'" class="ticker-icon" viewBox="0 0 100 90" aria-hidden="true">
              <polygon class="ticker-triangle" points="50,4 96,86 4,86" />
              <text x="50" y="60" class="ticker-exclamation">!</text>
            </svg>
            <svg v-else-if="variant === 'alert'" class="ticker-icon" viewBox="0 0 100 90" aria-hidden="true">
              <circle class="ticker-alert-circle" cx="50" cy="45" r="38" />
              <text x="50" y="60" class="ticker-alert-text">!</text>
            </svg>
            <svg v-else class="ticker-icon" viewBox="0 0 100 90" aria-hidden="true">
              <circle class="ticker-info-circle" cx="50" cy="45" r="38" />
              <text x="50" y="54" class="ticker-info-text">i</text>
            </svg>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker-wrapper {
  --ticker-accent: #FFC107;
  --ticker-text: rgba(255, 254, 206, 0.94);

  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: repeating-linear-gradient(
      45deg,
      var(--ticker-accent),
      var(--ticker-accent) 40px,
      #000 40px,
      #000 80px
  );
  padding: 1rem 0;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.ticker-track {
  --ticker-base: 118s;
  --ticker-speed: var(--ticker-base);

  display: flex;
  width: max-content;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  animation: ticker-scroll var(--ticker-speed) linear infinite;
}

.ticker-group {
  display: flex;
  flex-shrink: 0;
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  padding-right: 2rem;
  flex-shrink: 0;
}

.ticker-text {
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 900;
  color: var(--ticker-text);
  letter-spacing: 0.1em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  white-space: nowrap;
}

.ticker-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: block;
}

.ticker-triangle {
  fill: var(--ticker-text);
}

.ticker-exclamation {
  fill: #000;
  font-size: 52px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
}

.ticker-alert-circle {
  fill: #d32f2f;
  stroke: #000;
  stroke-width: 3;
}

.ticker-alert-text {
  fill: #fff;
  font-size: 52px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
}

.ticker-info-circle {
  fill: #1976d2;
  stroke: #000;
  stroke-width: 3;
}

.ticker-info-text {
  fill: #fff;
  font-size: 46px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
}

.ticker-wrapper.ticker-warning {
  --ticker-accent: #FFC107;
  --ticker-text: rgba(255, 254, 206, 0.94);
}

.ticker-wrapper.ticker-alert {
  --ticker-accent: #d32f2f;
  --ticker-text: rgba(255, 224, 224, 0.95);
}

.ticker-wrapper.ticker-info {
  --ticker-accent: #1976d2;
  --ticker-text: rgba(225, 240, 255, 0.95);
}

@keyframes ticker-scroll {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track {
    animation: ticker-scroll 60s linear infinite;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .ticker-track {
    --ticker-speed: calc(var(--ticker-base) - 6s);
  }
}

@media (max-width: 640px) {
  .ticker-wrapper {
    padding: 0.75rem 0;
  }

  .ticker-track {
    --ticker-speed: calc(var(--ticker-base) - 12s);
  }

  .ticker-item {
    gap: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
<script setup>
import StatusTicker from './StatusTicker.vue'

defineProps({
  title: {
    type: String,
    default: 'OUTAGE NOTICE'
  },
  subtitle: {
    type: String,
    default: ''
  },
  messages: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'warning' // warning | alert | info
  },
  showBanner: {
    type: Boolean,
    default: false
  },
  bannerText: {
    type: String,
    default: 'SERVICE ALERT'
  },
  spacing: {
    type: String,
    default: 'normal' // tight | normal | loose
  }
})
</script>

<template>
  <div class="status-bulletin">
    <div class="bulletin-content">
      <div class="bulletin-icon">
        <svg
            v-if="variant === 'warning'"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <polygon points="50,10 90,80 10,80" fill="#FFC107" stroke="#000" stroke-width="3" />
          <text x="50" y="70" font-size="50" font-weight="bold" text-anchor="middle" fill="#000">!</text>
        </svg>

        <svg
            v-else-if="variant === 'alert'"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <circle cx="50" cy="50" r="38" fill="#d32f2f" stroke="#000" stroke-width="3" />
          <text x="50" y="68" font-size="50" font-weight="bold" text-anchor="middle" fill="#fff">!</text>
        </svg>

        <svg
            v-else
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <circle cx="50" cy="50" r="38" fill="#1976d2" stroke="#000" stroke-width="3" />
          <text x="50" y="68" font-size="46" font-weight="bold" text-anchor="middle" fill="#fff">i</text>
        </svg>
      </div>

      <h1 class="headline">{{ title }}</h1>

      <p v-if="subtitle" class="subtitle">
        {{ subtitle }}
      </p>

      <div class="message-box" :class="[spacing, `message-${variant}`]">
        <template v-for="(message, index) in messages" :key="index">
          <p class="message-line">
            {{ message }}
          </p>
        </template>
      </div>
    </div>
    <StatusTicker v-if="showBanner" :text="bannerText" :variant="variant" />
  </div>
</template>

<style scoped>
.status-bulletin {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem 5.5rem;
  box-sizing: border-box;
  /* V1 - STATIC / NO LOGIC FOR SHORT DEVICES  # padding-top: 14vh; */
  /* V2 - IMPROVEMENT OF V1, MIX OF ORIGINAL   # padding: 14vh 1.5rem 5.5rem; */
  /* V3 - DOES NOT WORK, ALWAYS USES 14vh      # padding: max(0.5rem, 14vh) 1.5rem 5.5rem; */
  /* ORIGINAL - DEAD CENTER                    # padding: 0.5rem 1.5rem 5.5rem; */
}

/**
 * lets layout distribute remaining vertical space above and below content
 * if no content in the way extra verical space gets split into top and bottom spacer
 * adjust bottom spacer size to be larger = push content up custom amount
 * if content fills up the page top spacer collapses to minimum
 */
.status-bulletin::before,
.status-bulletin::after {
  content: '';
  display: block;
  flex-basis: 0;
  flex-shrink: 1;
}

/* top spacer 35% # to make content go up, change to 30% and bottom spacer to 70% */
.status-bulletin::before {
  flex-grow: 35;
  min-height: 0.5rem;
}

/* bottom spacer 65% # to make content go down, change to 60 and change status-bulletin::before flex-grow to 40 */
.status-bulletin::after {
  flex-grow: 65;
}

.bulletin-content {
  width: 100%;
  max-width: 900px;
  text-align: center;
  align-self: center;
}

.bulletin-icon {
  width: clamp(90px, 13vw, 140px);
  height: clamp(90px, 13vw, 140px);
  margin: 0.4rem auto 0.25rem;
  animation: pulse 2s ease-in-out infinite;
}

.bulletin-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.headline {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  line-height: 1;
  text-transform: uppercase;
  color: #000;
  margin: 0 0 0.5rem;
}

.subtitle {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  /* font-size: clamp(2.15rem, 3.25vw, 2.5rem); # too aggressive on 676x568 */
  font-weight: 600;
  color: #333;
  margin: 0 0 0.95rem;
}

/* max-width: clamp(480px, 80vw, 960px); # CORRECTED VERSION >> clamp(min, preferred, max) */
/* max-width: clamp(480px, 960px, 80vw); # ORIGINAL / WRONG */
.message-box {
  --msg-bg: rgba(253, 191, 7, 0.02);
  --msg-border: rgba(0, 0, 0, 0.22);

  border: 1px solid var(--msg-border); /* border: 1px solid rgba(0, 0, 0, 0.22); /* border: 1px solid rgba(0, 0, 0, 0.32); */
  padding: 1.25rem 1.75rem; /* # shortened (top-bottom, left-right) # padding: 1.25rem 1.75rem 1.25rem; # (top, left-right, bottom)  */
  text-align: left;
  /*max-width: clamp(480px, 960px, 80vw);*/
  max-width: clamp(480px, 80vw, 960px);
  margin: 0 auto;
  border-radius: 0.35rem;
  background-color: var(--msg-bg); /* background-color: rgba(253, 191, 7, 0.02); */
  /*
             MY COLOR: background-color: rgba(253, 191, 7, 0.04);
    MY COLOR (slightly less aggressive): background-color: rgba(253, 191, 7, 0.02);
        GREY CONTRAST: background-color: rgba(0, 0, 0, 0.03);
  */
}

/* WARNING (default yellow) */
.message-box.message-warning {
  --msg-bg: rgba(253, 191, 7, 0.02);
  --msg-border: rgba(0, 0, 0, 0.22);
}

/* ALERT (red) */
.message-box.message-alert {
  --msg-bg: rgba(211, 47, 47, 0.01);
  --msg-border: rgba(211, 47, 47, 0.35);
}

/* INFO (blue) */
.message-box.message-info {
  --msg-bg: rgba(25, 118, 210, 0.01);
  --msg-border: rgba(25, 118, 210, 0.35);
}

.message-line {
  font-size: clamp(1.25rem, 2.7vw, 1.75rem);
  line-height: 1.7;
  color: #4a4a4a;
  margin: 0;
}

.message-box.message-alert .message-line {
  color: rgb(11, 9, 9);
}

.message-box.message-info .message-line {
  color: rgba(8, 16, 35, 0.72); /* color: rgba(25, 60, 120, 0.9); */
}

.message-line + .message-line {
  margin-top: 1rem;
}

.message-box.tight .message-line + .message-line {
  margin-top: 0.45rem;
}

.message-box.loose .message-line + .message-line {
  margin-top: 1.75rem;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bulletin-icon {
    animation: none;
  }
}

@media (max-width: 640px) {
  /*.status-bulletin {
    //padding: 0.75rem 1.25rem 4rem;
    padding: 8vh 1.25rem 4rem;
  }*/

  .status-bulletin {
    padding: 0 1.25rem 4rem;
  }

  .status-bulletin::before {
    min-height: 0.5rem;
    flex-grow: 25;
  }

  .status-bulletin::after {
    flex-grow: 75;
  }

  .bulletin-icon {
    width: clamp(60px, 18vw, 90px);
    height: clamp(60px, 18vw, 90px);
    margin-bottom: 0.05rem;
  }

  .headline {
    font-size: clamp(1.5rem, 8vw, 2.75rem);
    margin: 0 0 0.5rem;
  }

  .subtitle {
    font-size: clamp(1.15rem, 6vw, 1.75rem);
    margin-bottom: 0.75rem;
  }

  .message-box {
    padding: 0.75rem 1.15rem 0.75rem;
  }

  .message-line {
    font-size: 1rem;
    line-height: 1.6;
  }
}
</style>
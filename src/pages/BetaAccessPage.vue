<script setup>
import StatusBulletin from '../components/StatusBulletin.vue'

const bulletinMessages = [
    'Access to this system is currently invite-only, we will post an update once the public beta is available.',
    'If you signed up for the closed beta, check your email for an invitation with instructions on how to access the platform.',
]
</script>

<template>
  <StatusBulletin
      title="SYSTEM MESSAGE"
      subtitle="Closed Beta in Progress"
      :messages="bulletinMessages"
      variant="warning"
      :show-banner="true"
      banner-text="RESTRICTED ACCESS"
      spacing="loose"
  />
</template>
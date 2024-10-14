<template>
    <div class="flex flex-col">
        <Header class="w-full p-6 sticky top-0" />
        <div class="flex flex-1">
            <TrainingsplanList :trainingPlans="trainingPlans" />
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue';
import TrainingsplanList from '../components/TrainingsplanList.vue';

export default {
    name: 'Trainingplans',
    components: {
        Header,
        TrainingsplanList,
    },
    data() {
        return {
            trainingPlans: [], // Array für die Trainingspläne
        };
    },
    async created() {
        await this.fetchTrainingPlans(); // Trainingspläne abrufen, wenn die Komponente erstellt wird
    },
    methods: {
        async fetchTrainingPlans() {
            try {
                const response = await fetch('http://localhost:5500/api/trainingplans'); // API-Endpoint für Trainingspläne
                this.trainingPlans = await response.json();
            } catch (error) {
                console.error('Fehler beim Abrufen der Trainingspläne:', error);
            }
        },
    },
};
</script>

<style scoped>
/* Custom Styles */
</style>

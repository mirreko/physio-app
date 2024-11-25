<template>
    <div class="bg-white rounded-2xl flex items-center justify-center h-full shadow-md">
        <div class="relative flex justify-center items-center w-24 h-24">
            <svg class="-rotate-90" width="100" height="100">
                <circle 
                    class="fill-transparent stroke-gray-300" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke-width="6" 
                />
                <circle 
                    class="progress-ring__circle stroke-primary" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke-width="6" 
                    :style="{ strokeDashoffset: strokeDashoffset }" 
                />
            </svg>
            <div class="absolute flex flex-col items-center justify-center">
                <div class="text-xs">Woche</div>
                <div class="text-3xl font-bold -mt-1 -mb-1">{{ currentWeek }}</div>
                <div class="text-xs">von {{ totalWeeks }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProgressBar",
    props: {
        totalWeeks: {
            type: Number,
            required: true,
        },
        currentWeek: {
            type: Number,
            required: true,
        },
    },
    computed: {
        strokeDashoffset() {
            const percentage = (this.currentWeek / this.totalWeeks) * 100;
            const circumference = 2 * Math.PI * 40; 
            return circumference - (percentage / 100 * circumference);
        },
    },
    mounted() {
        this.$nextTick(() => {
            const progressCircle = this.$el.querySelector('.progress-ring__circle');
            progressCircle.style.strokeDashoffset = this.strokeDashoffset;
        });
    },
};
</script>

<style scoped>
.progress-ring__circle {
    fill: transparent;
    stroke-dasharray: 251.33; 
    stroke-dashoffset: 0; 
    stroke-linecap: round;
    transition: stroke-dashoffset 0.35s ease;
}
</style>

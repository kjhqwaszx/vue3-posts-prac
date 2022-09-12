import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
	state: () => ({
		alerts: [],
	}),
	actions: {
		vAlert(message, type) {
			this.alerts.push({ message, type });
			setTimeout(() => {
				this.alerts.shift();
			}, 2000);
		},
		vSuccess(message) {
			this.vAlert(message, 'success');
		},
	},
});

import { useAlertStore } from '@/store/alert';
import { storeToRefs } from 'pinia';

export function useAlert() {
	// 구조분해 할당을 통해 스토어 값을 가져온다.
	// state, getters는 storeToRefs를 하지 않으면 reactive를 잃는다.
	const { alerts } = storeToRefs(useAlertStore());
	//action(메서드)는 바로 구조분해 하여 사용할 수 있다.
	const { vAlert, vSuccess } = useAlertStore();

	return {
		alerts,
		vAlert,
		vSuccess,
	};
}

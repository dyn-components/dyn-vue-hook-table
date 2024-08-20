import type { ComputedRef, Ref, VNodeRef } from 'vue'
import { ref, reactive, computed } from 'vue'

interface TableState extends Record<string, any> {
	records: any[],
	loading: boolean,
	query: Record<string, any>,
	pagination: Record<string, any>,
	successFetchCount: number,
	onFetch: (query: Record<string, any>) => Promise<void>,
	onRefresh: () => Promise<void>,
	onReset: () => Promise<void>,
	tableRef: ComputedRef<VNodeRef | null>,
	setTableRef: (tableRef: VNodeRef | null) => void
}

function DynHook(defaults: Pick<TableState, 'onFetch'> & Partial<TableState>) {
	const defaultPagination = {
		current: 1,
		pageSize: 10,
		total: 0
	};

	const dynTableRef: Ref<VNodeRef | null> = ref(null)
	const dynHookState = reactive<TableState>({
		records: [],
		loading: false,
		query: {},
		pagination: {
			...defaultPagination,
		},
		successFetchCount: 0,
		onRefresh: async () => {
			await dynHookState.onFetch(dynHookState.query)
		},
		onReset: async (resetDefaults: Partial<TableState> = {}) => {
			Object.assign(dynHookState, {
				records: [],
				loading: false,
				query: {},
				pagination: {
					...defaultPagination
				},
				...defaults,
				...resetDefaults
			})
			await dynHookState.onFetch(dynHookState.query)
		},
		tableRef: computed(() => dynTableRef.value),
		setTableRef: (tableRef: VNodeRef | null) => {
			dynTableRef.value = tableRef
		},
		...defaults,
		onFetch: async (query: Record<string, any>) => {
			dynHookState.loading = true
			try {
				await defaults.onFetch(query)
				dynHookState.successFetchCount += 1
			} finally {
				dynHookState.loading = false
			}
		}
	});

	return dynHookState
}

export default DynHook
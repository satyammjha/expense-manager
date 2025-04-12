import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore } from '@/store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: typeof useSelector = useSelector
export const useAppStore: () => AppStore = useStore

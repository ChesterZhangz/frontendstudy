import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'confirm';
  autoClose?: number;
  showProgress?: boolean;
}

interface ModalActions {
  showModal: (config: Omit<ModalState, 'isOpen'>) => void;
  hideModal: () => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (message: string, title?: string) => void;
}

const useModalStore = create<ModalState & ModalActions>((set) => ({
  // 初始状态
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  autoClose: 3000,
  showProgress: true,

  // 显示模态框
  showModal: (config) => set({
    isOpen: true,
    title: config.title,
    message: config.message,
    type: config.type,
    autoClose: config.autoClose || 3000,
    showProgress: config.showProgress !== false,
  }),

  // 隐藏模态框
  hideModal: () => set({ isOpen: false }),

  // 快捷方法
  showSuccess: (message, title = '成功') => set({
    isOpen: true,
    title,
    message,
    type: 'success',
    autoClose: 3000,
    showProgress: true,
  }),

  showError: (message, title = '错误') => set({
    isOpen: true,
    title,
    message,
    type: 'error',
    autoClose: 5000,
    showProgress: true,
  }),

  showWarning: (message, title = '警告') => set({
    isOpen: true,
    title,
    message,
    type: 'warning',
    autoClose: 4000,
    showProgress: true,
  }),

  showInfo: (message, title = '提示') => set({
    isOpen: true,
    title,
    message,
    type: 'info',
    autoClose: 3000,
    showProgress: true,
  }),

  showConfirm: (message, title = '确认') => set({
    isOpen: true,
    title,
    message,
    type: 'confirm',
    autoClose: 0, // 确认类型不自动关闭
    showProgress: false,
  }),
}));

export default useModalStore;

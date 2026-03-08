import './App.css'
import { MallaPage } from './pages/MallaPage';

import { NotificationProvider } from './contexts/NotificationContext';
import { CustomNotification } from './components/CustomNotification/CustomNotification';

import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast/ToastContainer';

function App() {

  return (
    <ToastProvider>
      <NotificationProvider>
        <MallaPage />
        <CustomNotification />
        <ToastContainer />
      </NotificationProvider>
    </ToastProvider>
  )
}

export default App

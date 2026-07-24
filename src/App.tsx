import './App.css'
import { MallaPage } from './pages/MallaPage';

import { NotificationProvider } from './contexts/NotificationContext';
import { CustomNotification } from './components/ui/CustomNotification';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { PlanProvider } from './contexts/PlanContext';

function App() {

  return (
    <ToastProvider>
      <NotificationProvider>
        <PlanProvider>
          <MallaPage />
          <CustomNotification />
          <ToastContainer />
        </PlanProvider>
      </NotificationProvider>
    </ToastProvider>
  )
}

export default App

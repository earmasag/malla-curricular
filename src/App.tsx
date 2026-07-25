import './App.css'
import { MallaPage } from './pages/MallaPage';

import { NotificationProvider } from './contexts/NotificationContext';
import { CustomNotification } from './components/ui/CustomNotification';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { PlanProvider } from './contexts/PlanContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {

  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <PlanProvider>
            <MallaPage />
            <CustomNotification />
            <ToastContainer />
          </PlanProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

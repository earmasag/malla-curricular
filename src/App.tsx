import { MallaPage } from './pages/MallaPage';

import { NotificationProvider } from './contexts/NotificationContext';
import { CustomNotification } from './components/ui/CustomNotification';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { PlanProvider } from './contexts/PlanContext';
import { ThemeProvider } from './contexts/ThemeContext';

import { CarreraProvider } from './contexts/CarreraContext';

function App() {

  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <CarreraProvider>
            <PlanProvider>
              <MallaPage />
              <CustomNotification />
              <ToastContainer />
            </PlanProvider>
          </CarreraProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

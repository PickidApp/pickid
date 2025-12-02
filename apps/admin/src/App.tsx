import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRoutes } from './config/routes';
import { AdminAuthProvider } from './providers/AdminAuthProvider';

export default function App() {
	return (
		<>
			<Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
				<AdminAuthProvider>
					<AppRoutes />
				</AdminAuthProvider>
			</Router>
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}

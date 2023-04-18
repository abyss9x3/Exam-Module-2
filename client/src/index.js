import React from "react";
import * as ReactDOMClient from 'react-dom/client';

import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserState from './store/user/UserState';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<UserState>
				<App />
			</UserState>
		</BrowserRouter>
	</React.StrictMode>,
);

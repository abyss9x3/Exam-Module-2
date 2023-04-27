import React, { StrictMode } from "react";
import * as ReactDOMClient from 'react-dom/client';

import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserState from './store/user/UserState';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(
	// <StrictMode>
	<BrowserRouter>
		<UserState>
			<App />
		</UserState>
	</BrowserRouter>
	// </StrictMode>
);

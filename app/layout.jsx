"use client";
import 'react-perfect-scrollbar/dist/css/styles.css';
import '@/public/sass/layout/tailwind.css';
import '@/public/sass/main.scss';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import DefaultLayout from '@/app/component/default';
import config from '@/public/script/store';

export default function Layout ({ children }) {

    const store = configureStore({ reducer: combineReducers({ config: config }) });

    return (
        <html>
            <head>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Dashboard</title>
                <link rel="icon" href="/media/public/favicon.png"/>
                <link rel="manifest" href="/script/manifest.json" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Provider store={store}>
                    <DefaultLayout>{children}</DefaultLayout>
                </Provider>
            </body>
        </html>
    );

}

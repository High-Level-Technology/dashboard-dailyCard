import { createSlice } from '@reduxjs/toolkit';
import { set_session } from '@/public/script/public';

const initialState = {
    dar: false,
    semidark: false,
    side: false,
    setting: false,
    lang: 'en',
    theme: 'dark',
    menu: 'horizontal',
    layout: 'boxed-layout',
    dir: 'ltr',
    animation: 'animate__fadeInDown',
    nav: 'navbar-sticky',
    user: {},
    text: {},
    langs_list: [
        { code: 'en', name: 'English'},
        { code: 'ar', name: 'Arabic' },
        { code: 'fr', name: 'French' },
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
    ],
};

const themeConfigSlice = createSlice({

    name: 'auth', initialState: initialState,

    reducers: {

        toggle_theme(state, { payload }) {
            payload = payload || state.theme;
            localStorage.setItem('theme', payload);
            state.theme = payload;
            if (payload === 'light') state.dar = false;
            else if (payload === 'dark') state.dar = true;

            if (state.dar) document.querySelector('body')?.classList.add('dark');
            else document.querySelector('body')?.classList.remove('dark');
        },
        toggle_menu(state, { payload }) {
            payload = payload || state.menu;
            state.side = false;
            localStorage.setItem('menu', payload);
            state.menu = payload;
        },
        toggle_layout(state, { payload }) {
            payload = payload || state.layout;
            localStorage.setItem('layout', payload);
            state.layout = payload;
        },
        toggle_dir(state, { payload }) {
            payload = payload || state.dir;
            localStorage.setItem('dir', payload);
            state.dir = payload;
            document.querySelector('html')?.setAttribute('dir', state.dir || 'ltr');
        },
        toggle_animation(state, { payload }) {
            payload = payload || state.animation;
            payload = payload?.trim();
            localStorage.setItem('animation', payload);
            state.animation = payload;
        },
        toggle_nav(state, { payload }) {
            payload = payload || state.nav;
            localStorage.setItem('nav', payload);
            state.nav = payload;
        },
        toggle_semidark(state, { payload }) {
            payload = payload === true || payload === 'true' ? true : false;
            localStorage.setItem('semidark', payload);
            state.semidark = payload;
        },
        toggle_lang(state, { payload }) {
            payload = payload || state.lang;
            localStorage.setItem('lang', payload);
            state.lang = payload;
        },
        toggle_side(state) {
            state.side = !state.side;
        },
        toggle_setting(state) {
            state.setting = !state.setting;
        },
        toggle_user(state, { payload }) {
            set_session('user', payload || {});
            state.user = payload || {};
        },
        toggle_text(state, { payload }) {
            state.text = payload || {};
        },
        
    }

});

export const {
    toggle_theme, toggle_menu, toggle_layout, toggle_dir,
    toggle_animation, toggle_nav, toggle_semidark, toggle_lang,
    toggle_side, toggle_setting, toggle_user, toggle_text
} = themeConfigSlice.actions;

export default themeConfigSlice.reducer;

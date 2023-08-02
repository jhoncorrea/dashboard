import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING, 
    LOGOUT,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
} from '../actions/auth/types'

//definimos el estado inicial
const initialState = {
    //obtenemos el access toked del localstorage
    access: localStorage.getItem('access'),
    //obtenemos el refresh del localstorage
    refresh: localStorage.getItem('refresh'),
    //variable para chequear si estamos autenticados
    isAuthenticated: null,
    //el usuario
    user: null,
    loading: false,
    user_loading: true,

}

export default function auth(state = initialState, action){
    //desestructuramos del objeto action el type y el payload
    const {type, payload} = action;

    //hacemos un switch para evaluar cuál se cumple
    switch(type) {
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload,
                user_loading: false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null,
                user_loading: false
            }
        //cuando esté cargando
        case SET_AUTH_LOADING:
            return {
                ...state,
                loading: true
            }
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                loading: false
            }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case AUTHENTICATED_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                isAuthenticated: false,
                access: null,
                refresh: null
            }
        //en caso de que LOGIN_SUCCESS se cumpla retornamos lo de abjo
       case LOGIN_SUCCESS:
        //res.data nos da el access y esto luego lo obtenemos de payload.access y lo seteamos
        localStorage.setItem('access', payload.access);
        localStorage.setItem('refresh', payload.refresh);
        //luego retornamos
        return {
            //siempre primero se retorna el stado previo
            ...state,
            isAuthenticated: true,
            access: localStorage.getItem('access'),
            refresh: localStorage.getItem('refresh')
        }
        //NO pasa nada cuando esto ocurra asi que devolvemos el estado previo
        case RESET_PASSWORD_SUCCESS:
        case RESET_PASSWORD_FAIL:
        case RESET_PASSWORD_CONFIRM_SUCCESS:
        case RESET_PASSWORD_CONFIRM_FAIL:
            return {
                ...state
            }
        case REFRESH_SUCCESS:
            localStorage.setItem('access', payload.access);
            return {
                ...state,
                access: localStorage.getItem('access')
            }
        //en caso de que el login falle, el refresh falle y presione logout
        case LOGIN_FAIL:
        case REFRESH_FAIL:
        case LOGOUT:
            //removemos el access y el refresh
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            //devolvemos todo nulo
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
       //esto siempre va al final 
       default:
         return state
    }
}
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
} from './types'

import axios from 'axios'

//funcion para la carga del user
export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {

        const config = {
            headers: {
                //el JWT viene de settings.py donde dijimos que el AUTH_HEADER_TYPES es JWT, el header pide el access token
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);

            if (res.status === 200) {
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: USER_LOADED_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

//estamos haciendo la función de login y le pasamos el email y password, recuerda que es asyncrono 
export const login=(email, password) => async dispatch => {
    
    //indicamos que estamos cargando
    dispatch({
        type: SET_AUTH_LOADING
    });

    //luego hacemos el envío de información
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //ahora le pasamos el body con la información del form
    //se debe convertir el objeto JS a una cadena de texto JSON que puede ser enviada por HTTP
    const body = JSON.stringify({
        email,
        password
    });

    //ahora hacemos el try catch
    try {
    //la respuesta "res" tiene la petición "post" hecha a la API
    //siempre se usa await para esperar la respuesta
    //importante, siempre va primero el body y luego el config
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);
    //si el estado es 200 quiere decir que fue exitoso
    if(res.status===200) {
        //indica que el tipo es LOGIBN_SUCCESS
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        //cargamos la función load_user() que es para cargar usuarios
        dispatch(load_user());
        //ADEMÁS REMOVE_AUTH_LOADING
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
    //si no fue correcto el login entonces falló
    }else {
        dispatch({
            type: LOGIN_FAIL,
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
    }    
    }catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
    }

}

//vamos a chequear que un usuario esté logueado
export const check_authenticated = () => async dispatch => {
    //sabemos que está autenticado si existe un token
    if(localStorage.getItem('access')){
        //Enviamos el objeto config con sus propiedades que son encabezados
        // Configuración de encabezados para una solicitud HTTP utilizando Axios.
        const config = {
            headers: {
            'Accept': 'application/json',       // Especifica que se espera recibir una respuesta en formato JSON.
            'Content-Type': 'application/json' // Especifica que se enviará contenido en el cuerpo de la solicitud en formato JSON.
            }
        };
        //body: Es una variable que almacenará la cadena de texto JSON. La variable se utiliza comúnmente para preparar datos para enviar en el cuerpo (body) de una solicitud HTTP.
        //convertimos a una cadena JSON usando JSON.stringify, esta cadena contiene un objeto con una propiedad llamada token que extrae su valor del localstorage
        const body = JSON.stringify({
            token: localStorage.getItem('access')
        });

        //ahora haremos el try catch
        try {
            //haremos la petición con axios y la respuesta la guardamos en una variable res, siempre se espera en una solicitud HTTP
            //se manda la ruta a la api, el body y la config 
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config);
            //si el status de la res es exitosa dará el número 200
            if(res.status===200){
                //despachamos
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            }else{
                //despachamos 
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }

        } catch (err) {
            //despachamos fail
            dispatch({
                type: AUTHENTICATED_FAIL
            })
        }


    //sino tiene el access token despachamos el type: AUTHENTICATED_FAIL
    }else{
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
}


//FUNCION PARA EL REFRESH
export const refresh = () => async dispatch => {
    if (localStorage.getItem('refresh')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            refresh: localStorage.getItem('refresh')
        });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`, body, config);

            if (res.status === 200) {
                dispatch({
                    type: REFRESH_SUCCESS,
                    //LE PASAMOS LOS DATOS QUE SERIA EL ACCESS TOKEN
                    payload: res.data
                });
            } else {
                dispatch({
                    type: REFRESH_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: REFRESH_FAIL
            });
        }
    } else {
        dispatch({
            type: REFRESH_FAIL
        });
    }
};


//cuando hagamos reset_password
export const reset_password = (email) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);

        if (res.status === 204) {
            dispatch({
                type: RESET_PASSWORD_SUCCESS
            });
            
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
        } else {
            dispatch({
                type: RESET_PASSWORD_FAIL
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            
        }
    } catch (err) {
        dispatch({
            type: RESET_PASSWORD_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        
    }
};


//funcion para la confirmación del reset_password_confirm
export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password
    });

    //si los password no son iguales fallaría
    if (new_password !== re_new_password) {
        dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        
    } else {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);

            if (res.status === 204) {
                dispatch({
                    type: RESET_PASSWORD_CONFIRM_SUCCESS
                });
                dispatch({
                    type: REMOVE_AUTH_LOADING
                });
                
            } else {
                dispatch({
                    type: RESET_PASSWORD_CONFIRM_FAIL
                });
                dispatch({
                    type: REMOVE_AUTH_LOADING
                });
            }
        } catch (err) {
            dispatch({
                type: RESET_PASSWORD_CONFIRM_FAIL
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
        }
    }
};


export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};

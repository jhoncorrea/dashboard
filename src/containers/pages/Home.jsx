import Layout from '../../hocs/layout/Layout'
import { connect } from 'react-redux'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import logo_boomslag from "../../assets/img/boomslag-black.png"
import { useEffect, useState } from 'react'
import { Link, Navigate } from "react-router-dom";
import { check_authenticated, load_user, login, refresh } from '../../redux/actions/auth/auth'

function Home({
  login,
  isAuthenticated,
  loading,
  refresh,
  check_authenticated,
  load_user,
}){

   //hacemos esto para guardar el estado de redux porque cuando recargábamos la página perdíamos la autenticación
   useEffect(()=>{
    isAuthenticated ? <></>:
    <>
    {refresh()}
    {check_authenticated()}
    {load_user()}
    </>
},[])


  //creo un estado llamado formData que es un objeto que almacena email y password
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  //desestructuro el objeto formData para extraer las propiedades de email y password.
  const {
    email,
    password
  } = formData;

  //creo una función onChange que actualizará el estado de cada propiedad del objeto formData en base a lo que le pasemos
  const onChange = e => setFormData({
    //copia todas las propiedades actuales del formData
     ...formData,
     // Actualiza la propiedad específica basada en el nombre del campo de entrada
     //e.target.name es el valor de la propiedad(email, password)
     //e.target.value es el valor que toma del formulario
     [e.target.name]: e.target.value
    });

  //creo el evento submit que es el evento del boton para el envio del formulario
  const onSubmit = e => {
    e.preventDefault();
    //llamamos a la funcion login y le damos el email y el password
    login(email, password);
  };

  //si estamos autenticados nos vamos al dashboard
  if(isAuthenticated) return <Navigate to='/dashboard'/>

  return (
    <>
     <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo_boomslag}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Inicia sesión para entrar a tu cuenta
            </h2>
            
          </div>
          <form onSubmit={e=>{onSubmit(e)}} className="mt-8 space-y-6" action="#" method="POST"> 
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e=>onChange(e)}                  
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}       
                  onChange={e=>onChange(e)}           
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              

              <div className="text-sm">
                <Link to="/forgot_password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
</>
  )
}

const mapStateToProps=state=>({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
})

export default connect(mapStateToProps, {
  login,
  refresh,
  check_authenticated,
  load_user
}) (Home)
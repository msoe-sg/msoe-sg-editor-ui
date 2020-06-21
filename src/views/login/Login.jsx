import React from 'react';
import Logo from '../../components/logo/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setAuthToken, setAuthError } from '../../api/state/actions';
import Alert from 'react-bootstrap/Alert';
import styles from './Login.module.scss';

export default function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const authError = useSelector(state => state.authError);

    function onLoginSuccess(response) {
        dispatch(setAuthToken(response.wc.id_token));
        dispatch(setAuthError(null));
        response.disconnect();
        history.push('/editors');
    }

    React.useEffect(() => {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: '139817711555-gre9cimukf1d3l3bfkd903ofbmdjrmd2.apps.googleusercontent.com'
            });

            window.gapi.load('signin2', function() {
                const opts = {
                    client_id: '139817711555-gre9cimukf1d3l3bfkd903ofbmdjrmd2.apps.googleusercontent.com',
                    onsuccess: onLoginSuccess,
                    onfailure: (error) => console.log(error)
                };
                window.gapi.signin2.render('loginButton', opts);
            });
        });
    });

    return (
        <section className={styles.loginContainer}>
            <Logo />
            {authError && (
                <Alert variant='danger'>
                    {authError}
                </Alert>
            )}
            <button id="loginButton">Login with Google</button>
        </section>
    );
}
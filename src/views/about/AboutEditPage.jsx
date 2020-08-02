import React from 'react';
import ReactMde from 'react-mde';
import styles from './AboutEditPage.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getAboutPage, getAboutPreview, editAboutPageOnMaster } from '../../api/about';
import { useHistory } from 'react-router-dom';
import { setAuthError } from '../../api/state/actions';
import Button from 'react-bootstrap/Button';

export default function AboutEditPage() {
    const [value, setValue] = React.useState('');
    const [selectedTab, setSelectedTab] = React.useState('write');
    
    const authToken = useSelector(state => state.authToken);
    
    const dispatch = useDispatch();
    const history = useHistory();

    React.useEffect(() => {
        getAboutPage(authToken, json => {
            if (json.isAuthorized === false) {
                dispatch(setAuthError(json.error));
                history.push('/');
            }
            setValue(json.contents);
        });
    }, [authToken, dispatch, history]);
    
    function formSubmit() {
        editAboutPageOnMaster(authToken, value, json => {
            if (json.isAuthorized === false) {
                dispatch(setAuthError(json.error));
                history.push('/');
            }
        });
    }

    return (
        <form onSubmit={formSubmit}>
            <div className={styles.editContainer}>
                <ReactMde
                    value={value}
                    onChange={setValue}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    minEditorHeight={650}
                    generateMarkdownPreview={markdown => getAboutPreview(authToken, markdown)}
                 />
                <Button variant="primary" className="modalButton" type="submit">Save</Button>
            </div>
        </form>
    );
}

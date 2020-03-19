import React, {useEffect} from 'react';
import classes from './Search.module.css';

//Routing
import { useLocation } from 'react-router-dom';

// UI
import TextInput from '../../components/UI/TextField/TextInput';
import Spinner from '../../components/UI/Spinner/Spinner';
import ScrollUpOnMount from '../../components/ScrollUpOnMount/SrollUpOnMount';
import lost from '../../images/lost.svg';

// Redux
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import searchVideoAsync from '../../store/actions/searchVideoAsync';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search(props) {
    
    // To read url search params
    const query = useQuery();

    useEffect(() => {
        const searchedWord = query.get('word');
        if (searchedWord) {
            props.onUpdateText(searchedWord);
            props.onSearchVideo(searchedWord);
        }
    }, []);

    function submitButtonClickedHandler() {
        window.scrollTo(0, 0);
        props.history.push(props.history.location.pathname + `?word=${props.text}`);
        props.onSearchVideo(props.text);
    }

    return <>
        <ScrollUpOnMount/>
        <div className={classes.SearchSection} style={props.submitButtonClicked ? {height: '30vh', transition: 'height 0.3s ease'} : null}>
            <div className={classes.SearchBox}>
                <TextInput
                label='Search for a word'
                variant='filled'
                value={props.text}
                onChange={props.onUpdateText}
                onSubmit={submitButtonClickedHandler}
                disableSubmit={props.text.length === 0 || props.loading}
                />
            </div>
        </div>

        {props.loading ? 
            <div className={classes.SpinnerBox}>
                <Spinner/>
            </div>
        : null}

        {props.lastSearchSuccessful && !props.loading ?
        
            <div className={classes.ResultsSection}>
                <h2>Results for <span className='accented-text'>{props.lastSearchedWord}</span></h2>
                <iframe title='main' width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${props.video.id}?start=${props.video.start}&end=${props.video.end}&autoplay=true`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        : null}

        {props.lastSearchSuccessful === false && !props.loading ?
            <div className={classes.ResultsSection}>
                <h2>Hmm, I can't find a video for <span className='accented-text'>{props.lastSearchedWord}</span></h2>
                <img src={lost} alt='lost'/>
            </div>
        : null}
    </>
}

const mapStateToProps = state => {
    return {
        text: state.search.text,
        video: state.search.inspectedVideo,
        loading: state.search.loading,
        lastSearchedWord: state.search.lastSearchedWord,
        lastSearchSuccessful: state.search.lastSearchSuccessful,
        submitButtonClicked: state.search.submitButtonClicked
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateText: text => dispatch({type: actionTypes.UPDATE_SEARCH_TEXT, text}),
        onSearchVideo: word => dispatch(searchVideoAsync(word))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);

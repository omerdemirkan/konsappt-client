import * as actionTypes from './actionTypes';
// import stringToSeconds from '../../utils/stringToSeconds';

import axios from '../../axios';

export default word => {
    return dispatch => {
        dispatch(searchVideoStart());

        axios.get('/captions?search=' + word)
        .then(res => {
            console.log(res.data);
            const videos = res.data.map(video => {
                return {
                    id: video.videoId,
                    start: Math.floor(video.start),
                    end: Math.ceil(video.start + video.duration),
                    sentence: video.captions
                }
            });

            console.log(videos);

            if (videos.length > 0) {
                dispatch(searchVideoSuccess(videos, word));
            } else {
                dispatch(searchVideoFailure(word));
            }
            
        })
        .catch(err => {
            dispatch(searchVideoFailure(word));
        });
    }
}


const searchVideoStart = () => {
    return {type: actionTypes.SEARCH_VIDEO_START};
}

const searchVideoSuccess = (videos, word) => {
    return {type: actionTypes.SEARCH_VIDEO_SUCCESS, videos, word};
}

const searchVideoFailure = word => {
    return {type: actionTypes.SEARCH_VIDEO_FAILURE, word};
}
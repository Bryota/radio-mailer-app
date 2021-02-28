import React from 'react';
import Header from './Header';
import { dateToString } from '../helpers/DateToString';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import '../css/reset.css';
import '../css/common.css';
import '../css/single.css';

const Single = (props) => {
    const { list } = props.location.state;
    const date = dateToString(list.date);

    const pageBack = () => {
        props.history.goBack();
    }

    return (
        <>
            <Header />
            <div className="bg_color"></div>
            <div className="single_wrap">
                <div className="single_item">
                    <p className="single_title">番組</p>
                    <p className="single_content">{ list.program }</p>
                </div>
                <div className="single_item">
                    <p className="single_title">コーナー</p>
                    <p className="single_content">{ list.corner }</p>
                </div>
                <div className="single_item"> 
                    <p className="single_title">投稿日時</p>
                    <p className="single_content">{ date }</p>
                </div>
                <div className="single_item">
                    <p className="single_title">ラジオネーム</p>
                    <p className="single_content">{ list.radioName }</p>
                </div>
                <div className="single_item">
                    <p className="single_title">内容</p>
                    <p className="single_content">{ list.content }</p>
                </div>
            </div>
            <Box m={6} className="text-center single_btn_wrap">
                <Button variant="contained"className="btn single_btn" onClick={pageBack}>戻る</Button>
            </Box>
        </>
    )
}

export default Single;
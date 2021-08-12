import React, { useState } from 'react'
import Input from '../ui-elements/Input'
import Button from '../ui-elements/Button'
import { testUrl } from '../helper'
import Dropdown from '../ui-elements/Dropdown'
import { segmentVideo } from '../apis'
import Video from '../ui-elements/Video'
import '../styles/style.scss'
import toast, { Toaster } from 'react-hot-toast'

const VideoSegmentor = () => {

    const [data, setData] = useState({
        video_link: '',
        segment_setting: '',
        interval_duration: ''
    })

    const [error, setError] = useState({
        video_link: null,
        segment_setting: null,
        interval_duration: null
    })

    const [isloading, setIsLoading] = useState(false)

    const [segmented_videos, setSegmentedVideos] = useState([])

    const all_settings = ['', 'Interval Duration']

    const validate = () => {
        let errorflag = 0, temperror = { ...error }

        Object.keys(data).forEach(el => {
            switch (el) {
                case 'video_link':
                    if (testUrl(data[el])) {
                        temperror[el] = ""
                    } else {
                        errorflag++
                        temperror[el] = "Please enter a valid video link"
                    }
                    break;
                case 'segment_setting':
                    if (data[el].length > 0) {
                        temperror[el] = ""
                    } else {
                        errorflag++
                        temperror[el] = "Please select the segment setting"
                    }
                    break;
                case 'interval_duration':
                    if (Number(data[el]) > 0) {
                        temperror[el] = ""
                    } else {
                        errorflag++
                        temperror[el] = "Please enter a valid duration"
                    }
                    break;
                default:
                    break;
            }
        })

        setError(temperror)
        return errorflag === 0
    }

    const submitHandler = async () => {
        if (validate()) {
            setIsLoading(true)
            let res = await segmentVideo({
                video_link: data.video_link,
                interval_duration: Number(data.interval_duration)
            })

            if (res['reason'] && res['reason'] === "Interval duration is greater than the length of the video!") {
                setError({ ...error, interval_duration: "Interval duration cant be greater than video length." })
                setIsLoading(false)
            } else if (res['reason']) {
                toast("Segmentation failed! Please try again.")
                setIsLoading(false)
            }
            else if (res['interval_videos']) {
                setSegmentedVideos(res['interval_videos'])
                setIsLoading(false)
            }
        }
    }

    const inputHandler = (e) => {
        const name = e.target.name
        const value = e.target.value

        if (name === 'interval_duration' && (value.length === 0 || /^\d+$/.test(value))) {
            setData({
                ...data,
                [name]: value
            })
        }
        else if (name !== 'interval_duration') {
            setData({
                ...data,
                [name]: value
            })
        }
    }

    return (
        <div className="container">
            <Toaster />
            <div className="form-wrapper">

                <h1>Segment Video</h1>
                <hr />
                <br /><br />

                <Input label="Video Link.." type="url" value={data.video_link} name="video_link" inputHandler={inputHandler} errorMessage={error.video_link} style={{ marginLeft: "0px" }} />

                <br /><br /><br />
                <Dropdown label="Select Segment settings.." value={data.segment_setting} name="segment_setting" changeHandler={inputHandler} options={all_settings} errorMessage={error.segment_setting} />

                <br /><br /><br />
                <Input label="Interval Duration (in seconds).." classname="interval-duration" pattern="\d*" value={data.interval_duration} inputMode="numeric" name="interval_duration" inputHandler={inputHandler} errorMessage={error.interval_duration} style={{ marginLeft: "0px" }} />

                <br /> <br />
                <Button label="Segment Video" clickHandler={submitHandler} isloading={isloading} />
                <br /> <br />

                {segmented_videos.map(el => <Video link={el.video_url} key={"#" + el.video_url + "$"} />)}

            </div>
        </div>
    )
}

export default VideoSegmentor;
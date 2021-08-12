import React, { useState, Fragment } from 'react'
import Input from '../ui-elements/Input'
import Button from '../ui-elements/Button'
import { testUrl, isNumber } from '../helper'
import { combineVideo } from '../apis'
import Video from '../ui-elements/Video'
import '../styles/style.scss'
import toast, { Toaster } from 'react-hot-toast'

const VideoCombiner = () => {

    const [row_data, setRowData] = useState([])

    const [video_properties, setVideoProperties] = useState({
        width: '',
        height: ''
    })

    const [error, setError] = useState({
        video_link: null,
        start_at: null,
        end_at: null,
        height: null,
        width: null,
        general: null
    })

    const [isloading, setIsLoading] = useState(false)

    const [combined_video_url, setCombinedVideoUrl] = useState(null)

    const validate = () => {
        let errorflag = 0, temperror = { ...error }

        if (row_data.length >= 2) {
            temperror['general'] = null
            console.log(Number(video_properties.width), video_properties)
            if (Number(video_properties.height) > 0) {
                temperror['height'] = ""
            } else {
                errorflag++
                temperror['height'] = "Invalid video height"
            }

            if (Number(video_properties.width) > 0) {
                temperror['width'] = ""
            } else {
                errorflag++
                temperror['width'] = "Invalid video width"
            }

            row_data.forEach(obj => {
                Object.keys(obj).forEach(el => {
                    switch (el) {
                        case 'video_link':
                            if (testUrl(obj[el])) {
                                temperror[el] = ""
                            } else {
                                errorflag++
                                temperror[el] = "Invalid url. Please check all urls."
                            }
                            break;
                        case 'start_at':
                            if (Number(obj[el]) > 0) {
                                temperror[el] = ""
                            } else {
                                errorflag++
                                temperror[el] = "Invalid start duration"
                            }
                            break;
                        case 'end_at':
                            if (Number(obj[el]) > 0) {
                                temperror[el] = ""
                            } else {
                                errorflag++
                                temperror[el] = "Invalid end duration"
                            }
                            break;
                        default:
                            break;
                    }
                })
            })
        } else {
            temperror['general'] = "Minimum 2 videos required to be combined"
            errorflag++
        }

        setError(temperror)
        return errorflag === 0

    }

    const submitHandler = async () => {
        if (validate()) {
            setIsLoading(true)
            let res = await combineVideo({
                segments: [...row_data],
                height: video_properties.height,
                width: video_properties.width
            })

            if (res['reason']) {
                toast("Failed to combine videos. Please try again.")
                setIsLoading(false)
            }
            else if (res['video_url']) {
                setCombinedVideoUrl(res['video_url'])
                setIsLoading(false)
            }
        }
    }

    const inputHandler = (e, idx) => {
        const name = e.target.name
        const value = e.target.value
        const temp = [...row_data]

        if ((name === 'height' || name === 'width') && isNumber(value)) {
            setVideoProperties({ ...video_properties, [name]: value })
        }
        else if ((name === 'start' || name === 'end') && isNumber(value)) {
            temp[idx][name] = value
            setRowData([...temp])
        }
        else if ((name !== 'start' && name !== 'end' && name !== 'height' && name !== 'width')) {
            temp[idx][name] = value.trim()
            setRowData([...temp])
        }
    }

    const manageRow = (e, idx) => {
        switch (e.target.name) {
            case 'add':
                setRowData([...row_data, {
                    video_link: '',
                    start: '',
                    end: ''
                }])
                break;
            case 'delete':
                let temp = row_data.splice(idx, 1)
                setRowData(temp)
                break;
            default:
                break;
        }
    }

    return (
        <div className="container">
            <Toaster />
            <div className="form-wrapper">

                <h1>Combine Video</h1>
                <hr />
                <br /><br />

                <Button label="Add Video" clickHandler={manageRow} name='add' isloading={false} classname="add-video" />

                <br />
                {row_data.map((el, idx) => {
                    return (
                        <div className="row" key={"row-" + idx}>

                            <Input label="Video Link.." type="url" classname={`combine-video-${idx + 1}`} value={el.video_link} name="video_link" inputHandler={e => inputHandler(e, idx)} style={{ width: "100%", marginLeft: "0px" }} />

                            <Input label="Start at (in seconds).." classname={`combine-video-range-duration-start-${idx + 1}`} labelclass="combine-video-range-duration-label" pattern="\d*" value={el.start} inputMode="numeric" name="start" inputHandler={e => inputHandler(e, idx)} style={{ width: "10%" }} />

                            <Input label="End at (in seconds).." classname={`combine-video-range-duration-end-${idx + 1}`} labelclass="combine-video-range-duration-label" pattern="\d*" value={el.end} inputMode="numeric" name="end" inputHandler={e => inputHandler(e, idx)} style={{ width: "10%" }} />

                            <Button label="Delete" clickHandler={e => manageRow(e, idx)} name='delete' isloading={false} classname={`delete-combine-video-range-duration-${idx + 1}`} />

                        </div>
                    )
                })}

                <br />
                <div className="row">
                    <Input label="Video Height.." classname="video-height" pattern="\d*" value={video_properties.height} inputMode="numeric" name="height" inputHandler={inputHandler} style={{ width: "10%", marginLeft: "0px" }} />

                    <Input label="Video Width.." classname="video-width" pattern="\d*" value={video_properties.width} inputMode="numeric" name="width" inputHandler={inputHandler} style={{ width: "10%" }} />
                </div>

                <br /> <br />
                <Button label="Combine Video(s)" classname="combine-video" clickHandler={submitHandler} isloading={isloading} />

                <br /><br />
                <div className="error-message">
                    {error.general && <Fragment>{error.general} <br /></Fragment>}
                    {error.video_link && <Fragment>{error.video_link} <br /></Fragment>}
                    {error.start_at && <Fragment>{error.start_at} <br /></Fragment>}
                    {error.end_at && <Fragment>{error.end_at} <br /></Fragment>}
                    {error.height && <Fragment>{error.height} <br /></Fragment>}
                    {error.width && <Fragment>{error.width} <br /></Fragment>}
                </div>

                {combined_video_url && <Video link={combined_video_url} height={video_properties.height} width={video_properties.width} />}

            </div>
        </div>
    )
}

export default VideoCombiner;
import React from 'react'

const Video = ({ width = '320', height = '240', link }) => {
    return (
        <video width={width} height={height} controls style={{ marginLeft: '10px', marginRight: '10px' }}>
            <source src={link} type="video/mp4" />
        </video>
    )
}

export default Video;

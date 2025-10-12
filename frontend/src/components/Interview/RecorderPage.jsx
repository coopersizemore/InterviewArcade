import { useEffect, useState } from "react"

const RecorderPage = () => {

    const chunks = []
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [blob, setBlob] = useState('')

    useEffect(() => {
        console.log("Started RecordAudio method")
        if (mediaRecorder !== null){
            console.log("Ondatavailable event to be set")
            mediaRecorder.ondataavailable = (e) => {
                console.log("On data event called")
                if (e.data.size > 0) {
                    chunks.push(e.data)
                }
            }
            console.log("Ondatavailable event set")

            mediaRecorder.onstop = (e) => {
                console.log("MediaRecorder stopped")
                setBlob(new Blob(chunks))
            }

            console.log("stop event created")
            try {
                mediaRecorder.start(10000)
                console.log(mediaRecorder.state);   
            } catch (errr){
                console.error(`Error in starting: ${err.message}`)
            }
            console.log("recording started")
        }
        console.log("Finished execution of RecordAudio")
    }, mediaRecorder)
    // const RecordAudio = (currentMediaRecorder) => {
        
    // }

    useEffect(() => {
        const fetchBlob64 = async() => {
            if (blob !== null){
                const blob64 = await blob.text()
                console.log(`${blob64}`)
            }
        }
        
    }, [blob])
    useEffect(() => {
        //create the media stream
        let mediaStream = null
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
            console.log("getUserMedia is supported")
            navigator.mediaDevices.getUserMedia({ audio: true}).then((stream) => {
                console.log("stream created")
                const recorder = new MediaRecorder(stream)
                setMediaRecorder(recorder )
                // console.log("RecordAudio method going to be called")
                // RecordAudio(mediaRecorder)
            }).catch((err) => {
                console.error(`media error: ${err}`)
            })

            
        }

        // pass in media stream to media recorder

        //start recording, control ondataavailable events with timeslice

        // push ondatavailable data to chunks

        // send over total chunks as a finalized blob

    }, [])

    const stopRecording = (currentMediaRecorder) => {
        console.log(currentMediaRecorder.state)
        if (currentMediaRecorder.state == 'recording'){
            console.log("Event stopped")
            currentMediaRecorder.stop()
        }
    }

    return (
        <button onClick={() => stopRecording(mediaRecorder)}> TestRecord </button>
    )

}

export default RecorderPage
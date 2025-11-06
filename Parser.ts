
type Word = {
    speakerId: string
    type: string
    end: number
    text: string
}

type Sentence = {
    sentenceID: number
    speakerId: string
    text: string
}


export function parseText(object_from_EL: {
    text: string,
    languageCode: string,
    transcriptionId: string,
    languageProbability:string,
    words: Word[]
[key:string]: any
}) {

    const arrRes:Sentence[] = []
    let speakerId = ''
    let sentenceIDNow = 0

    for (const arr of object_from_EL.words) {
        if (speakerId === arr.speakerId && arr.type === "word") {
            const obj = arrRes.find(o => o.sentenceID === sentenceIDNow)
            if (obj) {
                obj.text = obj.text + arr.text + " "
            } else {
                arrRes.push({
                    sentenceID: sentenceIDNow,
                    speakerId: arr.speakerId,
                    text: arr.text + " "
                })
            }

        } else if (speakerId !== arr.speakerId && arr.type === "word") {
            sentenceIDNow++
            arrRes.push({
                sentenceID: sentenceIDNow,
                speakerId: arr.speakerId,
                text: arr.text + " "
            })
        }
        speakerId = arr.speakerId
    }
    return arrRes

}
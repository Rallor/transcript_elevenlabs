// @ts-ignore
import dotenv from "dotenv";
import fs from "fs";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as process from "node:process";
import { Client } from 'pg';
import { parseText } from './Parser'
dotenv.config();


const call_id_array = [184292] //ТУТ список ІД файлів які треба додати транскрибацію

async function writeToDatabase(pg_client:any, data:[], file_id:number) {
    for(const item of data){
         await pg_client.query(`INSERT INTO okko.transcript_call (sentence,file_id,speakerId,sentence_id) VALUES ($1,$2,$3,$4) RETURNING *`,
             [item.text,file_id, item.speakerId,item.sentenceID]
    )}
    return "OK"
}

async function main() {
    const pg_client = new Client({
        user: `${process.env.BD_USER}`,
        host: `${process.env.BD_HOST}`,
        database: `${process.env.BD_DATABASE}`,
        password: `${process.env.BD_PASSWORD}`,
        port: `${process.env.BD_PORT}`,
    });
    await pg_client.connect();

    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    try {
        for (const call_id of call_id_array) {
            const response = await client.speechToText.convert({
                apiKey: process.env.ELEVENLABS_API_KEY,
                modelId: "scribe_v1",
                num_speakers:3,
                language_code:"uk",
                diarize:"true",
                file:fs.createReadStream("C:\\Users\\Nazar\\Downloads\\8d61e4f6-6d47-4aac-bc36-616db5e8c6bb_ 380507763288_7030.mp3")
                //cloudStorageUrl: `https://cc.gng.com.ua/api/storage/download/${call_id}/stream?access_token=${process.env.WEBITEL_APi_KEY}`,
            });
            const parsedText =  parseText(response)
            console.log(parsedText)
            await writeToDatabase(pg_client,parsedText,call_id).then(data => console.log(`Transcript for call id: ${call_id} create success!`));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pg_client.end();
    }
}
main();

